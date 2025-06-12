// src/pages/profile/Card/BackOfCard.tsx

import { CardLogo, WebIcon, MailIcon } from "../../../components/TopLogo";

export default function BackOfCard() {
  return (
    <section className="grid gap-8 dark:text-text-light">
      <p className="dark:text-white text-black">Back of Card</p>

      <div className="flex flex-col p-8 gap-2 
       justify-between from-accent-green/80 to-accent-red/60 
      relative w-[370px] h-[566px] 
      rounded-3xl bg-hero overflow-hidden isolate">
        {/* Background Image */}
        <img
          src="/tnnp_bkg.jpg"
          className="absolute top-0 left-0 w-[375px] h-[570px] -z-10"
          alt="Background"
          style={{ objectFit: "cover" }}
        />

        <div className=" absolute flex flex-col justify-end top-0 left-0 h-[400px] w-[350px] 
        bg-gradient-to-br -z-8 from-[#219762] rounded-br-[80px] to-gray-900 
        p-8
        ">
          <div className="flex flex-col gap-4 mb-6 text-left text-white text-sm">
            <div>
              <p className="font-[900] text-3xl">Contact Information:</p>
            </div>
            <div className="font-light flex flex-col gap-2">
              <div className="flex gap-2">
                <WebIcon className="w-5 inline-block" />
                <p>www.thepeoplesopposition.org</p>
              </div>
              <div className="flex gap-2">
                <MailIcon className="w-5 inline-block" />
                <p>support@thepeoplesopposition.org</p>
              </div>
            </div>
            <div>
              <p className="font-light">
                This card remains the property of The People's Opposition. <br />
                Unauthorized use, duplication, or misrepresentation is prohibited.
              </p>
            </div>
          </div>
        </div>

        {/* Logo */}
        <figure className=" absolute bottom-0 flex z-0 justify-center">
          <CardLogo className="w-[16rem] -ml-4 mb-4" />
        </figure>

      </div>
    </section>
  );
}
