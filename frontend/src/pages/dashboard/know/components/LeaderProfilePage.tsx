import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { leadersMockData } from "../../../../lib/mockLeaders";
import { Mail, MapPin, ArrowLeft, PhoneCall, ChevronDown } from "lucide-react";

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-between items-center py-3 text-left text-lg font-semibold text-[#006837] hover:bg-gray-100 transition-colors font-poppins"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`accordion-${title}`}
      >
        <span>{title}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div
          id={`accordion-${title}`}
          className="p-4 text-sm text-gray-700 bg-gray-50 font-poppins"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default function LeaderProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const leader = leadersMockData.find((l) => l.slug === slug);

  const handleBack = () => {
    navigate("/dashboard");
    sessionStorage.setItem("dashboardPage", "My Leaders");
  };

  if (!leader) {
    return <div className="p-6 text-red-600 font-semibold font-poppins">Leader not found</div>;
  }

  const previousOffices = leader.previousOffices ?? [];

  return (
    <section className="min-h-screen bg-gray-100 font-poppins">
      {/* Top Bar */}
      <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors font-poppins"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to My Leaders
        </button>
        <span className="text-sm text-gray-500 font-poppins">Citizens United</span>
      </div>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 px-4 py-8">
        {/* Left Column - Profile Image & Contact */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg border border-gray-200 sticky top-4">
          {leader.imageUrl ? (
            <img
              src={leader.imageUrl}
              alt={leader.fullName}
              className="w-full h-96 object-cover rounded-lg mb-4"
            />
          ) : (
            <div className="w-full h-96 bg-gray-300 text-white flex items-center justify-center rounded-lg text-3xl font-bold mb-4 font-poppins">
              {leader.fullName.split(" ").map((w) => w[0]).join("")}
            </div>
          )}

          <div className="text-left">
            <h2 className="text-2xl font-bold text-[#006837] font-poppins">{leader.fullName}</h2>
            <p className="text-sm text-gray-600 font-poppins">{leader.officeHeld}</p>
            <p className="text-xs text-gray-500 mb-4 font-poppins">{leader.politicalParty}</p>
          </div>

          <div className="text-sm text-gray-700 space-y-3 mt-4 font-poppins">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{leader.lga}, {leader.state}</span>
            </div>
            {leader.contact?.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <a href={`mailto:${leader.contact.email}`} className="text-blue-600 hover:underline">
                  {leader.contact.email}
                </a>
                <a
                  href={`mailto:${leader.contact.email}`}
                  className="ml-2 px-2 py-1 text-xs bg-[#006837] text-white rounded-md hover:bg-[#004d28] transition-colors"
                >
                  Message
                </a>
              </div>
            )}
            {leader.contact?.whatsapp && (
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-gray-500" />
                <a
                  href={`https://wa.me/${leader.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://wa.me/${leader.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 px-2 py-1 text-xs bg-[#006837] text-white rounded-md hover:bg-[#004d28] transition-colors"
                >
                  Call
                </a>
              </div>
            )}
          </div>

          {previousOffices.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-[#006837] mb-2 font-poppins">Previous Offices</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 font-poppins">
                {previousOffices.map((office, idx) => (
                  <li key={idx}>{office}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Profile Details */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-[#006837] mb-2 font-poppins">Profile Details</h3>
            <table className="w-full text-sm text-gray-700 border border-gray-200 font-poppins">
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-semibold bg-gray-50">Positioning</td>
                  <td className="p-2">{leader.positioning || "N/A"}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold bg-gray-50">Active in Politics</td>
                  <td className="p-2">{leader.activeYears || "N/A"}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold bg-gray-50">Nationality</td>
                  <td className="p-2">{leader.nationality || "Nigerian"}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold bg-gray-50">Date of Birth</td>
                  <td className="p-2">
                    {leader.dateOfBirth}
                    {leader.disputedFields?.includes("Date of Birth") && (
                      <span className="text-xs text-red-500 ml-1">[disputed]</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold bg-gray-50">Religion</td>
                  <td className="p-2">{leader.religion || "N/A"}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold bg-gray-50">State of Origin</td>
                  <td className="p-2">
                    {leader.stateOfOrigin}
                    {leader.disputedFields?.includes("State of Origin") && (
                      <span className="text-xs text-red-500 ml-1">[disputed]</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold bg-gray-50">LGA</td>
                  <td className="p-2">{leader.lga}</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold bg-gray-50">Ward</td>
                  <td className="p-2">{leader.ward}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="flex-1 bg-white p-6 rounded-lg border border-gray-200">
          <h1 className="text-3xl font-semibold text-[#006837] mb-4 font-poppins">Profile Summary</h1>
          <p className="text-sm text-gray-700 mb-6 leading-relaxed font-poppins">
            <strong>{leader.fullName}</strong> is currently serving as the <strong>{leader.officeHeld}</strong> under the platform of the <strong>{leader.politicalParty}</strong>. With a political career that spans from <strong>{leader.activeYears}</strong>,
            {leader.town ? ` they hail from ${leader.town}, a locality within ` : ` they are from `}{leader.lga} Local Government Area in {leader.state} State.
            Over the years, {leader.fullName.split(" ")[0]} has established a reputation as a <strong>{leader.positioning || "key political figure"}</strong>, contributing to governance, policy-making, and civic leadership at the <strong>{leader.level}</strong> level.
          </p>
          <p className="text-sm text-gray-700 mb-6 leading-relaxed font-poppins">
            Known for their work in community development, public service, and political advocacy, {leader.fullName.split(" ")[0]}'s background reflects a blend of experience, ideology, and regional influence. Their ongoing influence in public affairs continues to shape discourse and decisions within and beyond their jurisdiction.
          </p>

          {/* Accordion Sections */}
          {leader.ideology && (
            <AccordionSection title="Ideology">
              <p className="text-sm text-gray-700 font-poppins">{leader.ideology}</p>
            </AccordionSection>
          )}

          {leader.manifesto && leader.manifesto.length > 0 && (
            <AccordionSection title="Manifesto">
              <ul className="list-disc list-inside text-sm text-gray-700 font-poppins">
                {leader.manifesto.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.title}</strong> — <span className="italic">{item.status}</span>
                  </li>
                ))}
              </ul>
            </AccordionSection>
          )}

          {leader.corruptionCases && leader.corruptionCases.length > 0 && (
            <AccordionSection title="Corruption & Scandals">
              {leader.corruptionCases.map((caseItem, idx) => (
                <div key={idx} className="mb-3">
                  <p className="text-sm text-gray-700 font-poppins"><strong>{caseItem.summary}</strong></p>
                  <p className="text-xs text-gray-500 font-poppins">Status: {caseItem.status}</p>
                  {caseItem.publicResponse && <p className="text-xs text-gray-500 italic font-poppins">Response: {caseItem.publicResponse}</p>}
                  {caseItem.sources?.length > 0 && (
                    <ul className="text-xs list-disc list-inside text-blue-600 font-poppins">
                      {caseItem.sources.map((link, i) => (
                        <li key={i}>
                          <a href={link} target="_blank" rel="noopener noreferrer">
                            Source {i + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </AccordionSection>
          )}

          {leader.policyDecisions && leader.policyDecisions.length > 0 && (
            <AccordionSection title="Policy Decisions">
              <ul className="list-disc list-inside text-sm text-gray-700 font-poppins">
                {leader.policyDecisions.map((p, idx) => (
                  <li key={idx}>
                    <strong>{p.title}</strong> — {p.description}{" "}
                    <span className="text-xs text-gray-500">(Impact Score: {p.impactScore})</span>
                  </li>
                ))}
              </ul>
            </AccordionSection>
          )}

          {leader.performanceTracking && (
            <AccordionSection title="Performance Tracking">
              <ul className="text-sm text-gray-700 font-poppins">
                <li>Attendance: {leader.performanceTracking.attendance}</li>
                <li>Bills Sponsored: {leader.performanceTracking.billsSponsored}</li>
                <li>Town Halls Held: {leader.performanceTracking.townHalls}</li>
                <li>Constituency Projects: {leader.performanceTracking.constituencyProjects}</li>
              </ul>
            </AccordionSection>
          )}

          {leader.accountabilityScore !== undefined && (
            <AccordionSection title="Accountability Scorecard">
              <p className="text-sm text-gray-700 font-poppins">
                Composite Trust Score: <strong>{leader.accountabilityScore}/100</strong>
              </p>
            </AccordionSection>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-6 border-t border-gray-200 font-poppins">
        © {new Date().getFullYear()} Citizens United — Empowering Civic Responsibility
      </footer>
    </section>
  );
}