import { useState } from 'react'

export function useToast() {
  const [toasts] = useState([])

  return {
    toasts,
    // placeholder API
    push: (t) => null,
    remove: (id) => null,
  }
}
