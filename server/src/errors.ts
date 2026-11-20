// An error that carries an HTTP status and a stable machine-readable code
export class HttpError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, message: string, code = 'ERROR') {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
  }
}
