import { Link } from 'react-router';
import {
  FileText, MapPin, CheckCircle,
  ClipboardList, CalendarCheck, BrainCircuit,
  Wrench, Presentation, Clock, Check
} from 'lucide-react';
import RunForOfficeHero from './components/RunForOfficeHero';

interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;
  link: string;
  status: 'ready' | 'coming-soon';
}

const features: Feature[] = [
  {
    title: 'Eligibility Checker',
    description: 'Find out if you or another candidate has what it takes to lead.',
    icon: <CheckCircle className="w-6 h-6 text-[#006837]" />,
    link: '/run-for-office/eligibility',
    status: 'ready',
  },
  {
    title: 'New Class White Paper',
    description: 'A civic manifesto for aspiring leaders.',
    icon: <FileText className="w-6 h-6 text-[#006837]" />,
    link: 'https://drive.google.com/file/d/1_6qxnofDSeg8FPTbcpPdOq5On-g2PO0Q/view',
    status: 'ready',
  },
  {
    title: 'Office Explainers',
    description: 'Understand what each political role really does.',
    icon: <ClipboardList className="w-6 h-6 text-[#006837]" />,
    link: '/run-for-office/explainers',
    status: 'coming-soon',
  },
  {
    title: 'Campaign Planner Toolkit',
    description: 'Resources to structure your campaign.',
    icon: <ClipboardList className="w-6 h-6 text-[#006837]" />,
    link: '/run-for-office/planner',
    status: 'coming-soon',
  },
  {
    title: 'Voter Data + Ward Map',
    description: 'Insights for grassroots strategy.',
    icon: <MapPin className="w-6 h-6 text-[#006837]" />,
    link: '/run-for-office/strategy-map',
    status: 'coming-soon',
  },
  {
    title: 'INEC Deadlines & Party Processes',
    description: 'Stay aligned with the timeline.',
    icon: <CalendarCheck className="w-6 h-6 text-[#006837]" />,
    link: '/run-for-office/timeline',
    status: 'coming-soon',
  },
  {
    title: 'Manifesto Creation Support',
    description: 'Access Nigeria 2050 – Governance Agenda Blueprint.',
    icon: <Presentation className="w-6 h-6 text-[#006837]" />,
    link: '/run-for-office/manifesto-support',
    status: 'coming-soon',
  },
  {
    title: 'Training & Capacity Building',
    description: 'Acquire the skills you need to govern effectively.',
    icon: <BrainCircuit className="w-6 h-6 text-[#006837]" />,
    link: '/run-for-office/training',
    status: 'coming-soon',
  },
  {
    title: 'Get Technical Support',
    description: 'Fundraising, Mobilisation, Technology, Operations.',
    icon: <Wrench className="w-6 h-6 text-[#006837]" />,
    link: '/run-for-office/technical-support',
    status: 'coming-soon',
  },
];

const RunForOffice = () => {
  return (
    <section className="p-6 md:p-12 font-poppins bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <RunForOfficeHero />
        {/* <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#006837]">Lead – Step Into Leadership</h1>
          <p className="text-gray-700 mt-2 max-w-xl mx-auto">
            From follower to forerunner. This is where citizens become candidates and changemakers.
          </p>
        </div> */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const isReady = feature.status === 'ready';

            const Card = () => (
              <div className="border rounded-lg p-6 bg-gray-50 hover:bg-white transition shadow relative overflow-hidden">
                {/* Status badge in top right */}
                {isReady ? (
                  <div className="absolute top-2 right-2 bg-[#006837]/10 text-[#006837] border-[#8cc63f]/20 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 border">
                    <Check className="w-3 h-3" /> Ready
                  </div>
                ) : (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-[10px] font-semibold px-2 py-1 rounded shadow-md flex items-center gap-1 animate-pulse">
                    <Clock className="w-3 h-3" /> Coming Soon
                  </div>
                )}


                {/* Card content */}
                <div className="flex items-center gap-3 mb-4 mt-2">
                  {feature.icon}
                  <h3 className={`text-lg font-semibold ${isReady ? 'text-[#006837] group-hover:underline' : 'text-[#006837]/80'}`}>
                    {feature.title}
                  </h3>
                </div>
                <p className={`text-sm leading-relaxed ${isReady ? 'text-gray-600' : 'text-gray-500'}`}>
                  {feature.description}
                </p>
              </div>
            );

            return isReady ? (
              <Link
                key={feature.title}
                to={feature.link}
                target={feature.link.startsWith('http') ? '_blank' : undefined}
                className="group"
              >
                <Card />
              </Link>
            ) : (
              <div key={feature.title} className="cursor-not-allowed opacity-90 group">
                <div className="filter grayscale-[15%]">
                  <Card />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RunForOffice;
