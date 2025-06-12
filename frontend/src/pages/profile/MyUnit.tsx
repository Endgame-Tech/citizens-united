import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import Toast from "../../components/Toast";
import { FaWhatsapp } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const FRONTEND_BASE = import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";

export default function MyUnit() {
  const { profile, isLoading } = useUser();
  const [unitMembers, setUnitMembers] = useState<any[]>([]);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 3;

  const [unitPage, setUnitPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);

  const totalUnitPages = Math.ceil(unitMembers.length / ITEMS_PER_PAGE);
  const totalPendingPages = Math.ceil(pendingInvites.length / ITEMS_PER_PAGE);

  const currentUnitMembers = unitMembers.slice(
    (unitPage - 1) * ITEMS_PER_PAGE,
    unitPage * ITEMS_PER_PAGE
  );

  const currentPendingInvites = pendingInvites.slice(
    (pendingPage - 1) * ITEMS_PER_PAGE,
    pendingPage * ITEMS_PER_PAGE
  );



  const [emailInput, setEmailInput] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const referralLink = `${FRONTEND_BASE.replace(/\/$/, "")}/auth/sign-up?ref=${profile?.member_id}`;

  useEffect(() => {
    if (!profile?.member_id) return;
    loadMyUnit();
  }, [profile]);

  const loadMyUnit = async () => {
    try {
      const res = await fetch(`${API_BASE}/referrals/my-unit`, {
        credentials: "include",
      });
      const body = await res.json();

      if (!res.ok) throw new Error(body.message || "Failed to load unit members");

      setUnitMembers(body.members || []);
      setPendingInvites(body.pending || []);
    } catch (err) {
      console.error("loadMyUnit error:", err);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setToast({ message: "Link copied!", type: "success" });
    } catch (err) {
      console.error("Clipboard error:", err);
      setToast({ message: "Failed to copy link", type: "error" });
    }
  };

  const sendInvites = async () => {
    if (!emailInput || !profile?.member_id) return;

    const emails = emailInput
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.includes("@"));

    if (emails.length === 0) {
      setToast({ message: "Please enter valid emails", type: "error" });
      return;
    }

    if (emails.length > 10) {
      setToast({ message: "You can invite a maximum of 10 emails at once", type: "error" });
      return;
    }

    try {
      setSending(true);
      const res = await fetch(`${API_BASE}/referrals/send-invite`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Failed to send invites");

      setEmailInput("");
      setToast({ message: "Invitations sent successfully!", type: "success" });
      loadMyUnit();
    } catch (err: any) {
      console.error("sendInvites error:", err);
      setToast({ message: err.message || "Failed to send invites", type: "error" });
    } finally {
      setSending(false);
    }
  };

  const resendInvite = async (inviteId: string) => {
    try {
      setResendingId(inviteId);
      const res = await fetch(`${API_BASE}/referrals/resend/${inviteId}`, {
        method: "POST",
        credentials: "include",
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Failed to resend invite");

      setToast({ message: "Invitation resent!", type: "success" });
      loadMyUnit();
    } catch (err: any) {
      console.error("resendInvite error:", err);
      setToast({ message: err.message || "Failed to resend invite", type: "error" });
    } finally {
      setResendingId(null);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <section className="w-full bg-white dark:bg-background-dark rounded-xl shadow-md p-4 sm:p-6 mb-10 text-gray-800 dark:text-white flex flex-col gap-6 sm:gap-8">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <h2 className="text-2xl sm:text-2xl font-bold">Your Unit</h2>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="text-4xl sm:text-6xl text-green-400">{unitMembers.length}</div>
        <div className="text-base sm:text-lg font-medium">Total Members</div>
      </div>

      <hr className="dark:border-white/10 border-gray-300" />

      <h2 className="text-xl sm:text-2xl font-bold">Build your Unit</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col bg-background-dark/10 p-4 sm:p-6 rounded-2xl dark:bg-background-light/15 gap-6 lg:w-1/2">
          <div className="space-y-2">
            <p className="text-lg font-medium">Copy and share your link</p>
            <div className="flex items-center justify-between bg-white dark:bg-background-dark rounded-full border border-green-500 px-4 py-2">
              <div className=" flex overflow-hidden w-full">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-1 text-xs px-4 py-2 bg-transparent text-green-400"
                />
              </div>
              <div>
                <button
                  onClick={handleCopy}
                  className="bg-green-500 rounded-3xl text-white px-4 py-2 text-xs hover:bg-green-600"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium">Invite by email</p>
            <input
              type="text"
              placeholder="Separate multiple emails with commas"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-4 py-2 placeholder:text-xs rounded-full text-sm bg-white text-gray-800 border border-gray-300 dark:bg-white/70 dark:text-gray-800 placeholder:text-gray-500 dark:border-white/20"
            />
            <button
              onClick={sendInvites}
              className={`bg-green-500 rounded-full px-6 py-2 text-sm font-medium self-start hover:bg-green-600 ${sending ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={sending}
            >
              {sending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Invite"
              )}
            </button>

          </div>
        </div>

        <div className="lg:w-1/3 text-sm flex flex-col gap-2 sm:gap-4">
          <p className="text-lg sm:text-2xl font-semibold">How you build your Unit</p>
          <p>1. Share your link or send a direct invite.</p>
          <p>2. They sign up and automatically join your unit.</p>
          <p>3. Building your unit boosts your credibility.</p>
        </div>
      </div>


      {/* Pending Unit */}
      {pendingInvites.length > 0 && (
        <>
          <hr className="dark:border-white/10 border-gray-300 my-6" />
          <div className="p-4 sm:p-6 px-4 sm:px-8 bg-background-light/10 rounded-3xl">
            <h3 className="text-lg sm:text-xl font-bold mb-6">Pending Unit</h3>
            <ul className="divide-y divide-gray-300 dark:divide-white/10">
              {currentPendingInvites.map((invite) => (
                <li key={invite._id} className="flex flex-col md:flex-row justify-between items-start gap-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center uppercase text-sm">
                      {invite.email.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm">{invite.email}</p>
                      <p className="text-xs opacity-60">
                        Invited on {new Date(invite.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => resendInvite(invite._id)}
                    className="bg-green-500 text-white px-4 py-1 rounded-full text-sm hover:bg-green-600 disabled:opacity-50"
                    disabled={resendingId === invite._id}
                  >
                    {resendingId === invite._id ? "Resending..." : "Resend Invite"}
                  </button>
                </li>
              ))}

              <div className="flex justify-end py-2 items-center gap-2 mt-4 text-sm">
                {pendingPage > 1 && (
                  <button onClick={() => setPendingPage(pendingPage - 1)} className="underline">Previous</button>
                )}
                {pendingPage < totalPendingPages && (
                  <button onClick={() => setPendingPage(pendingPage + 1)} className="underline">Next</button>
                )}
                <span className="ml-4">Page {pendingPage} of {totalPendingPages}</span>
              </div>

            </ul>
          </div>
        </>
      )}

      {/* My Unit */}
      {unitMembers.length > 0 && (
        <>
          <hr className="dark:border-white/10 border-gray-300 my-6" />
          <div className="p-4 sm:p-6 px-4 sm:px-8 bg-background-light/10 rounded-3xl">
            <h3 className="text-lg sm:text-xl font-bold mb-6">My Unit Members</h3>
            <ul className="divide-y divide-gray-300 dark:divide-white/10">
              {currentUnitMembers.map((member, index) => {
                const phoneNumber = member.personalInfo?.phone_number || "";
                const countryCode = member.personalInfo?.country_code || "+234";

                let formattedPhone = phoneNumber.startsWith("0")
                  ? countryCode + phoneNumber.slice(1)
                  : countryCode + phoneNumber;
                formattedPhone = formattedPhone.replace("+", "");

                const whatsappLink = `https://wa.me/${formattedPhone}`;

                return (
                  <li key={index} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center w-full gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center uppercase text-sm">
                        {(member.personalInfo?.user_name || member.email || "?")[0]}
                      </div>
                      <div className="flex flex-col md:flex-row justify-between w-full max-w-2xl">
                        <p>{phoneNumber || "(Still Onboarding)"}</p>
                        <p className="text-sm">{member.email}</p>
                        <p className="text-xs opacity-60">Joined {new Date(member.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {phoneNumber && (
                        <a
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500 hover:bg-green-600 text-white text-sm px-6 py-2 rounded-full"
                        >
                          <FaWhatsapp size={20} />
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}

              <div className="flex justify-end items-center gap-2 mt-4 py-2 text-sm">
                {unitPage > 1 && (
                  <button onClick={() => setUnitPage(unitPage - 1)} className="underline">Previous</button>
                )}
                {unitPage < totalUnitPages && (
                  <button onClick={() => setUnitPage(unitPage + 1)} className="underline">Next</button>
                )}
                <span className="ml-4">Page {unitPage} of {totalUnitPages}</span>
              </div>

            </ul>
          </div>
        </>
      )}

    </section>
  );
}
