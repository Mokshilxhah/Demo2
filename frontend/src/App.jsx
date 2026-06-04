import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechMarquee from './components/TechMarquee';
import WorkingFlow from './components/WorkingFlow';
import Features from './components/Features';
import TechStack from './components/TechStack';
import DemoProjects from './components/DemoProjects';
import GetStarted from './components/GetStarted';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TechMarquee />
        <WorkingFlow />
        <Features />
        <TechStack />
        <DemoProjects />
        <GetStarted />
      </main>
      <Footer />
    </>
  );
}
