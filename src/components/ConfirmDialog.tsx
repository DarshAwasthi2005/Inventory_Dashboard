import { useState } from 'react'
import Modal from './Modal'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleConfirm() {
    setBusy(true)
    setError('')
    try {
      await onConfirm()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      )
      setBusy(false)
    }
  }

  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-gray-700">{message}</p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={onCancel}
          disabled={busy}
          className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={busy}
          className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {busy ? 'Please wait...' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
