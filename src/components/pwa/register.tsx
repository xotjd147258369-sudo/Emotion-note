"use client"

import { useEffect } from "react"

export function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // PWA support is optional; the app remains usable without a worker.
      })
    }

    if (document.readyState === "complete") {
      register()
      return
    }

    window.addEventListener("load", register, { once: true })
    return () => window.removeEventListener("load", register)
  }, [])

  return null
}
