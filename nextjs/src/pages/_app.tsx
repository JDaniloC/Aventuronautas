import { AuthProvider } from '../contexts/AuthContext'
import { AppProps } from 'next/app';
import '../styles/globals.css'
import '../styles/image-gallery.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
