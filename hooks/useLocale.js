import en from '../locales/en'
import ja from '../locales/ja'

import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function useLocale(isTopPage) {
  const router = useRouter()
  let locale = router.locale
  let t = en

  useEffect(() => {
    if(!isTopPage) router.push('', '', { locale: window.navigator.language.substr(0, 2) })
  },[])

  if(locale == 'ja') t = ja

  return { locale, t }
}