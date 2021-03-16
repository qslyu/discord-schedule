import en from '../locales/en'
import ja from '../locales/ja'
import path from 'path'

import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function useLocale(isTopPage) {
  const router = useRouter()
  let locale = router.locale
  let t = en

  const pageName = path.basename(router.asPath)
  const isEmpty = pageName[0] == '[' && pageName.substr(-1) == ']'

  useEffect(() => {
    if(!isTopPage && !isEmpty) router.push('', '', { locale: window.navigator.language.substr(0, 2) })
  },[])

  if(locale == 'ja') t = ja

  return { locale, t }
}