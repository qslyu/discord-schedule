import en from '../locales/en'
import ja from '../locales/ja'

import { useRouter } from 'next/router'

export default function useLocale() {
  const router = useRouter()
  let locale = router.locale
  let t = en

  if(locale == 'ja') t = ja

  return { locale, t }
}