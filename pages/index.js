import Header from '../components/header'
import useLocale from '../hooks/useLocale'

export default function Index() {
  const { _, t } = useLocale(true)
  
  return (
    <>
      <Header />
      
    </>
  )
}