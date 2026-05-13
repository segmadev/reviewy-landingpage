import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import KeyFeatures from '../components/KeyFeatures';
import CVInMotion from '../components/CVInMotion';
import WhyReviewyMe from '../components/WhyReviewyMe';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <div id="how-it-works"><HowItWorks /></div>
        <div id="why-us"><WhyReviewyMe /></div>
        {/* <CVInMotion /> */}
        {/* <KeyFeatures /> */}
        <div id="testimonials"><Testimonials /></div>
      </main>
      <Footer />
    </div>
  );
}
