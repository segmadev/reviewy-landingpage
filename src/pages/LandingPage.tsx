import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import UKFocused from '../components/UKFocused';
import HowItWorks from '../components/HowItWorks';
import WhyReviewyMe from '../components/WhyReviewyMe';
import WhatYouGet from '../components/WhatYouGet';
import Comparison from '../components/Comparison';
import Testimonials from '../components/Testimonials';
import ClosingCTA from '../components/ClosingCTA';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <UKFocused />
        <div id="how-it-works"><HowItWorks /></div>
        <div id="why-us"><WhyReviewyMe /></div>
        <WhatYouGet />
        <Comparison />
        <div id="testimonials"><Testimonials /></div>
        <ClosingCTA />
      </main>
      <Footer />
    </div>
  );
}
