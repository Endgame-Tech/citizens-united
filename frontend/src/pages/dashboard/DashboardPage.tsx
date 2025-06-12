import { useState, useEffect } from "react";
import {
  Home,
  BookOpen,
  BarChart2,
  BarChart3,
  Eye,
  MapPin,
  Users,
  Megaphone,
  Flag,
  User,
  Activity,
  Layers,
  X,
  ChevronDown,
  ChevronUp,
  Bot,
  ScanLine,
  Landmark,
} from "lucide-react";
import TopLogo from "../../components/TopLogo";
import Loading from "../../components/Loader";
import { useUser } from "../../context/UserContext";
import UserProfileCard from "../../components/UserProfileCard";

import DashboardOverview from "./overview/DashboardOverview";
import CivicAIAssistant from "./know/CivicAIAssistant";
import StateOfNation from "./know/StateOfNation";
import MyLeaders from "./know/MyLeaders";
import CivicEducationHub from "./know/CivicEducationHub";
import TrackGovernance from "./track/TrackGovernance";
import IssueReporting from "./track/IssueReporting";
import Mobilise from "./organise/Mobilise";
import AdvocacyHub from "./organise/AdvocacyHub";
import RunForOffice from "./lead/RunForOffice";
import ProfilePage from "../profile/ProfilePage";
import DashboardHeader from "./components/DashboardHeader";
import { useNavigate } from "react-router";
import { ChatSessionProvider } from "../../context/chatSessionContext";
import ComingSoon from "../../components/ComingSoon";
import Vote from "./elections/Vote";
import MonitorLanding from './elections/monitor/index';
// import MonitorCTA from "./elections/monitor/components/MonitorCTA";
import CitizensOrganizingSchool from "./organise/CitizensOrganizingSchool";
// Sidebar menu items type
interface NavItem {
  title: string;
  icon: React.ReactNode;
  component?: React.ReactNode;
  children?: NavItem[];
}

export default function DashboardPage() {
  const { profile, isLoading } = useUser();
  const initialPage = sessionStorage.getItem("dashboardPage") || "Overview";
  const [activePage, setActivePage] = useState(initialPage);
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem("dashboardPage");
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const sidebarItems: NavItem[] = [
    {
      title: "Overview",
      icon: <Home size={24} />,
      component: <DashboardOverview setActivePage={setActivePage} />,
    },
    {
      title: "Know",
      icon: <BookOpen size={24} />,
      children: [
        { title: "Civic AI Assistant", icon: <Bot size={20} />, component: <CivicAIAssistant /> },
        { title: "State of the Nation", icon: <BarChart2 size={20} />, component: <StateOfNation /> },
        { title: "My Leaders", icon: <Users size={20} />, component: <MyLeaders /> },
        { title: "Civic Education Hub", icon: <Layers size={20} />, component: <CivicEducationHub /> },
      ],
    },
    {
      title: "Organise",
      icon: <Megaphone size={24} />,
      children: [
        { title: "Mobilise", icon: <Users size={20} />, component: <Mobilise setActivePage={setActivePage} /> },
        { title: "Advocacy Hub", icon: <Layers size={20} />, component: <AdvocacyHub /> },
        { title: "Citizens Organizing School", icon: <BookOpen size={20} />, component: <CitizensOrganizingSchool /> },
      ],
    },
    {
      title: "Track",
      icon: <MapPin size={24} />,
      children: [
        { title: "Track Governance", icon: <Flag size={20} />, component: <TrackGovernance /> },
        { title: "Issue Reporting", icon: <MapPin size={20} />, component: <IssueReporting /> },
      ],
    },
    {
      title: "Lead",
      icon: <Flag size={24} />,
      children: [
        { title: "Run for Office Hub", icon: <Activity size={20} />, component: <RunForOffice /> },
      ],
    },
    {
      title: "Elections",
      icon: <Landmark size={24} />,
      children: [
        { title: "Vote", icon: <ScanLine size={20} />, component: <Vote /> },
        { title: "Monitor", icon: <Eye size={20} />, component: <MonitorLanding /> },
        { title: "Results", icon: <BarChart3 size={20} />, component: <ComingSoon /> },
      ]
    },
    // {
    //   title: "Rewards",
    //   icon: <Layers size={24} />,
    //   component: <ComingSoon />,
    // },
    {
      title: "My Profile",
      icon: <User size={24} />,
      component: <ProfilePage />,
    },
  ];

  const toggleSection = (title: string) => {
    setOpenSection((prev) => (prev === title ? null : title));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#F2F2F2] to-[#E0E7E9]">
        <Loading />
      </div>
    );
  }

  if (!profile) {
    navigate("/auth/login");
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#F2F2F2] to-[#E0E7E9]">
        <Loading />
      </div>
    );
  }

  const findComponent = (items: NavItem[]): React.ReactNode => {
    for (const item of items) {
      if (item.title === activePage && item.component) return item.component;
      if (item.children) {
        const match = item.children.find((child) => child.title === activePage);
        if (match && match.component) return match.component;
      }
    }
    return <div className="text-gray-500">Coming soon!</div>;
  };

  return (
    <ChatSessionProvider>
      <div className="flex h-screen overflow-hidden bg-white font-poppins">
        {/* Mobile sidebar overlay - clicking this will close the sidebar */}
        {isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/30 z-30 backdrop-blur-sm"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          />
        )}

        {/* Close button outside sidebar - only visible on mobile when sidebar is open */}
        {isSidebarOpen && (
          <button
            className="md:hidden fixed top-4 right-[20px] z-50 p-2 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} className="text-gray-700" />
          </button>
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-72 bg-white border-r shadow-xl p-6 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} md:sticky md:top-0 z-10 h-screen overflow-y-auto`}
        >

          <div className="mb-3">
            <TopLogo />
          </div>
          <div className="mb-6">
            <UserProfileCard setActivePage={setActivePage} />
          </div>
          <nav className="space-y-3">
            {sidebarItems.map((item) => (
              <div key={item.title}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleSection(item.title)}
                      className="w-full flex items-center justify-between px-3 py-2 text-md font-normal text-[#006837] hover:bg-[#8cc63f]/20 rounded-lg transition-colors duration-200"
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        {item.title}
                      </span>
                      {openSection === item.title ? (
                        <ChevronUp size={20} className="text-[#006837]" />
                      ) : (
                        <ChevronDown size={20} className="text-[#006837]" />
                      )}
                    </button>
                    {openSection === item.title && (
                      <div className="pl-8 mt-2 space-y-2 animate-fade-in">
                        {item.children.map((sub) => (
                          <div
                            key={sub.title}
                            onClick={() => {
                              setActivePage(sub.title);
                              setIsSidebarOpen(false);
                            }}
                            className={`flex items-center cursor-pointer gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#006837] hover:bg-[#8cc63f]/10 rounded-lg transition-colors duration-200 ${activePage === sub.title ? "bg-[#8cc63f]/20 text-[#006837]" : ""
                              }`}
                          >
                            {sub.icon}
                            {sub.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    onClick={() => {
                      setActivePage(item.title);
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2 text-md font-normal cursor-pointer text-[#006837] hover:bg-[#8cc63f]/20 rounded-lg transition-colors duration-200 ${activePage === item.title ? "bg-[#8cc63f]/20 text-[#006837]" : ""
                      }`}
                  >
                    {item.icon}
                    {item.title}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <DashboardHeader
            title={activePage}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          <div className="animate-fade-in p-4">{findComponent(sidebarItems)}</div>
        </main>
      </div>
    </ChatSessionProvider>
  );
}
