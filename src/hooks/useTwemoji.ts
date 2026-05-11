import { useEffect } from 'react'
import twemoji from '@twemoji/api'

export function useTwemoji() {
  useEffect(() => {
    twemoji.parse(document.body, {
      folder: 'svg',
      ext: '.svg',
      className: 'twemoji-flag',
    })
  })
}
