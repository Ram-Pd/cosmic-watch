import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../components/SectionWrapper';
import { Button } from '../components/Button';
import LiveMonitoring from "../components/LiveMonitoring";

import { RiskAnalysis } from '../components/RiskAnalysis';

export default function Landing() {
  return (
    <>
      {/* 1. Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cosmic-black bg-[url('https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-black/80 via-cosmic-black/60 to-cosmic-black" />
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-[0.2em] uppercase text-white mb-6">
            Cosmic Watch
          </h1>
          <p className="text-lg md:text-xl text-cosmic-muted tracking-widest uppercase mb-16 max-w-xl mx-auto">
            Real-time Near-Earth Object Monitoring
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/#monitoring">
              <Button variant="outline">Track Live Asteroids</Button>
            </Link>
            <Link to="/#risk">
              <Button variant="primary">Risk Dashboard</Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 2. Mission */}
      <SectionWrapper id="mission" className="bg-cosmic-gray/50">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            className="font-display text-3xl md:text-4xl uppercase tracking-widest text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The Mission
          </motion.h2>
          <motion.p
            className="text-cosmic-muted text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Raw space data is hard to understand. COSMIC WATCH turns NASA&apos;s Near-Earth Object feeds into clear risk categories and live monitoring—so you can see what&apos;s out there without the noise.
          </motion.p>
        </div>
      </SectionWrapper>

      {/* 3. Live Monitoring Preview */}
      <SectionWrapper id="monitoring" className="bg-cosmic-black">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl uppercase tracking-widest text-white mb-12 text-center">
            Live Monitoring
          </h2>
          <LiveMonitoring />
        </div>
      </SectionWrapper>

      {/* 4. Risk Analysis */}
      <SectionWrapper id="risk" className="bg-cosmic-gray/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl uppercase tracking-widest text-white mb-12 text-center">
            Risk Analysis
          </h2>
          <RiskAnalysis />
        </div>
      </SectionWrapper>

      {/* 5. 3D Placeholder */}
      <SectionWrapper id="visualization" className="bg-cosmic-black">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl uppercase tracking-widest text-white mb-6">
            3D Orbit Viewer
          </h2>
          <p className="text-cosmic-muted text-lg mb-8">
            Orbital visualization coming soon.
          </p>
          <div className="h-64 border border-cosmic-border flex items-center justify-center rounded">
            <span className="text-cosmic-muted uppercase tracking-widest text-sm">Placeholder</span>
          </div>
        </div>
      </SectionWrapper>

      {/* 6. Alerts & Community */}
      <SectionWrapper id="alerts" className="bg-cosmic-gray/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl uppercase tracking-widest text-white mb-6">
            Alerts & Community
          </h2>
          <p className="text-cosmic-muted text-lg leading-relaxed">
            Watch specific asteroids and get hourly alerts. Join the global asteroid room in the dashboard for live chat.
          </p>
        </div>
      </SectionWrapper>

      {/* 7. Final CTA */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cosmic-black bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black via-cosmic-black/90 to-transparent" />
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Link to="/dashboard">
            <Button variant="primary" className="text-lg px-10 py-4 border-2">
              Enter the Dashboard
            </Button>
          </Link>
        </motion.div>
      </section>
    </>
  );
}
