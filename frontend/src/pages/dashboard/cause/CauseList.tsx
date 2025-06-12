import { Users, Target, ChevronRight, Clock } from "lucide-react";
import { Link } from "react-router";

type Cause = {
  _id: string;
  name: string;
  description: string;
  supporters: number;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  targets: string[];
  bannerImageUrl?: string;
};

type Props = {
  causes: Cause[];
  onCauseClick: (id: string) => void;
};

export default function CauseList({ causes, onCauseClick }: Props) {
  if (causes.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No causes yet.</p>
        <p className="mt-2">Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {causes.map((c) => (
        <div
          key={c._id}
          className="rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition relative"
        >
          <Link to={`/causes/${c._id}`} onClick={() => onCauseClick(c._id)}>
            {/* Banner Image with Pending Ribbon */}
            {c.bannerImageUrl && (
              <div className="relative h-40 w-full bg-gray-200">
                <img
                  src={c.bannerImageUrl}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
                {c.approvalStatus === 'pending' && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] font-semibold px-2 py-1 rounded shadow-md flex items-center gap-1 animate-pulse">
                    <Clock className="w-3 h-3" /> Pending Approval
                  </div>
                )}
              </div>
            )}

            {/* Card Content */}
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-full w-10 h-10 flex items-center justify-center bg-[#8cc63f]/20 text-[#006837] font-bold text-lg">
                  {c.name.charAt(0)}
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full border font-medium
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 truncate">
                {c.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {c.description}
              </p>

              {/* Metrics */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
                <span className="text-xs inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-[#006837]/10 text-[#006837] border border-[#8cc63f]/20">
                  <Users className="w-4 h-4" /> <span>{c.supporters} supporter{c.supporters !== 1 ? "s" : ""}</span>
                </span>
                {c.targets.length > 0 && (
                  <span className="text-xs inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-[#006837]/10 text-[#006837] border border-[#8cc63f]/20">
                    <Target className="w-4 h-4" /> <span>{c.targets.length} target{c.targets.length > 1 ? 's' : ''}</span>
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-4">
                <div>
                  {/* Target Badges */}
                  {c.targets.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {c.targets.slice(0, 2).map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2 py-1 rounded-full border border-[#006837] text-[#006837] truncate max-w-[100px]">
                          {t}
                        </span>
                      ))}
                      {c.targets.length > 2 && (
                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                          +{c.targets.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <ChevronRight className="w-8 h-8 text-[#006837] opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
