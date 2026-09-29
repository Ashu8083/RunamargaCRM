import { useState } from "react";
import PersonalLoan from "./PersonalLoan";
import BusinessLoan from "./BusinessLoan";
import HomeLoan from "./HomeLoan";

export default function CheckEligibility() {
  const [currentTab, setCurrentTab] = useState("business");

  const tabs = [
    {
      id: "business",
      label: "Business Loan",
    },
    // Enable these when their eligibility logic is ready:
    // {
    //   id: "personal",
    //   label: "Personal Loan",
    // },
    // {
    //   id: "home",
    //   label: "Home Loan",
    // },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">

      {/* BIG GREEN GLOW */}
      <div
        className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2
          w-[900px]
          h-[600px]
          bg-[radial-gradient(circle,rgba(154,255,46,0.35),transparent_70%)]
          blur-[140px]
          opacity-90
          rounded-full
          pointer-events-none
        "
      />

      {/* BACKGROUND TEXT */}
      <div
        className="
          absolute
          top-10
          left-1/2
          -translate-x-1/2
          text-[5vw]
          font-black
          text-white/5
          select-none
          pointer-events-none
          whitespace-nowrap
          pt-[20%]
          md:pt-[15%]
          lg:pt-[8%]
        "
      >
        CHECK ELIGIBILITY
      </div>

      {/* CONTENT */}
      <div
        className="
          container
          mx-auto
          px-4
          pt-[13rem]
          md:pt-[15rem]
          lg:pt-[17rem]
          relative
          z-10
        "
      >

        {/* TABS */}
        <div className="flex justify-center mb-16">

          <div
            className="
              w-full
              md:w-3/4
              lg:w-[60%]
              flex
              p-2
              rounded-full
              bg-zinc-800/60
              backdrop-blur-xl
              border
              border-white/10
              shadow-[0_0_40px_rgba(154,255,46,0.15)]
            "
          >

            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentTab(tab.id)}
                className={`
                  flex-1
                  py-4
                  rounded-full
                  font-bold
                  text-lg
                  md:text-2xl
                  transition-all
                  duration-300

                  ${
                    currentTab === tab.id
                      ? `
                        bg-gradient-to-r
                        from-[#BAEA29]
                        to-[#5D991D]
                        text-white
                        shadow-[0_0_15px_rgba(154,255,46,0.35)]
                      `
                      : `
                        text-gray-400
                        hover:text-white
                        hover:bg-white/5
                      `
                  }
                `}
              >
                {tab.label}
              </button>
            ))}

          </div>

        </div>

        {/* CONTENT */}
        {currentTab === "personal" && <PersonalLoan />}

        {currentTab === "business" && <BusinessLoan />}

        {currentTab === "home" && <HomeLoan />}

      </div>

    </div>
  );
}