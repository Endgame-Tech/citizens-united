import { useEffect, useState } from "react";
import { Plus, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import NewCauseModal from "../cause/NewCauseModal";
import CauseList from "../cause/CauseList";
import Loading from "../../../components/Loader";
import Toast from "../../../components/Toast";
import { getOwnedCauses } from "../../../services/causeService";
import { useNavigate } from "react-router";

type Cause = {
  _id: string;
  name: string;
  description: string;
  supporters: string[];
  approvalStatus: 'pending' | 'approved' | 'rejected';
  targets: string[];
  bannerImageUrl?: string;
};

export default function Mobilise({ setActivePage }: { setActivePage: (page: string) => void }) {
  const [causes, setCauses] = useState<Cause[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getOwnedCauses()
      .then((data) => {
        const cleaned = data.map((c: any) => ({
          ...c,
          approvalStatus: c.approvalStatus || 'pending',
          supporters: c.supporters || [],
          targets: c.targets || [],
        }));
        setCauses(cleaned);
      })
      .catch(() => setToast({ message: "Failed to load causes", type: "error" }))
      .finally(() => setLoading(false));
  }, [refresh]);

  const filtered = causes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="max-w-7xl mx-auto p-6  font-poppins space-y-6">
      <div className="flex flex-col gap-6 rounded-xl">
        <div>
          <h1 className="text-2xl font-semibold">Mobilise Your Community for Change</h1>
          <p className="mt-3">Start or join causes or issue-based campaigns</p>
        </div>

        {/* Cause Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-transparent">
          {/* Create Cause */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Create a Cause</h3>
            <p className="text-sm text-gray-600 mb-4">Start a new civic cause around an issue you care about.</p>
            <button
              onClick={() => navigate("/dashboard/new-cause")}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm bg-[#009B4E] hover:bg-[#1b7247] text-white rounded-lg font-medium transition"
            >
              <Plus size={16} /> Create Cause
            </button>
          </div>

          {/* Join Cause */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Join a Cause</h3>
            <p className="text-sm text-gray-600 mb-4">Find and join existing causes that match your interests.</p>
            <button
              onClick={() => setActivePage("Advocacy Hub")}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm border border-[#006837] text-[#006837] hover:bg-[#00B058]/10 rounded-lg font-medium transition"
            >
              <Search size={16} /> Find Causes
            </button>
          </div>
        </div>
      </div>

      {/* Filter/Search Bar */}
      <div className="flex justify-between items-center bg-white border border-gray-200 px-6 py-4 rounded-xl shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search cause..."
            className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#006837] bg-gray-50"
          />
        </div>
        <button className="ml-4 text-sm flex items-center gap-1 bg-gray-100 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-200">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Cause List or Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loading />
        </div>
      ) : (
        <>
          <div className="rounded-lg py-2">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-semibold mb-3">Your Causes</h2>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mb-3">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="px-3 py-2 border rounded-md bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-3 py-2 border rounded-md bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            <CauseList
              causes={paginated.map((c) => ({
                ...c,
                supporters: c.supporters.length,
              }))}
              onCauseClick={(id) => navigate(`/causes/${id}`)}
            />
          </div>
        </>
      )}

      {/* Modals and Toast */}
      <NewCauseModal
        isOpen={isModalOpen}
        causeType="demand"
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          setRefresh((prev) => !prev);
        }}
      />

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
