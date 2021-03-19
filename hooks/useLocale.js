import en from '../locales/en'
import ja from '../locales/ja'
import path from 'path'

import { useRouter } from 'next/router'
import { useEffect } from 'react'
import isValidQuery from '../util/isValidQuery'

export default function useLocale(isTopPage) {
  const router = useRouter()
  let locale = router.locale
  let t = en

  const query = path.basename(router.asPath)

  useEffect(() => {
    if(!isTopPage && isValidQuery(query)) router.push(router.asPath, router.asPath, { locale: window.navigator.language.substr(0, 2) })
  },[])

  if(locale == 'ja') t = ja

  return { locale, t }
}