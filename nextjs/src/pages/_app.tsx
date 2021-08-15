import { AuthProvider } from '../contexts/AuthContext'
import '../styles/globals.css'
import '../styles/image-gallery.css'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
