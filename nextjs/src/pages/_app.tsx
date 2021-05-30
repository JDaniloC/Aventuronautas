import { ChallengesProvider } from '../contexts/ChallengeContext'
import '../styles/globals.css'
import '../styles/image-gallery.css'

function MyApp({ Component, pageProps }) {
  return (
    <ChallengesProvider>
      <Component {...pageProps} />
    </ChallengesProvider>
  )
}

export default MyApp
