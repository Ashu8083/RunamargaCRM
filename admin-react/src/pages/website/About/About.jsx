import { useState } from "react";
import OurCompany from "./ourcompany.jsx";
import OurCareer from "./ourcareer.jsx";
import OurTeam from "./ourteam.jsx";

export default function About() {
  const [currentTab, setCurrentTab] = useState("company");

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">

      {/* BIG GREEN GLOW */}
      <div
        className="
          absolute top-0 left-1/2 -translate-x-1/2
          w-[900px] h-[600px]
          bg-[radial-gradient(circle,rgba(154,255,46,0.35),transparent_70%)]
          blur-[140px] opacity-90 rounded-full
          pointer-events-none z-0
        "
      />

      {/* BACKGROUND TEXT */}
      <div
        className="
          absolute top-10 left-1/2 -translate-x-1/2
          text-[9vw] font-black text-white/5
          select-none pointer-events-none
          whitespace-nowrap z-0
          pt-[20%] md:pt-[10%] lg:pt-[5%]
        "
      >
        ABOUT US
      </div>

      {/* MAIN CONTENT */}
      <div
        className="
          container mx-auto px-4
          pt-[13rem] md:pt-[10rem] lg:pt-[20rem]
          relative z-10
        "
      >

        {/* TABS */}
        <div className="flex justify-center mb-16">

          <div
            className="
              w-full lg:w-[60%]
              flex p-2
              rounded-full
              bg-zinc-800/60
              backdrop-blur-xl
              border border-white/10
              shadow-[0_0_40px_rgba(154,255,46,0.15)]
              relative overflow-hidden
            "
          >

            {/* SOFT GREEN GLOW */}
            <div
              className="
                absolute inset-0
                bg-[radial-gradient(circle,rgba(154,255,46,0.20),transparent_90%)]
                blur-[80px]
                -z-10
              "
            />

            {/* COMPANY TAB */}
            <button
              type="button"
              onClick={() => setCurrentTab("company")}
              className={`
                flex-1
                px-2 md:px-6
                py-4
                rounded-full
                text-lg md:text-[3rem]
                md:leading-[2.5rem]
                text-center
                font-bold
                transition-all duration-500 ease-out
                whitespace-nowrap

                ${
                  currentTab === "company"
                    ? `
                      bg-[linear-gradient(11.15deg,#BAEA29_25.54%,#5D991D_91.77%)]
                      text-white
                      shadow-[0_0_10px_#9aff2e]
                    `
                    : `
                      text-gray-400
                      hover:text-white
                      hover:bg-white/5
                    `
                }
              `}
            >
              Our Company
            </button>

            {/* TEAM TAB */}
            <button
              type="button"
              onClick={() => setCurrentTab("team")}
              className={`
                flex-1
                px-2 md:px-6
                py-4
                rounded-full
                text-lg md:text-[3rem]
                md:leading-[2.5rem]
                text-center
                font-bold
                transition-all duration-500 ease-out
                whitespace-nowrap

                ${
                  currentTab === "team"
                    ? `
                      bg-[linear-gradient(11.15deg,#BAEA29_25.54%,#5D991D_91.77%)]
                      text-white
                      shadow-[0_0_10px_#9aff2e]
                    `
                    : `
                      text-gray-400
                      hover:text-white
                      hover:bg-white/5
                    `
                }
              `}
            >
              Our Team
            </button>

            {/* CAREER TAB */}
            <button
              type="button"
              onClick={() => setCurrentTab("career")}
              className={`
                flex-1
                px-2 md:px-6
                py-4
                rounded-full
                text-lg md:text-[3rem]
                md:leading-[2.5rem]
                text-center
                font-bold
                transition-all duration-500 ease-out
                whitespace-nowrap

                ${
                  currentTab === "career"
                    ? `
                      bg-[linear-gradient(11.15deg,#BAEA29_25.54%,#5D991D_91.77%)]
                      text-white
                      shadow-[0_0_10px_#9aff2e]
                    `
                    : `
                      text-gray-400
                      hover:text-white
                      hover:bg-white/5
                    `
                }
              `}
            >
              Careers
            </button>

          </div>
        </div>

        {/* CONTENT */}
        <div className="content-container">

          {currentTab === "company" && (
            <OurCompany key="company" />
          )}

          {currentTab === "team" && (
            <OurTeam key="team" />
          )}

        </div>

      </div>

      {/* CAREERS OUTSIDE CONTAINER */}
      {currentTab === "career" && (
        <OurCareer key="career" />
      )}

    </div>
  );
}