import { useEffect, useRef, useState } from "react";

export default function FasterSmarter() {
  const areaRef = useRef(null);
  const textRef = useRef(null);
  const mobileRefs = useRef([]);
  const [isMobile, setIsMobile] = useState(false);

  const sentences = [
    "AI that listens.",
    "Understands context.",
    "Extracts what matters.",
    "And connects every conversation to action.",
  ];

  /* Detect mobile */

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => {
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  /* Desktop Torch Effect */

  useEffect(() => {
    if (isMobile) return;

    const area = areaRef.current;
    const text = textRef.current;

    if (!area || !text) return;

    const handleMouseMove = (e) => {
      const rect = text.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      text.style.background = `
        radial-gradient(
          circle 260px at ${x}px ${y}px,
          #C8F26D 0%,
          #A6D94F 30%,
          rgba(255,255,255,0.18) 55%,
          rgba(255,255,255,0.05) 65%
        )
      `;

      text.style.webkitBackgroundClip = "text";
      text.style.backgroundClip = "text";
      text.style.color = "transparent";
    };

    const handleMouseLeave = () => {
      text.style.background = "none";
      text.style.color = "rgba(255,255,255,0.30)";
    };

    area.addEventListener("mousemove", handleMouseMove);
    area.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      area.removeEventListener("mousemove", handleMouseMove);
      area.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile]);

  /* Mobile Scroll Animation */

  /* Desktop Torch Effect */

  useEffect(() => {
    if (isMobile) return;

    const area = areaRef.current;
    const text = textRef.current;

    if (!area || !text) return;

    const handleMouseMove = (e) => {
      const rect = text.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      text.style.background = `
      radial-gradient(
        circle 260px at ${x}px ${y}px,
        #C8F26D 0%,
        #A6D94F 30%,
        rgba(255,255,255,0.18) 55%,
        rgba(255,255,255,0.05) 65%
      )
    `;

      text.style.webkitBackgroundClip = "text";
      text.style.backgroundClip = "text";
      text.style.color = "transparent";
    };

    const handleMouseLeave = () => {
      text.style.background = "none";
      text.style.color = "rgba(255,255,255,0.30)";
    };

    area.addEventListener("mousemove", handleMouseMove);
    area.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      area.removeEventListener("mousemove", handleMouseMove);
      area.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile]);
  return (
    <section className="bg-[#0A1103] py-36 text-white overflow-hidden md:py-48">
      <div className="container mx-auto px-6">

        {/* Heading */}

        <h2
          className="
            text-center
            text-[30px]
            sm:text-[36px]
            md:text-[48px]
            font-bold
            mb-2
            tracking-[-0.5px]
          "
        >
          Intelligent Conversations.
        </h2>

        <p
          className="
            text-center
            text-[#BAEA29]
            text-[17px]
            md:text-[21px]
            font-medium
            mb-7
          "
        >
          Real Business Impact.
        </p>

        {/* MOBILE */}

        {isMobile && (
          <div
            ref={areaRef}
            className="text-center space-y-6 text-2xl font-bold leading-snug"
          >
            {sentences.map((sentence, index) => (
              <div
                key={index}
                ref={(el) => {
                  mobileRefs.current[index] = el;
                }}
                className="sentence opacity-20 translate-y-5 transition-all duration-[600ms] ease-in-out"
              >
                {sentence}
              </div>
            ))}

            {/* Final statement */}

            <div
              className="
                pt-4
                text-[#BAEA29]
                text-[18px]
              "
            >
              Runamarga — where voice meets
              intelligence.
            </div>
          </div>
        )}

        {/* DESKTOP */}

        {!isMobile && (
          <div
            ref={areaRef}
            className="
              relative
              flex
              justify-center
              items-center
              min-h-[360px]
              cursor-default
            "
          >
            <div
              ref={textRef}
              className="
                text-[38px]
                md:text-[52px]
                font-bold
                text-center
                leading-[1.25]
                tracking-[-1px]
                text-[rgba(255,255,255,0.30)]
                select-none
                transition-colors
                duration-200
              "
            >
              AI that listens.
              <br />

              Understands context.
              <br />

              Extracts what matters.
              <br />

              And connects every conversation
              <br />

              to action.
            </div>
          </div>
        )}

        {/* Bottom statement */}

        {!isMobile && (
          <p
            className="
              text-center
              text-[#BAEA29]
              text-[16px]
              md:text-[20px]
              font-medium
              mt-2
            "
          >
            Runamarga — where voice meets intelligence.
          </p>
        )}

      </div>
    </section>
  );
}