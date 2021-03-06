import { Provider } from 'next-auth/client'
import { ChakraProvider, ColorModeProvider, extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from "@chakra-ui/theme-tools"
import { theme } from './_document'

const breakpoints = createBreakpoints({
  sm: "30em",
  md: "48em",
  lg: "62em",
  xl: "80em",
  "2xl": "96em",
})

export default function App ({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}