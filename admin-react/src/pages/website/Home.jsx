import { useEffect, useState } from "react";
import HeroSection from "./mainpage/HeroSection";
import ProcessFlow from "./mainpage/ProcessFlow";
import StatementAnalyser from "./mainpage/StatementAnalyser";
import SmarterLoans from "./mainpage/SmarterLoans";
import BanksNBFCs from "./mainpage/Banks&NBFCs";
import LoanTypeSection from "./mainpage/LoanTypeSection";
import FasterSmarter from "./mainpage/FasterSmarter";
import Calculator from "./mainpage/Calculator";
export default function Home({ navigate }) {

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {

    const handleScroll = () => {

      if (window.scrollY > 800) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }

    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  return (
    <div>

      <section className="bg-hero-bg bg-cover bg-center flex flex-col bg-black">
        <div className="pt-20">
          <HeroSection navigate={navigate} />
        </div>
      </section>


      <LoanTypeSection />
      <ProcessFlow />
      <StatementAnalyser />
      <SmarterLoans />
      <section id="calculator">
        <Calculator />
      </section>
      {/* <BanksNBFCs /> */}
      <FasterSmarter />

      {/* Sticky Button */}
      {/* {showButton && (
        <button
          onClick={() => navigate("check-eligibility")}
          className="
              text-[0.7rem] md:text-[1rem]
              fixed bottom-6
              left-1/2 -translate-x-1/2
              md:left-6 md:translate-x-0
              z-50
              bg-[#C8F26D] text-black
              font-semibold px-6 py-3
              rounded-full shadow-lg
              hover:scale-105 transition
            "
        >
          Check Eligibility For Free
        </button>
      )} */}

    </div>
  );
}