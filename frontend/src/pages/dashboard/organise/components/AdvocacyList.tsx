import { Users, Target, ChevronRight, Clock, Megaphone } from "lucide-react";
import { Link } from "react-router";

type Cause = {
  _id: string;
  name: string;
  joinCode: string;
  description: string;
  supporters: number;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  targets: string[];
  bannerImageUrl?: string;
};

type Props = {
  causes: Cause[];
  onCauseClick: (joinCode: string) => void;
};

export default function AdvocacyList({ causes, onCauseClick }: Props) {
  if (causes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 sm:py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <Megaphone className="w-10 h-10 mx-auto mb-2 text-gray-400" />
        <p className="text-base sm:text-lg font-medium text-gray-600">No causes found</p>
        <p className="mt-1 sm:mt-2 text-sm">Try different filters or create a new campaign</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {causes.map((c) => (
        <div
          key={c._id}
          className="rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-lg sm:hover:shadow-2xl transition relative"
        >
          <Link to={`/cause/${c.joinCode}`} onClick={() => onCauseClick(c.joinCode)}>
            {/* Banner Image with Pending Ribbon */}
            {c.bannerImageUrl && (
              <div className="relative h-32 sm:h-40 w-full bg-gray-200">
                <img
                  src={c.bannerImageUrl}
                  alt={c.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {c.approvalStatus === 'pending' && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] font-semibold px-2 py-1 rounded shadow-md flex items-center gap-1 animate-pulse">
                    <Clock className="w-3 h-3" /> Pending Approval
                  </div>
                )}
              </div>
            )}

            {/* Card Content */}
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-[#8cc63f]/20 text-[#006837] font-bold text-base sm:text-lg flex-shrink-0">
                  {c.name.charAt(0)}
                </div>
                <span
                  className={`text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border font-medium whitespace-nowrap
    ${c.approvalStatus === 'approved'
                      ? 'bg-[#006837]/10 text-[#006837] border-[#8cc63f]/20'
                      : c.approvalStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-700 border-yellow-400'
                        : 'bg-red-100 text-red-700 border-red-400'
                    }
  `}
                >
                  {c.approvalStatus.charAt(0).toUpperCase() + c.approvalStatus.slice(1)}
                </span>
              </div>

              {/* Title and Description */}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-2">
                {c.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                {c.description}
              </p>

              {/* Metrics */}
              <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                <span className="text-[10px] sm:text-xs inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full bg-[#006837]/10 text-[#006837] border border-[#8cc63f]/20">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" /> <span>{c.supporters} supporter{c.supporters !== 1 ? "s" : ""}</span>
                </span>
                {c.targets.length > 0 && (
                  <span className="text-[10px] sm:text-xs inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full bg-[#006837]/10 text-[#006837] border border-[#8cc63f]/20">
                    <Target className="w-3 h-3 sm:w-4 sm:h-4" /> <span>{c.targets.length} target{c.targets.length > 1 ? 's' : ''}</span>
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-2 sm:mt-4">
                <div className="max-w-[70%]">
                  {/* Target Badges */}
                  {c.targets.length > 0 && (
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {c.targets.slice(0, 1).map((t, i) => (
                        <span
                          key={i}
                          className="text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-[#006837] text-[#006837] truncate max-w-[90px] sm:max-w-[100px]">
                          {t}
                        </span>
                      ))}
                      {c.targets.length > 1 && (
                        <span className="text-[9px] sm:text-[10px] font-medium text-gray-500 dark:text-gray-400">
                          +{c.targets.length - 1} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-[#006837] opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
