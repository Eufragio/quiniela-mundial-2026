import { useEffect } from 'react'
import twemoji from '@twemoji/api'

export function useTwemoji() {
  useEffect(() => {
    function applyTwemoji() {
      twemoji.parse(document.body, {
        folder: 'svg',
        ext: '.svg',
        className: 'twemoji-flag',
      })
    }

    applyTwemoji()

    let debounceId: ReturnType<typeof setTimeout> | null = null
    const observer = new MutationObserver(() => {
      if (debounceId) clearTimeout(debounceId)
      debounceId = setTimeout(applyTwemoji, 50)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
      if (debounceId) clearTimeout(debounceId)
    }
  }, [])
}
