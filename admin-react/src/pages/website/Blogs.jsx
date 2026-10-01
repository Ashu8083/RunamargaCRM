import { useState, useEffect } from "react";

export default function Blogs({ navigate }) {

  const [currentSlide, setCurrentSlide] = useState(2);
  const images = [
    "/websiteimages/s1.jpg",
    "/websiteimages/s2.jpg",
    "/websiteimages/s3.jpg",
    "/websiteimages/s4.jpg",
    "/websiteimages/s5.jpg",
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nextSlide = () => {

    if (isMobile) {
      if (currentSlide < images.length - 1) {
        setCurrentSlide(currentSlide + 1);
      }
    } else {
      setCurrentSlide((currentSlide + 1) % images.length);
    }

  };

  useEffect(() => {

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);

  }, [currentSlide]);

  const visibleImages = () => {

    if (isMobile) {
      const start = Math.max(0, currentSlide - 1);
      const end = Math.min(images.length, currentSlide + 2);
      return images.slice(start, end);
    }

    return images;

  };

  const prevSlide = () => {

    if (isMobile) {
      if (currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      }
    } else {
      setCurrentSlide((currentSlide - 1 + images.length) % images.length);
    }

  };

  const setSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="blogs-page-wrapper min-h-screen bg-zinc-950 relative overflow-hidden">

      <section
        className="
          px-4
          md:px-10
          lg:px-20
          py-10
          bg-[#081f01]
          overflow-hidden
        "
        style={{
          backgroundImage: "url('/websiteimages/blogs-bg.png')"
        }}
      >

        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(166,255,58,0.12),transparent_70%)] blur-[160px] -z-10" />

        {/* TITLE */}
        <h2
          className="
            text-center
            font-bold
            text-[#E8FFBF]
            mb-10
            md:mb-20
            p-20
            text-[20px]
            sm:text-[22px]
            md:text-[36px]
            lg:text-[48px]
            leading-[1.3]
          "
        >
          Finance Made Simple for Every <br /> Indian Dream
        </h2>

        {/* VIDEOS SECTION */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">

          {/* CARD */}
          {[
            "pmTIMdb_plo",
            "m5UhUNYTrEE",
            "Kl_JbXlA2rY"
          ].map((video, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-xl w-full max-w-[320px] ${
                index === 1 ? "md:scale-110" : ""
              }`}
            >
              {/* RESPONSIVE VIDEO */}
              <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${video}`}
                  title="YouTube video"
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ))}

        </div>

        {/* BUTTON */}
        <div className="flex justify-center mt-10 md:mt-16 mb-16 md:mb-32">
          <button
            type="button"
            onClick={() =>
              window.open("https://www.youtube.com/@RUNAMARGA", "_blank")
            }
            className="
              btn
              bg-[#A6FF3A]
              hover:bg-[#89e529]
              text-black
              font-bold
              px-3
              md:px-5
              py-2
              md:py-3
              rounded-xl
              text-[12px]
              md:text-[16px]
              border-0
              min-h-0
              h-auto
              normal-case
              shadow-none
            "
          >
            Visit Our Channel
          </button>
        </div>

      </section>
    </div>
  );
}