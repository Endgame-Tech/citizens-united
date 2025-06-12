// src/pages/profile/ProfilePage.tsx
import { useNavigate } from "react-router";
import Loading from "../../components/Loader";
import ProfileHero from "./ProfileHero";
import { useUser } from "../../context/UserContext";
import KYCFormWrapper from "./kyc/KYCFormWrapper";

export default function ProfilePage() {
  const { profile, isLoading } = useUser();
  const navigate = useNavigate();

  if (isLoading) {
    return <Loading />;
  }

  if (!profile) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex flex-col items-center w-full md:w-[1240px] max-w-[1440px] mx-auto gap-4 py-8">
      <div className=" text-black p-2 w-full rounded-xl mb-8 flex flex-col items-start">
        <ProfileHero profile={profile} />
        <KYCFormWrapper />
      </div>
    </div>
  );
}
