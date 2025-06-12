import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Copy, Mail, X, FileText, BookOpen, ExternalLink, LayoutDashboard } from 'lucide-react';
import { FaFacebook } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import Loading from '../../../components/Loader';
import TopLogo from '../../../components/TopLogo';
import SupportAndRegisterModal from './SupportAndRegisterModal';
import { useUser } from '../../../context/UserContext';
import PostLoginSurveyModal from './PostLoginSurveyModal';
import SupportCauseModal from './SupportCauseModal';
import { useCause } from '../../../context/CauseContext';
import DOMPurify from 'dompurify';

export default function PublicCauseDetail() {
  const { code } = useParams<{ code: string }>();
  const { cause, loading, fetchCause, joinCause } = useCause();
  const [copied, setCopied] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const { profile, isLoading: userLoading, updateProfile, refreshProfile } = useUser();
  const [showPostLoginSurvey, setShowPostLoginSurvey] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [supportLoading, setSupportLoading] = useState(false);
  const [isSupporter, setIsSupporter] = useState(false);
  const [surveyError, setSurveyError] = useState<string | null>(null);

  // State for the scroll effect on the navbar
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchCause(code!);
  }, [code]);

  useEffect(() => {
    if (cause) {
      // Check if current user is a supporter or the creator
      let isInSupporters = false;
      let isCreator = false;
      if (profile && cause.supporters) {
        isInSupporters = Array.isArray(cause.supporters) && cause.supporters.some((s: any) => {
          if (typeof s === 'string' && profile._id) return s === profile._id;
          if (s.email && profile.email) return s.email === profile.email;
          if (s.user && profile._id) return s.user === profile._id || s.user?._id === profile._id;
          if (s._id && profile._id) return s._id === profile._id;
          return false;
        });
        isCreator = !!(
          (typeof cause.creator === 'string' && cause.creator === profile._id) ||
          (cause.creator && (
            (cause.creator.email && cause.creator.email === profile.email) ||
            (cause.creator._id && cause.creator._id === profile._id)
          ))
        );
      }
      setIsSupporter(isInSupporters || isCreator);
    }
  }, [cause, profile]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Store cause code in localStorage when opening registration modal
  const handleSupport = () => {
    if (isSupporter) return;
    if (!profile) {
      localStorage.setItem('support-cause-code', code!);
      setShowRegisterModal(true);
      return;
    }
    // Check if user has taken the survey
    if (!profile.hasTakenCauseSurvey) {
      setShowPostLoginSurvey(true);
      return;
    }
    // If survey exists, add as supporter directly
    autoJoinCause();
  };

  // Auto-join cause for logged-in users after login/confirmation
  const autoJoinCause = async () => {
    if (!profile || isSupporter) return;
    if (!profile.hasTakenCauseSurvey) {
      setShowPostLoginSurvey(true);
      return;
    }
    setSupportLoading(true);
    try {
      const [firstName, ...rest] = (profile.name || '').trim().split(' ');
      const lastName = rest.join(' ');
      await joinCause(code!, { firstName, lastName, email: profile.email });
      setIsSupporter(true);
    } catch (err) {
      console.error('[autoJoinCause] Error:', err);
    } finally {
      setSupportLoading(false);
    }
  };

  // On mount, check if user just logged in from confirmation and should show survey
  useEffect(() => {
    if (profile && !isSupporter) {
      const storedCode = localStorage.getItem('support-cause-code');
      if (storedCode && storedCode === code) {
        localStorage.removeItem('support-cause-code');
        if (!profile.hasTakenCauseSurvey) {
          setShowPostLoginSurvey(true);
        } else {
          autoJoinCause();
        }
      }
    }
  }, [profile, code, isSupporter]);

  // Handler for submitting survey for logged-in user
  const handlePostLoginSurveySubmit = async (answers: { citizenship: string; isVoter: string; willVote: string }) => {
    if (!profile) return;
    setSupportLoading(true);
    setSurveyError(null);
    try {
      await updateProfile({ personalInfo: { ...profile.personalInfo, ...answers } });
      await refreshProfile();
      // Add user as supporter immediately after survey
      const [firstName, ...rest] = (profile.name || '').trim().split(' ');
      const lastName = rest.join(' ');
      await joinCause(code!, { firstName, lastName, email: profile.email });
      setShowPostLoginSurvey(false);
      setIsSupporter(true);
    } catch (err: any) {
      setSurveyError(err?.response?.data?.message || 'Failed to save survey. Please try again.');
    } finally {
      setSupportLoading(false);
    }
  };

  // Support Modal handler
  const handleSupportModalSuccess = async () => {
    setShowSupportModal(false);
    await refreshProfile();
    // Refresh cause and supporter state
    fetchCause(code!);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;
  if (!cause) return <div className="p-6 text-center text-red-600">Cause not found</div>;

  // Support progress 
  const supporterGoal = cause.supporterGoal || 20000;
  const supporterCount = cause.supporters?.length || 0;
  const progress = Math.min(100, Math.round((supporterCount / supporterGoal) * 100));

  // Calculate milestone texts for supporters
  let milestoneText = "";
  if (supporterCount < 100) {
    milestoneText = "Growing to 100 supporters";
  } else if (supporterCount < 1000) {
    milestoneText = "Over 100 supporters, growing to 1,000";
  } else if (supporterCount < 10000) {
    milestoneText = "Over 1,000 supporters, growing to 10,000";
  } else if (supporterCount < 100000) {
    milestoneText = "Over 10,000 supporters, growing to 100,000";
  } else {
    milestoneText = "Over 100,000 supporters, and growing";
  }

  // Show metrics only when we have enough supporters
  const showDetailedMetrics = supporterCount >= 100000;

  // Supporter metrics breakdown (only shown when we have 100k+ supporters)
  const metrics = cause.supporterMetrics || {
    voters: 0,
    foreigners: 0,
    diasporans: 0,
  };

  return (
    <section className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className={`bg-white border-b shadow-sm ${isScrolled ? 'fixed top-0 left-0 right-0 z-50 animate-fadeIn' : ''}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
          <TopLogo />
          {/* Navigation with auth buttons */}
          <nav className="flex items-center gap-4">
            {userLoading ? (
              // Loading state - show skeleton
              <div className="flex gap-3">
                <div className="w-20 h-9 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="w-20 h-9 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            ) : profile ? (
              // Logged in - show dashboard button
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-[#006837] hover:bg-[#00592e] text-white font-medium py-2 px-4 rounded transition-colors"
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            ) : (
              // Not logged in - show login & register
              <>
                <Link
                  to="/auth/login"
                  className="py-2 px-4 rounded-lg border border-green-700 text-green-700 hover:bg-green-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/auth/sign-up"
                  className="py-2 px-4 rounded-lg bg-green-700 hover:bg-green-800 text-white transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Add a spacer when the header is fixed */}
      {isScrolled && <div className="h-16"></div>}

      {/* Banner */}
      {cause.bannerImageUrl && (
        <div className="w-full bg-gray-200 flex justify-center">
          <img
            src={cause.bannerImageUrl}
            alt={cause.name}
            className="w-full max-h-[340px] object-cover object-center"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-10 font-poppins grid md:grid-cols-3 gap-10">
        {/* Left: Details */}
        <div className="md:col-span-2">
          {/* Title & Metadata */}
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900">{cause.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-2">
            <span>Created by <b>{cause.creator?.name || "Anonymous"}</b></span>
            <span>• {cause.location?.state}, {cause.location?.lga}{cause.location?.ward ? `, ${cause.location.ward}` : ''}</span>
            <span>• {cause.scope || ""}</span>
            <span>• {cause.causeType || ""}</span>
            <span>• {new Date(cause.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Support Metrics (Updated to not show exact supporter count) */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-green-700">{milestoneText}</h3>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-green-600 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Resource count only */}
            <div className="flex flex-wrap gap-3 mt-4">
              {cause.toolkits?.length > 0 && (
                <span className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-800 border border-purple-800 font-medium text-base shadow-sm">
                  {cause.toolkits.length} {cause.toolkits.length === 1 ? 'Resource' : 'Resources'} available
                </span>
              )}

              {/* Only show detailed metrics when we have 100k+ supporters */}
              {showDetailedMetrics && (
                <>
                  <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 border border-green-800 font-medium text-base shadow-sm">
                    {metrics.voters.toLocaleString()} Registered Voters
                  </span>
                  <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-800 border border-blue-800 font-medium text-base shadow-sm">
                    {metrics.foreigners.toLocaleString()} Foreigners
                  </span>
                  <span className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-800 font-medium text-base shadow-sm">
                    {metrics.diasporans.toLocaleString()} Diasporans
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Targets and Partners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Targets/Decision Makers */}
            {cause.targets?.length > 0 && (
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-2">Directed to:</h3>
                <div className="flex flex-wrap gap-2">
                  {cause.targets.map((t: string, i: number) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full border border-red-400 bg-red-100 text-red-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Partners */}
            {cause.partners?.length > 0 && (
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-2">Partners</h3>
                <div className="flex flex-wrap gap-2">
                  {cause.partners.map((p: string, i: number) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full border border-green-600 bg-green-50 text-green-700">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* The Issue */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">The Issue</h2>
            {/* Render rich HTML if available */}
            {cause.richDescription ? (
              <div
                className="text-gray-700 prose prose-lg prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-headings:font-semibold prose-headings:my-4 prose-p:my-2 max-w-none w-full"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(cause.richDescription, {
                    ADD_TAGS: ["iframe", "ul", "ol", "li"],
                    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling", "width", "height", "style", "class"],
                    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|ftp|tel|data):|\/)/i, // Optional, to control URI schemes
                  }),
                }}
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-line">{cause.description}</p>
            )}
          </div>

          {/* Toolkits & Resources */}
          {cause.toolkits?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Toolkits & Resources to support this Cause</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cause.toolkits.map((toolkit: { label: string; url: string; type: string }, i: number) => (
                  <a
                    href={toolkit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={i}
                    className="group flex items-center p-4 bg-green-100 border border-green-800 rounded-lg hover:shadow-md hover:bg-green-100 transition-all"
                  >
                    <div className="rounded-full bg-white p-3 mr-4">
                      {toolkit.type === 'Policy' ? (
                        <BookOpen className="w-5 h-5 text-green-700" />
                      ) : (
                        <FileText className="w-5 h-5 text-green-700" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-green-800 group-hover:text-green-900 transition-colors">
                        {toolkit.label}
                      </h3>
                      <p className="text-sm text-green-700 flex items-center gap-1">
                        {toolkit.type}
                        <ExternalLink className="w-3 h-3 inline-block text-green-600 group-hover:text-green-800" />
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Updates */}
          {cause.updates?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-800 mb-2">Updates</h3>
              <ul className="list-disc pl-5">
                {cause.updates.map((u: any, i: number) => (
                  <li key={i} className="mb-2">
                    <span className="font-semibold">{u.title}</span>: {u.content}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: CTA & Sharing */}
        <div className="space-y-8">
          {/* Support Button */}
          <div className="bg-white border shadow-md rounded-lg p-6 flex flex-col items-center">
            {isSupporter && (
              <div className="flex items-center mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-50 border border-green-600 text-green-700 font-semibold text-base shadow-sm animate-fade-in">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Supporter
                </span>
              </div>
            )}
            <button
              className={`w-full bg-[#006837] hover:bg-[#00592e] text-white font-semibold py-3 px-6 rounded-lg text-lg transition${isSupporter ? ' opacity-60 cursor-not-allowed' : ''}`}
              onClick={handleSupport}
              disabled={Boolean(supportLoading || userLoading || isSupporter)}
            >
              {isSupporter ? 'You are a supporter' : supportLoading ? 'Processing...' : 'Support this Cause'}
            </button>
            <div className="text-xs text-gray-500 mt-2 text-center">
              By supporting, you agree to our terms and may receive updates.
            </div>
          </div>

          {/* Share Buttons */}
          <div className="bg-white border shadow-md rounded-lg p-4 flex flex-col gap-2">
            <span className="font-semibold text-gray-700 mb-2">Share this cause</span>
            <button
              onClick={() => {
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(cause.name || 'Join this cause');
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank', 'width=600,height=400');
              }}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-gray-50"
            >
              <FaFacebook size={18} /> Share on Facebook
            </button>
            <button
              onClick={() => {
                const url = encodeURIComponent(window.location.href);
                const text = encodeURIComponent(`Join this cause: ${cause.name || 'Citizens United initiative'}`);
                window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
              }}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-gray-50"
            >
              <IoLogoWhatsapp size={18} /> Send via WhatsApp
            </button>
            <button
              onClick={() => {
                const url = encodeURIComponent(window.location.href);
                const text = encodeURIComponent(`Join this cause: ${cause.name || 'Citizens United initiative'}`);
                window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=300');
              }}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-gray-50"
            >
              <X size={18} /> Post on X
            </button>
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-gray-50"
            >
              <Copy size={18} /> {copied ? 'Copied!' : 'Copy link'}
            </button>
            <button
              onClick={() => {
                const subject = encodeURIComponent(cause.name || 'Join this cause');
                const body = encodeURIComponent(`I thought you might be interested in this cause: ${window.location.href}`);
                window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
              }}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-gray-50"
            >
              <Mail size={18} /> Send via email
            </button>
          </div>
        </div>
      </div>

      {/* Support Modal */}
      <SupportCauseModal
        open={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        onSuccess={handleSupportModalSuccess}
      />

      {/* Post-login Survey Modal */}
      <PostLoginSurveyModal
        open={showPostLoginSurvey}
        loading={supportLoading}
        onClose={() => setShowPostLoginSurvey(false)}
        onSubmit={handlePostLoginSurveySubmit}
        error={surveyError}
      />

      {/* Registration + Survey Modal for guests */}
      {showRegisterModal && (
        <SupportAndRegisterModal
          code={code!}
          onClose={() => setShowRegisterModal(false)}
          onSupportSuccess={async () => {
            setShowRegisterModal(false);
            // Refresh cause and supporter state
            fetchCause(code!);
          }}
        />
      )}
    </section>
  );
}
