import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import KeyFeatures from './components/KeyFeatures';
import CVInMotion from './components/CVInMotion';
import WhyReviewyMe from './components/WhyReviewyMe';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <WhyReviewyMe />
        <CVInMotion />
        <KeyFeatures />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

export default App;
