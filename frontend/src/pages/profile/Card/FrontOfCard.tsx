// src/pages/profile/Card/FrontOfCard.tsx
import { CardLogo } from "../../../components/TopLogo";
import ProfileDetails from "../ProfileDetails";
import { CardImage } from "../../../components/CardImage";
import QRCodeGenerator from "./QRCode";
import { generateQRCodeText } from "../../../utils/GenerateQRCodeText";
import { UserProfile } from "../../../context/UserContext"; // updated import

type Props = {
  profile: UserProfile;
};

export default function FrontOfCard({ profile }: Props) {
  return (
    <section className="grid gap-8 text-text-light">
      <p className="dark:text-white text-black">Membership Card - Front</p>

      <div
        className="p-6 px-6 gap-4 relative w-[370px] h-[566px] rounded-3xl justify-center overflow-hidden isolate"
        id="membership-card"
      >
        {/* Background Image */}
        <img
          src="/tnnp_bkg.jpg"
          className="absolute top-0 left-0 w-[375px] h-[566px] -z-10"
          alt="Background"
          style={{ objectFit: "cover" }}
        />

        <div className=" flex flex-col absolute top-0 right-0 h-[250px] w-[140px] 
        bg-gradient-to-b -z-8 from-[#219762] to-gray-900">
        </div>

        <div className="flex h-full flex-col justify-between">
          {/* Top Section */}
          <section className="flex flex-col justify-between items-left">
            <CardLogo className="w-40" />
            {/* <p className="text-[#D1000080] text-xl">Membership Card</p> */}


            <div className="text-2xl mt-4 font-bold text-[#219762]">
              <p className="-mb-2">
                {`${profile.user_name || ""}`}
              </p>
            </div>

            <div className=" flex flex-col h-[45px] w-[175px] 
            absolute top-[220px] left-0 pl-6 py-2
            rounded-br-3xl bg-gradient-to-br -z-8 
            from-[#219762] to-green-900">
              <h2 className="font-bold text-2xl text-white">Voter</h2>
            </div>

            {/* Profile Image */}
            <div className=" absolute right-4 top-[150px] w-[170px] h-[170px] overflow-hidden rounded-full border-4 border-white dark:bg-gray-700">
              <CardImage
                src={profile.profile_picture_url || ""}
                alt="Profile Picture"
                fallbackSrc="/photo.png"
                width={170}
                height={170}
              />
            </div>

          </section>

          <section className="flex gap-2 flex-col">
            <div className="flex gap-4">
              <div className="flex border-black" >
                <div className="flex flex-col w-full justify-between gap-2">
                  <div className="flex">
                    <ProfileDetails label="State of Voting Engagement" value={profile.voting_engagement_state} />
                  </div>
                  <div className="flex">
                    <ProfileDetails label="Occupation" value={profile.occupation} />
                  </div>
                  <div className="flex">
                    <ProfileDetails label="Gender" value={profile.gender} />
                  </div>
                  <div className="flex">
                    <ProfileDetails label="Ward" value={profile.ward} />
                  </div>
                </div>


              </div>

              <div className="justify-end flex flex-col gap-4">
                <div className="flex gap-2 items-center">
                  <p className="text-[10px] leading-[10px]  font-light">Exp Date</p>
                  <p className="text-sm text-red-500 leading-[10px]  font-bold">04/27</p>
                </div>
                {/* QR Code */}
                <div className="flex justify-end items-end">
                  <QRCodeGenerator text={generateQRCodeText(profile)} />
                </div>
              </div>
            </div>
            <p className="font-normal text-sm text-[#219762] text-center">
              {profile.member_id}
            </p>

          </section>

          {/* Bottom Section: Member ID */}

        </div>
      </div>
    </section>
  );
}
