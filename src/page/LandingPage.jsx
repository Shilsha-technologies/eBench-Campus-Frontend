import React from 'react'
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import AIFeedback from '../components/landing/AIFeedback';
import HowItWorks from '../components/landing/HowItWorks';
import Features from '../components/landing/Features';
import UserSegments from '../components/landing/UserSegments';
import FreeTrial from '../components/landing/FreeTrial';
import Testimonials from '../components/landing/Testimonials';
import Footer from '../components/landing/Footer';
import ContactPage from '../components/landing/ContactUs';

const LandingPage = () => {
    const nav = () => { window.scrollTo(0, 0); };

  return (
    <div className="bg-[#F7FBFF] min-h-screen font-[DM_Sans,system-ui,sans-serif]">
      <Navbar nav={nav} />
      <Hero nav={nav} />
      <AIFeedback />
      <HowItWorks />
      <Features />
      <UserSegments nav={nav} />
      <FreeTrial nav={nav} />
      <ContactPage/>
      <Testimonials />
      <Footer nav={nav} />
    </div>
  )
}

export default LandingPage
