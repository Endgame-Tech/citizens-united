import React from "react";
// import {
//   GraduationCap,
//   HeartPulse,
//   Briefcase,
//   Gavel,
//   Building2,
//   MapPin,
// } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
import StateOfNationHero from "./components/StateOfNationHero";
import StateOfNationGallery from "./components/StateOfNationGallery_new";

// const stats = [
//   {
//     title: "Education Access",
//     value: "73%",
//     change: "+5% this year",
//     icon: <GraduationCap className="w-5 h-5 text-[#006837]" />,
//   },
//   {
//     title: "Healthcare Reach",
//     value: "61%",
//     change: "+2% this quarter",
//     icon: <HeartPulse className="w-5 h-5 text-[#006837]" />,
//   },
//   {
//     title: "Employment Rate",
//     value: "48%",
//     change: "-1.5% since Jan",
//     icon: <Briefcase className="w-5 h-5 text-[#006837]" />,
//   },
//   {
//     title: "Public Infrastructure",
//     value: "59%",
//     change: "+8% improvement",
//     icon: <Building2 className="w-5 h-5 text-[#006837]" />,
//   },
//   {
//     title: "Governance Score",
//     value: "66%",
//     change: "Stable",
//     icon: <Gavel className="w-5 h-5 text-[#006837]" />,
//   },
//   {
//     title: "Your LGA Ranking",
//     value: "12th / 774",
//     change: "Top 2%",
//     icon: <MapPin className="w-5 h-5 text-[#006837]" />,
//   },
// ];

// const educationData = [
//   { name: "Jan", value: 60 },
//   { name: "Feb", value: 65 },
//   { name: "Mar", value: 70 },
//   { name: "Apr", value: 75 },
//   { name: "May", value: 80 },
// ];

// const healthcareData = [
//   { name: "Jan", value: 50 },
//   { name: "Feb", value: 52 },
//   { name: "Mar", value: 55 },
//   { name: "Apr", value: 57 },
//   { name: "May", value: 61 },
// ];

// const employmentData = [
//   { name: "Jan", value: 45 },
//   { name: "Feb", value: 46 },
//   { name: "Mar", value: 47 },
//   { name: "Apr", value: 48 },
//   { name: "May", value: 48 },
// ];

// const governanceData = [
//   { name: "Jan", value: 62 },
//   { name: "Feb", value: 63 },
//   { name: "Mar", value: 64 },
//   { name: "Apr", value: 65 },
//   { name: "May", value: 66 },
// ];

const StateOfNation: React.FC = () => {
  return (
    <section className="min-h-screen font-poppins px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <StateOfNationHero />
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-left">
          Current Stats
        </h1>
        <StateOfNationGallery />

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {stats.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{item.title}</span>
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{item.value}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.change}</p>
            </div>
          ))}
        </div> */}

        {/* <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Sectoral Trends (Mock Data)
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Education Progress</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={educationData} barSize={15}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="rgba(0, 104, 55, 0.6)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Healthcare Reach</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={healthcareData} barSize={15}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="rgba(220, 38, 38, 0.6)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Jobs & Employment</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={employmentData} barSize={15}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="rgba(245, 158, 11, 0.6)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Governance Trust</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={governanceData} barSize={15}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="rgba(37, 99, 235, 0.6)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div> */}

        {/* <div className="text-center mt-14">
          <p className="text-sm text-gray-600 mb-4">
            Want to access detailed insights and reports per LGA or state?
          </p>
          <button className="bg-[#006837] hover:bg-[#004d2a] text-white px-6 py-2 rounded-full font-semibold">
            See more insights
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default StateOfNation;
