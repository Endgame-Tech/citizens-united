import { useEffect, useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import AdvocacyList from "./components/AdvocacyList";
import Loading from "../../../components/Loader";
import Toast from "../../../components/Toast";
import { getAllCauses } from "../../../services/causeService";
import { useNavigate } from "react-router";

type Cause = {
  _id: string;
  name: string;
  joinCode: string;
  description: string;
  bannerImageUrl?: string;
  causeType: string;
  scope: string;
  supporters: string[];
  approvalStatus: 'pending' | 'approved' | 'rejected';
  targets: string[];
};

export default function CauseHub() {
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    causeType: "",
    scope: "",
  });
  const navigate = useNavigate();
  const perPage = 6;

  const fetchCauses = async () => {
    try {
      const data = await getAllCauses();
      setCauses(data);
    } catch (err) {
      setToast({ message: "Failed to load causes", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCauses();
  }, []);

  const applyFilters = (causes: Cause[]) => {
    return causes
      .filter((c) => {
        const matchesCauseType = filters.causeType ? c.causeType === filters.causeType : true;
        const matchesScope = filters.scope ? c.scope === filters.scope : true;
        return matchesCauseType && matchesScope;
      })
      .sort((a, b) => new Date(b._id).getTime() - new Date(a._id).getTime());
  };

  const filtered = applyFilters(
    causes.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 font-poppins">
      <div className="flex flex-col gap-3 sm:gap-6 rounded-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Explore Campaigns</h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base">Discover and join campaigns that matter to you.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center bg-white border border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-sm">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search causes..."
            className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#006837] bg-gray-50"
          />
        </div>
        <div className="flex gap-2">
          <button
            className="flex-1 sm:flex-none text-sm flex items-center justify-center gap-1.5 bg-[#006837]/10 text-[#006837] px-3 sm:px-4 py-2 rounded-md hover:bg-[#006837]/20"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={16} /> {filterOpen ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            className={`flex-1 sm:flex-none text-sm flex items-center justify-center gap-1.5 bg-gray-100 px-3 sm:px-4 py-2 rounded-md text-gray-600 hover:bg-gray-200 ${filters.causeType === "" && filters.scope === "" ? "opacity-50" : ""
              }`}
            onClick={() => setFilters({ causeType: "", scope: "" })}
            disabled={filters.causeType === "" && filters.scope === ""}
          >
            Clear
          </button>
        </div>
      </div>

      {filterOpen && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fadeIn">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cause Type</label>
              <select
                value={filters.causeType}
                onChange={(e) => setFilters({ ...filters, causeType: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm bg-white shadow-sm focus:ring-2 focus:ring-[#006837] focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="Legislative Action">Legislative Action</option>
                <option value="Executive Action">Executive Action</option>
                <option value="Demand for Accountability">Demand for Accountability</option>
                <option value="Demand for Policy">Demand for Policy</option>
                <option value="Governance Request">Governance Request</option>
                <option value="Political Support for a Candidate">Political Support for a Candidate</option>
              </select>
            </div>

            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Scope</label>
              <select
                value={filters.scope}
                onChange={(e) => setFilters({ ...filters, scope: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm bg-white shadow-sm focus:ring-2 focus:ring-[#006837] focus:border-transparent"
              >
                <option value="">All Scopes</option>
                <option value="National Cause">National Cause</option>
                <option value="State Cause">State Cause</option>
                <option value="LG Cause">LG Cause</option>
                <option value="Ward Cause">Ward Cause</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Cause List or Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-10 sm:py-20">
          <Loading />
        </div>
      ) : (
        <div className="rounded-lg py-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold">
              All Causes
              {filtered.length > 0 && <span className="text-sm font-normal text-gray-500 ml-2">({filtered.length})</span>}
            </h2>

            {totalPages > 1 && (
              <div className="flex justify-between sm:justify-center items-center gap-2 sm:gap-4 py-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="px-2.5 py-1.5 sm:px-3 sm:py-2 border rounded-md bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-2.5 py-1.5 sm:px-3 sm:py-2 border rounded-md bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          <AdvocacyList
            causes={paginated.map((c) => ({
              ...c,
              supporters: c.supporters.length,
            }))}
            onCauseClick={(joinCode) => navigate(`/cause/${joinCode}`)}
          />
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          className="fixed bottom-4 right-4"
        />
      )}
    </div>
  );
}
