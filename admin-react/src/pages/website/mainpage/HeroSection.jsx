import { useEffect, useState } from "react";

export default function HeroSection({ navigate }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const innerLogos = [
    "/websiteimages/banklogos/axis.png",
    "/websiteimages/banklogos/HDFC.png",
    "/websiteimages/banklogos/ICICI.png",
    "/websiteimages/banklogos/SBI.png",
    "/websiteimages/banklogos/kotak.png",
    "/websiteimages/banklogos/yes.png",
    "/websiteimages/banklogos/IDFC.png",
    "/websiteimages/banklogos/AU.png",
  ];

  const outerLogos = [
    "/websiteimages/banklogos/canara.png",
    "/websiteimages/banklogos/BOB.png",
    "/websiteimages/banklogos/bandan.png",
    "/websiteimages/banklogos/citi.png",
    "/websiteimages/banklogos/DBS.png",
    "/websiteimages/banklogos/CSB.png",
    "/websiteimages/banklogos/DCB.png",
    "/websiteimages/banklogos/SC.png",
    "/websiteimages/banklogos/BOI.png",
    "/websiteimages/banklogos/Union.png",
    "/websiteimages/banklogos/PNB.png",
    "/websiteimages/banklogos/IndusInd.png",
    "/websiteimages/banklogos/Federal.png",
    "/websiteimages/banklogos/UCO.png",
    "/websiteimages/banklogos/RBL.png",
    "/websiteimages/banklogos/SouthIndian.png",
  ];

  const innerRadius = () => {
    if (windowWidth < 640) return 120;
    if (windowWidth < 1024) return 170;
    return 150;
  };

  const outerRadius = () => {
    if (windowWidth < 640) return 190;
    if (windowWidth < 1024) return 260;
    return 260;
  };

  const getOrbitStyle = (i, total, type) => {
    const radius = type === "inner" ? innerRadius() : outerRadius();
    const angle = (360 / total) * i;

    return {
      transform: `
        translate(-50%, -50%)
        rotate(${angle}deg)
        translateX(${radius}px)
        rotate(-${angle}deg)
      `,
    };
  };

  return (
    <section
      className="
        bg-inherit
        text-white
        min-h-[70vh]
        md:min-h-[75vh]
        flex
        items-center
        justify-center
        px-2
        sm:px-4
        md:px-6
        py-8
        md:py-10
        overflow-hidden
        hero-bg-fix
      "
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center flex flex-col items-center">

          {/* HEADING */}

          <h1
            className="
              font-bold
              leading-[1.1]
              tracking-[-1.5px]
              text-[38px]
              sm:text-[52px]
              md:text-[68px]
              lg:text-[76px]
              max-w-[950px]
            "
          >
            AI-Powered{" "}
            <span className="text-[#BAEA29]">
              Voice Infrastructure
            </span>{" "}
            for BFSI Institutions
          </h1>

          {/* DESCRIPTION */}

          <p
            className="
              mt-3
              max-w-[720px]
              text-[rgba(255,255,255,0.75)]
              text-[16px]
              sm:text-[18px]
              md:text-[20px]
              leading-[1.6]
              font-normal
            "
          >
            Intelligent voice conversations that understand customers,
            collect the right information, and connect conversations to
            financial workflows.
          </p>

          {/* CTA */}

          <button
            type="button"
            onClick={() => (window.location.href = "tel:+918147740043")}
            className="
              btn
              mt-4
              bg-[#BAEA29]
              hover:bg-[#a6d833]
              text-black
              font-semibold
              px-4
              sm:px-5
              py-[13.6px]
              text-[16px]
              sm:text-[17px]
              rounded-[8px]
              normal-case
              border-0
              shadow-none
              hover:shadow-[0_8px_25px_rgba(186,234,41,0.2)]
              min-h-0
              h-auto
            "
          >
            Book a Demo
          </button>

        </div>
      </div>
    </section>
  );
}