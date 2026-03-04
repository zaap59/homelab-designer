import { useState, useEffect } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
}

// ─── Internal bus ──────────────────────────────────────────────────────────────

type Listener = (toasts: ToastItem[]) => void
let _items: ToastItem[] = []
let _id = 0
const _listeners = new Set<Listener>()

function _notify() {
  _listeners.forEach((l) => l([..._items]))
}

// ─── Public API ────────────────────────────────────────────────────────────────

export function toast(message: string, type: ToastType = 'success', duration = 3000) {
  const id = ++_id
  _items = [..._items, { id, message, type }]
  _notify()
  setTimeout(() => {
    _items = _items.filter((t) => t.id !== id)
    _notify()
  }, duration)
}

export function useToasts() {
  const [items, setItems] = useState<ToastItem[]>([..._items])
  useEffect(() => {
    const listener: Listener = (t) => setItems(t)
    _listeners.add(listener)
    return () => { _listeners.delete(listener) }
  }, [])
  return items
}
