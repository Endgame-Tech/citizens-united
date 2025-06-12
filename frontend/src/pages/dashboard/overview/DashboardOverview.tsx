import { useEffect, useState } from "react";
import {
  Users,
  Megaphone,
  Flag,
  Star,
  MessageSquare,
  UserPlus,
  Mail,
  Bot,
  BarChart2,
  Activity,
  // Layers,
  // BookOpen,
  Eye,
  // ScanLine,
  ArrowRight,
  Info,
} from "lucide-react";
import { useUser } from "../../../context/UserContext";
import { getOwnedCauses } from "../../../services/causeService";
import { getMyInvites, Invite } from "../../../services/inviteService";
import Loading from "../../../components/Loader";

interface DashboardOverviewProps {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
}

interface Cause {
  _id: string;
  name: string;
  description: string;
}

export default function DashboardOverview({ setActivePage }: DashboardOverviewProps) {
  const { profile } = useUser();
  const [causes, setCauses] = useState<Cause[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOwnedCauses(), getMyInvites()])
      .then(([causesData, invitesData]) => {
        setCauses(causesData);
        setInvites(invitesData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Joined Causes", value: profile?.joinedCauses?.length || 0, icon: Users },
    { label: "Created Causes", value: causes.length, icon: Megaphone },
    { label: "Pending Invites", value: invites.length, icon: Mail },
    { label: "Actions Taken", value: 4, icon: Flag },
    { label: "Feedback Given", value: 2, icon: Star },
    { label: "Supporters Engaged", value: 0, icon: UserPlus },
    { label: "Messages Sent", value: 0, icon: MessageSquare },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  // Define feature cards
  const featureCards = [
    {
      title: "Civic AI Assistant (Tolu)",
      description: "Ask questions about Nigerian politics, governance, and civic issues.",
      icon: <Bot size={28} />,
      color: "bg-blue-50 text-blue-600",
      page: "Civic AI Assistant",
      image: "/Tolu1.svg",
    },
    {
      title: "State of the Nation",
      description: "Get insights on key metrics about Nigeria's current state.",
      icon: <BarChart2 size={28} />,
      color: "bg-orange-50 text-orange-600",
      page: "State of the Nation",
      image: "/7343.jpg",
    },
    {
      title: "Advocacy Hub",
      description: "Join or create campaigns for issues that matter to you.",
      icon: <Megaphone size={28} />,
      color: "bg-purple-50 text-purple-600",
      page: "Advocacy Hub",
      image: "/advocacy.svg",
    },
    {
      title: "Run for Office Hub",
      description: "Resources to help you run for political office.",
      icon: <Activity size={28} />,
      color: "bg-pink-50 text-pink-600",
      page: "Run for Office Hub",
      image: "/215971.jpg",
    },
    {
      title: "Election Monitoring",
      description: "Monitor election activities and report incidents.",
      icon: <Eye size={28} />,
      color: "bg-amber-50 text-amber-600",
      page: "Monitor",
      image: "/15997.jpg",
    },
    {
      title: "My Leaders",
      description: "Learn about your elected representatives.",
      icon: <Users size={28} />,
      color: "bg-green-50 text-green-600",
      page: "My Leaders",
      image: "/Leaders.webp",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-poppins space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#006837] to-[#8cc63f] p-6 md:p-8 rounded-2xl shadow-md text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center gap-6">
            <img
              src={profile?.profileImage || "/default-avatar.png"}
              alt={profile?.name}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white object-cover shadow-md"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Welcome back, {profile?.name.split(' ')[0]}!</h1>
              <p className="text-sm md:text-base text-white/90">
                Make a civic impact today with Citizens United.
              </p>
            </div>
          </div>
          <button
            className="mt-4 md:mt-0 px-4 py-2 bg-white text-[#006837] rounded-lg hover:bg-gray-100 transition shadow-sm font-medium flex items-center gap-2"
            onClick={() => setActivePage("My Profile")}
          >
            View Profile <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Feature Highlight */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">Explore Features</h2>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
            <Info size={14} />
            <span>Discover what Citizens United offers</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featureCards.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl overflow-hidden shadow-sm border hover:shadow-md transition group cursor-pointer"
              onClick={() => setActivePage(feature.page)}
            >
              {feature.image && (
                <div className="w-full h-36 relative overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start gap-3 mb-2">
                  <div className={`p-2 ${feature.color} rounded-lg`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-[#006837]">{feature.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="text-xs font-medium flex items-center gap-1 text-[#006837] group-hover:translate-x-1 transition-transform">
                    Explore <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Your Activity</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#006837]/10 rounded-full">
                  <Icon className="w-4 h-4 text-[#006837]" />
                </div>
                <span className="text-sm text-gray-600">{label}</span>
              </div>
              <div className="text-xl font-bold text-gray-800">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cause List Section */}
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Megaphone size={18} className="text-[#006837]" />
            <h2 className="text-lg font-medium text-gray-800">Your Causes</h2>
          </div>
          <button
            onClick={() => setActivePage("Mobilise")}
            className="px-3 py-1.5 bg-[#006837] text-white rounded-lg hover:bg-[#004d2a] transition flex items-center gap-1.5 text-sm"
          >
            <Megaphone size={14} /> Create
          </button>
        </div>

        {causes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
            <Megaphone size={24} className="text-[#006837] mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-800">No Causes Yet</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4 max-w-[250px] mx-auto">Start making an impact by creating your first cause</p>
            <button
              className="px-4 py-2 bg-[#006837] text-white rounded-lg text-sm flex items-center gap-1.5 mx-auto"
              onClick={() => setActivePage("Mobilise")}
            >
              Get Started <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div>
            <ul className="space-y-2">
              {causes.map((c) => (
                <li
                  key={c._id}
                  className="p-3 rounded-lg border border-gray-100 hover:border-[#006837]/20 hover:bg-[#006837]/5 transition cursor-pointer flex items-center"
                  onClick={() => setActivePage("Mobilise")}
                >
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <div className="rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[#006837]/10 text-[#006837] font-medium">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-800 truncate">{c.name}</p>
                        <span className="inline-flex h-5 items-center px-2 rounded-full text-xs bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1">{c.description}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 flex-shrink-0" />
                </li>
              ))}
            </ul>
            {causes.length > 0 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setActivePage("Mobilise")}
                  className="text-sm text-[#006837] hover:text-[#004d2a] transition flex items-center gap-1 justify-center mx-auto"
                >
                  View All <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
