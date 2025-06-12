import React from "react";
import { Leader } from "../../../../lib/mockLeaders";
import { Mail, PhoneCall, MapPin } from "lucide-react";
import { Link } from "react-router";

interface Props {
  leader: Leader;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const LeaderCard: React.FC<Props> = ({ leader }) => {
  return (
    <Link to={`/leaders/${leader.slug}`}>
      <div className="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-all">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-3">
          {leader.imageUrl ? (
            <img
              src={leader.imageUrl}
              alt={leader.fullName}
              className="w-12 h-12 rounded-full object-cover border"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#006837] text-white flex items-center justify-center font-normal text-sm">
              {getInitials(leader.fullName)}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-[#006837]">{leader.fullName}</h3>
            <p className="text-sm text-gray-700">{leader.officeHeld}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-2">{leader.politicalParty}</p>

        <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          {leader.ward}, {leader.lga}, {leader.state}
        </div>

        <div className="flex items-center gap-3 text-sm">
          {leader.contact?.whatsapp && (
            <a
              href={`https://wa.me/${leader.contact.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline flex items-center gap-1"
            >
              <PhoneCall className="w-4 h-4" />
              WhatsApp
            </a>
          )}
          {leader.contact?.email && (
            <a
              href={`mailto:${leader.contact.email}`}
              className="text-yellow-600 hover:underline flex items-center gap-1"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
          )}
        </div>
      </div>
    </Link>
  );
};

export default LeaderCard;
