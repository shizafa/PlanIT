import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import AboutUs from '../components/AboutUs.jsx'
import ItineraryPreview from '../components/ItineraryPreview.jsx'
import ClosingVideo from '../components/ClosingVideo.jsx'
import Footer from '../components/Footer.jsx'

function Landing() {
  return (
    <div className="min-h-screen bg-cream font-sans text-charcoal">
      <Navbar />
      <Hero />
      <HowItWorks />
      <AboutUs />
      <ItineraryPreview />
      <ClosingVideo />
      <Footer />
    </div>
  )
}

export default Landing
