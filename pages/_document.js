import { ColorModeScript, extendTheme } from "@chakra-ui/react"
import NextDocument, { Html, Head, Main, NextScript } from "next/document"

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
  colors: {
    discord: {
      green: "#43b581",
      yellow: "#faa61a",
      red: "#e94545",
      blue: "#7289da",
      dark: "#2c2f33",
      dark1: "#23272a"
    }
  }
}

export const theme = extendTheme({ config })

export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}