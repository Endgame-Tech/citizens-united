import { BookOpen, GraduationCap, CheckCircle, Clock, Award, CheckSquare, BarChart } from "lucide-react";
import { useState, useEffect } from "react";

const CivicEducationHub = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set launch date to September 1, 2025
    const launchDate = new Date('September 1, 2025 00:00:00').getTime();

    // Update countdown every second
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      // Calculate time units
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });

      // Clear interval if launch date is reached
      if (distance < 0) {
        clearInterval(timer);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-poppins">
      {/* Hero Section */}
      <div className="relative w-full rounded-xl overflow-hidden mb-6 md:mb-10 bg-gradient-to-r from-[#006837]/80 to-[#8cc63f]/80">
        <div className="absolute inset-0 bg-black/30 z-0" />
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
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold inline-flex items-center gap-1.5 shadow-sm">
                <Clock className="w-3.5 h-3.5" /> Coming Soon
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">Civic Education Hub</h1>
            <p className="text-lg md:text-xl opacity-90 mb-4">
              Bite-sized learning modules, explainers, quizzes, and success stories about rights, responsibilities, and political impact.
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
                <div className="w-8 h-8 rounded-full bg-[#006837] text-white flex-shrink-0 flex items-center justify-center font-semibold shadow-md z-10">
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

      {/* Countdown Timer */}
      <div className="mb-12">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-[#006837]" /> Countdown to Launch
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <div className="bg-white rounded-xl p-4 border border-[#006837]/20 shadow-sm text-center">
            <div className="text-4xl font-semibold text-[#006837] mb-1">{countdown.days}</div>
            <div className="text-sm text-gray-600">Days</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#006837]/20 shadow-sm text-center">
            <div className="text-4xl font-semibold text-[#006837] mb-1">{countdown.hours}</div>
            <div className="text-sm text-gray-600">Hours</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#006837]/20 shadow-sm text-center">
            <div className="text-4xl font-semibold text-[#006837] mb-1">{countdown.minutes}</div>
            <div className="text-sm text-gray-600">Minutes</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#006837]/20 shadow-sm text-center">
            <div className="text-4xl font-semibold text-[#006837] mb-1">{countdown.seconds}</div>
            <div className="text-sm text-gray-600">Seconds</div>
          </div>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-[#006837]/10 to-[#8cc63f]/10 rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between border border-[#006837]/20">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-2">
            <Clock className="w-6 h-6 text-[#006837]" /> Launch Date
          </h2>
          <p className="text-gray-600 mb-4 md:mb-0">
            We're working diligently to bring you this feature by <span className="font-semibold text-[#006837]">September 2025</span>. Stay tuned for updates!
          </p>
        </div>
        <button
          className="px-6 py-3 bg-[#006837] text-white rounded-lg hover:bg-[#004d2a] transition shadow-sm flex items-center gap-2 self-start md:self-center"
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
    title: "Interactive Learning Modules",
    description: "Engaging, bite-sized modules on civic rights, governance, and democratic processes in Nigeria.",
    icon: <BookOpen className="text-blue-600 h-6 w-6" />,
    bgColor: "bg-blue-50"
  },
  {
    title: "Knowledge Quizzes",
    description: "Test your understanding with interactive quizzes and get immediate feedback on your answers.",
    icon: <CheckSquare className="text-purple-600 h-6 w-6" />,
    bgColor: "bg-purple-50"
  },
  {
    title: "Civic Certification",
    description: "Earn certificates and badges as you complete courses and demonstrate civic knowledge.",
    icon: <Award className="text-amber-600 h-6 w-6" />,
    bgColor: "bg-amber-50"
  },
  {
    title: "Success Stories",
    description: "Real examples of Nigerian citizens who have created positive change in their communities.",
    icon: <CheckCircle className="text-green-600 h-6 w-6" />,
    bgColor: "bg-green-50"
  },
  {
    title: "Visual Explainers",
    description: "Complex political concepts broken down into simple, easy-to-understand visual guides.",
    icon: <BarChart className="text-pink-600 h-6 w-6" />,
    bgColor: "bg-pink-50"
  },
  {
    title: "Mobile Learning",
    description: "Access all educational content on-the-go from your smartphone or tablet device.",
    icon: <GraduationCap className="text-orange-600 h-6 w-6" />,
    bgColor: "bg-orange-50"
  }
];

const steps = [
  {
    title: "Choose a Learning Path",
    description: "Select from various topics like civic rights, democratic processes, or governance structures based on your interests."
  },
  {
    title: "Complete Bite-sized Modules",
    description: "Work through engaging, interactive learning materials at your own pace, on any device."
  },
  {
    title: "Test Your Knowledge",
    description: "Take quizzes to reinforce your learning and identify areas where you might want to learn more."
  },
  {
    title: "Earn Certifications",
    description: "Collect badges and certificates as you complete courses to showcase your civic knowledge."
  },
  {
    title: "Apply & Share Knowledge",
    description: "Use what you've learned to participate more effectively in democratic processes and share with others."
  }
];

export default CivicEducationHub;