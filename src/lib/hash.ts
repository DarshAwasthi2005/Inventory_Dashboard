const PREFIX = 'pbkdf2-sha256'
const ITERATIONS = 600_000 // OWASP recommendation for PBKDF2-HMAC-SHA256
const SALT_BYTES = 16
const KEY_BITS = 256

// Legacy unsalted hash. Kept only so accounts created earlier can still sign in.
export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
}

function fromBase64(text: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(text), (char) => char.charCodeAt(0))
}

async function derive(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
  iterations: number,
): Promise<Uint8Array<ArrayBuffer>> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    key,
    KEY_BITS,
  )
  return new Uint8Array(bits)
}

// Compares strings without stopping at the first difference
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

// Stored format: pbkdf2-sha256$<iterations>$<salt>$<hash>
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
  const hash = await derive(password, salt, ITERATIONS)
  return `${PREFIX}$${ITERATIONS}$${toBase64(salt)}$${toBase64(hash)}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (!stored.startsWith(`${PREFIX}$`)) {
    return safeEqual(await sha256(password), stored) // legacy format
  }
  const [, iterations, salt, expected] = stored.split('$')
  const actual = await derive(password, fromBase64(salt), Number(iterations))
  return safeEqual(toBase64(actual), expected)
}

// True for legacy hashes and for hashes created with fewer iterations than today
export function needsRehash(stored: string): boolean {
  return !stored.startsWith(`${PREFIX}$${ITERATIONS}$`)
}
