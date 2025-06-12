// pages/monitor/index.tsx
// import { FileText, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
// import MonitorHero from './components/MonitorHero';
import MonitorCTA from './components/MonitorCTA';
// import SectionCard from './components/SectionCard';

export default function MonitorHomePage() {

  // const sections = [
  //   {
  //     title: 'Polling Unit Details',
  //     description: 'Enter location and polling unit info including GPS and LGA.',
  //     icon: <MapPin size={28} className="text-green-600" />,
  //     route: '/monitor/polling-unit',
  //   },
  //   {
  //     title: 'Officer Arrival & Verification',
  //     description: 'Track arrival times and verify INEC officer identities.',
  //     icon: <CheckCircle size={28} className="text-green-600" />,
  //     route: '/monitor/officer-arrival',
  //   },
  //   {
  //     title: 'Result Tracking',
  //     description: 'Submit PU result, agent list, and vote tally by party.',
  //     icon: <FileText size={28} className="text-green-600" />,
  //     route: '/monitor/result-tracking',
  //   },
  //   {
  //     title: 'Incident Report',
  //     description: 'Report irregularities like vote buying or violence.',
  //     icon: <AlertTriangle size={28} className="text-red-600" />,
  //     route: '/monitor/incident-reporting',
  //   },
  // ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 font-poppins">
      {/* <MonitorHero /> */}

      <MonitorCTA />

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {sections.map((section, i) => (
          <SectionCard
            key={i}
            title={section.title}
            role="button"
            tabIndex={0}
            description={section.description}
            icon={section.icon}
            onClick={() => navigate(section.route)}
          />
        ))}
      </div> */}
    </div>
  );
}
