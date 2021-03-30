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

  const fullPath = router.asPath
  const query = path.basename(fullPath)

  useEffect(() => {
    const browserLocale = window.navigator.language.substr(0, 2)
    if(!isTopPage && isValidQuery(query) && locale != browserLocale) router.push(fullPath, fullPath, { locale: browserLocale })
  })

  if(locale == 'ja') t = ja

  return { locale, t }
}