import { Camera, Clock, FileText, Wifi, Smartphone, ArrowUpRight, Boxes, CheckCircle } from "lucide-react";
// import { useState } from "react";

const IssueReporting = () => {
  // const [email, setEmail] = useState("");
  // const [isSubscribed, setIsSubscribed] = useState(false);

  // const handleSubscribe = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (email && email.includes('@')) {
  //     setIsSubscribed(true);
  //     // In a real app, you would send this to a backend service
  //     console.log("Subscribed with email:", email);
  //   }
  // };
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-poppins">
      {/* Hero Section */}
      <div className="relative w-full rounded-xl overflow-hidden mb-6 md:mb-10 bg-gradient-to-r from-green-700 to-green-500">
        <div className="absolute inset-0 bg-black/20 z-0" />
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: "url('/curved_line.png')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 md:p-10">
          <div className="text-white max-w-xl mb-6 md:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <div className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold inline-flex items-center gap-1.5 shadow-sm">
                <Clock className="w-3.5 h-3.5" /> Coming Soon
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">Hyper-Local Issue Reporting</h1>
            <p className="text-lg md:text-xl opacity-90 mb-4">
              Report corruption, service failure, or development gaps directly from your community.
            </p>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="mb-12">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">What to Expect</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {features.map(feature => (
            <div key={feature.title} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${feature.bgColor}`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">How It Works</h2>

        <div className="relative">
          {/* Steps Connector */}
          <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-green-200 hidden sm:block"></div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4 items-start relative">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex-shrink-0 flex items-center justify-center font-semibold shadow-md z-10">
                  {index + 1}
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-green-50 to-indigo-50 rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between border border-green-200">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-2">
            <Clock className="w-6 h-6 text-green-600" /> Launch Date
          </h2>
          <p className="text-gray-600 mb-4 md:mb-0">
            We're working diligently to bring you this feature by <span className="font-semibold text-green-600">September 2025</span>. Stay tuned for updates!
          </p>
        </div>
        <button
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm flex items-center gap-2 self-start md:self-center"
          onClick={() => window.alert('Thanks for your interest! We\'ll notify you when this feature is available.')}
        >
          Get Notified
          <CheckCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const features = [
  {
    title: "Multi-format Reporting",
    description: "Submit reports using photos, voice notes, or text messages, making it easy for everyone to contribute.",
    icon: <Camera className="text-pink-600 h-6 w-6" />,
    bgColor: "bg-pink-50"
  },
  {
    title: "Offline Support",
    description: "Report issues even without internet connection. Data will sync when you're back online.",
    icon: <Wifi className="text-green-600 h-6 w-6" />,
    bgColor: "bg-green-50"
  },
  {
    title: "USSD/SMS Access",
    description: "Use feature phones to report issues via SMS or USSD, ensuring accessibility for all citizens.",
    icon: <Smartphone className="text-blue-600 h-6 w-6" />,
    bgColor: "bg-blue-50"
  },
  {
    title: "Blockchain Logging",
    description: "All reports are logged on blockchain for transparency, security and to prevent tampering.",
    icon: <Boxes className="text-indigo-600 h-6 w-6" />,
    bgColor: "bg-indigo-50"
  },
  {
    title: "Public Dashboard",
    description: "Track reported issues, their status, and resolution progress in a public, transparent dashboard.",
    icon: <FileText className="text-amber-600 h-6 w-6" />,
    bgColor: "bg-amber-50"
  },
  {
    title: "Auto-Escalation",
    description: "Issues that remain unresolved are automatically escalated to higher authorities after set timeframes.",
    icon: <ArrowUpRight className="text-red-600 h-6 w-6" />,
    bgColor: "bg-red-50"
  }
];

const steps = [
  {
    title: "Identify & Document",
    description: "Spot an issue in your community, take photos or videos, and note the exact location."
  },
  {
    title: "Submit Report",
    description: "Use our app, SMS, USSD, or website to submit the report with supporting evidence."
  },
  {
    title: "Verification",
    description: "Our system verifies reports through community validation and data triangulation."
  },
  {
    title: "Escalation",
    description: "Reports are sent to relevant authorities with automated reminders for action."
  },
  {
    title: "Track Progress",
    description: "Follow the progress of your report on our public dashboard in real-time."
  }
];

export default IssueReporting;