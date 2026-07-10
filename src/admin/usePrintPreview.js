import { useCallback, useEffect, useState } from 'react'

// Toggles the already-rendered #print-root (see PrintableInvoice) between
// hidden and a full-screen preview overlay, without touching how the
// printable invoice itself is built — preview and print share the exact
// same markup and styling, so what you see is what you'll get.
export function usePrintPreview() {
  const [isOpen, setIsOpen] = useState(false)

  const close = useCallback(() => setIsOpen(false), [])
  const open = useCallback(() => setIsOpen(true), [])

  useEffect(() => {
    const el = document.getElementById('print-root')
    if (!el) return
    el.classList.toggle('preview-active', isOpen)
    document.body.style.overflow = isOpen ? 'hidden' : ''

    const onBackdropClick = (e) => {
      if (e.target === el) close()
    }
    if (isOpen) el.addEventListener('click', onBackdropClick)

    return () => {
      el.classList.remove('preview-active')
      document.body.style.overflow = ''
      el.removeEventListener('click', onBackdropClick)
    }
  }, [isOpen, close])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  return { isPreviewOpen: isOpen, openPreview: open, closePreview: close }
}
