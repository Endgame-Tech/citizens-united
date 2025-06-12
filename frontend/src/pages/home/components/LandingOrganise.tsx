import { useEffect, useState, useRef } from "react";
import { Users, Target, BookOpen, ArrowRight, ChevronLeft, ChevronRight, BellRing } from "lucide-react";
import { Link } from "react-router";
import { getAllCauses } from "../../../services/causeService";

// Define the Cause type based on the API response
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

const LandingOrganise = () => {
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxSlide, setMaxSlide] = useState(0);

  // Add CSS style for hiding scrollbars
  useEffect(() => {
    // Create and append style element if it doesn't exist already
    const styleId = 'hide-scrollbar-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `;
      document.head.appendChild(style);
    }

    // Clean up on component unmount
    return () => {
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    };
  }, []);

  useEffect(() => {
    // Fetch causes from the API
    const fetchCauses = async () => {
      try {
        const data = await getAllCauses();
        const approvedCauses = data.filter((c: Cause) => c.approvalStatus === 'approved').slice(0, 9); // Get only approved causes, limit to 9
        setCauses(approvedCauses);

        // Calculate max slide based on number of approved causes
        const slidesToShow = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
        setMaxSlide(Math.max(0, approvedCauses.length - slidesToShow));
      } catch (err) {
        console.error("Error loading causes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCauses();

    // Recalculate max slide on window resize
    const handleResize = () => {
      const slidesToShow = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
      setMaxSlide(Math.max(0, causes.length - slidesToShow));
      // Reset to first slide if the current slide is now out of bounds
      if (currentSlide > causes.length - slidesToShow) {
        setCurrentSlide(0);
        sliderRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll the slider
  const scroll = (direction: 'left' | 'right') => {
    const slider = sliderRef.current;
    if (!slider) return;

    const slidesToShow = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    const slideWidth = slider.offsetWidth / slidesToShow;
    const gap = 24; // 6 * 4px (space-x-6 = 1.5rem = 6 * 4px)

    let newSlide = direction === 'left' ? currentSlide - 1 : currentSlide + 1;
    // Ensure we don't scroll past bounds
    newSlide = Math.max(0, Math.min(newSlide, maxSlide));

    setCurrentSlide(newSlide);

    const scrollLeft = newSlide * (slideWidth + gap);
    slider.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">Organise — Mobilise Your Community for Change</h2>
          <p className="text-lg md:text-xl font-light text-gray-600 max-w-3xl mx-auto">
            Mobilise Millions of Voters to Place Demands on Public Leaders or towards voting for candidates you believe will make a difference.
          </p>
        </div>

        {/* Feature Icons Grid - 3 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-green-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <BookOpen className="w-7 h-7 text-green-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Start issue-based campaigns</h3>
            <p className="text-gray-600 text-base font-light">
              Rally voters with PVC to place demands on policies, bills, reforms, and other relevant issues in your community that you want addressed by leaders.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-green-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-green-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Rally voters with PVCs</h3>
            <p className="text-gray-600 text-base font-light">
              Rally voters with PVCs to vote for values-based and competent candidates you believe in. Engage them from indifference to actually showing up to vote on Election Day.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-green-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <BellRing className="w-7 h-7 text-green-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Hyper-Local Issue Reporting</h3>
            <p className="text-gray-600 text-base font-light">
              Call attention to what needs to be fixed in your Community. Report corruption, bad roads, or failed projects, and address them to the relevant authority.
            </p>
          </div>
        </div>

        {/* Featured Causes Slider */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">Featured Campaigns</h3>
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={currentSlide === 0}
                className={`p-2 rounded-full border ${currentSlide === 0
                  ? 'text-gray-400 border-gray-200'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={currentSlide >= maxSlide}
                className={`p-2 rounded-full border ${currentSlide >= maxSlide
                  ? 'text-gray-400 border-gray-200'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
          ) : causes.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border">
              <p className="text-gray-500">No active campaigns found.</p>
            </div>
          ) : (
            <div className="relative">
              {/* The slider container */}
              <div
                ref={sliderRef}
                className="overflow-x-auto flex space-x-6 snap-x snap-mandatory hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {causes.map((cause) => (
                  <div
                    key={cause._id}
                    className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 snap-start"
                  >
                    <div className="h-full rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition relative">
                      <Link to={`/cause/${cause.joinCode}`} className="block h-full">
                        {/* Banner Image */}
                        {cause.bannerImageUrl && (
                          <div className="h-40 w-full bg-gray-200">
                            <img
                              src={cause.bannerImageUrl}
                              alt={cause.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Card Content */}
                        <div className="p-6">
                          {/* Header with first letter avatar */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="rounded-full w-10 h-10 flex items-center justify-center bg-[#8cc63f]/20 text-[#006837] font-bold text-lg">
                              {cause.name.charAt(0)}
                            </div>
                          </div>

                          {/* Title and Description */}
                          <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 truncate">
                            {cause.name}
                          </h2>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {cause.description}
                          </p>

                          {/* Metrics */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#006837]/10 text-[#006837] border border-[#8cc63f]/20">
                              <Users className="w-4 h-4" />
                              <span>{cause.supporters.length} supporter{cause.supporters.length !== 1 ? "s" : ""}</span>
                            </span>
                            {cause.targets.length > 0 && (
                              <span className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#006837]/10 text-[#006837] border border-[#8cc63f]/20">
                                <Target className="w-4 h-4" />
                                <span>{cause.targets.length} target{cause.targets.length > 1 ? 's' : ''}</span>
                              </span>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="flex justify-end items-center mt-4">
                            <span className="text-sm font-medium text-[#006837] flex items-center">
                              View Campaign <ArrowRight className="w-4 h-4 ml-1" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        {/* <div className="text-center mt-12">
          <Link to="/organise" className="inline-block bg-[#006837] text-white py-3 px-8 rounded-lg hover:bg-[#005f32] transition-colors text-lg font-medium">
            View More Campaigns
          </Link>
        </div> */}
      </div>
    </section>
  );
};

export default LandingOrganise;
