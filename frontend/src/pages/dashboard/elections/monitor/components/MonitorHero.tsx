// components/MonitorHero.tsx
// import React from 'react';

export default function MonitorHero() {
  return (
    <section
      className="w-full relative py-24 px-6 text-center rounded-xl shadow-md mb-10 overflow-hidden"
      style={{ backgroundImage: `url('/15997.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />
      <div className="relative z-10 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Empower Electoral Transparency</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto">
          A feature to report live election activities and promote electoral credibility. Every submission helps build a fairer democracy.
        </p>
      </div>
    </section>
  );
}

