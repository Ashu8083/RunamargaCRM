export default function OurCareer() {
  return (
    <section className="relative py-20 lg:px-20">

      {/* BACKGROUND GLOW */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle,rgba(154,255,46,0.15),transparent_70%)]
          blur-[120px]
          -z-10
          pointer-events-none
        "
      />

      {/* FIRST SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center m-10">

        {/* LEFT TEXT */}
        <div>

          <div className="text-[#BAEA29] text-2xl font-semibold mb-4">
            Join Runamarga
            <span className="h-[2px] w-16 bg-white inline-block opacity-60 ml-2" />
          </div>

          <h2
            className="
              font-rubik
              text-white
              text-4xl md:text-5xl
              md:text-left
              sm:text-center
              font-extrabold
              leading-tight
              mb-6
            "
          >
            Where Innovation Meets Financial Inclusion
          </h2>

          <p
            className="
              font-poppins
              text-gray-300
              text-lg
              leading-relaxed
            "
          >
            At Runamarga Technologies, we are transforming the way India
            experiences finance. Our mission is to build secure, smart, and
            accessible digital financial solutions that empower individuals
            and businesses to grow with confidence.
          </p>

        </div>

        {/* RIGHT IMAGE */}
        <div className="relative">

          <div
            className="
              rounded-3xl
              p-[6px]
              bg-gradient-to-b
              from-[#BAEA29]
              to-[#4b7f1b]
              shadow-[0_0_40px_rgba(154,255,46,0.3)]
            "
          >
            <img
              src="/websiteimages/aboutus/ourteam.png"
              alt="Runamarga team"
              className="
                rounded-3xl
                w-full
                h-full
                object-cover
                opacity-90
              "
            />
          </div>

        </div>

      </div>


      {/* SECOND SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-20 m-20">

        {/* IMAGE */}
        <div className="relative order-2 lg:order-1">

          <div
            className="
              rounded-3xl
              p-[6px]
              bg-gradient-to-b
              from-[#BAEA29]
              to-[#4b7f1b]
              shadow-[0_0_40px_rgba(154,255,46,0.3)]
            "
          >
            <img
              src="/websiteimages/aboutus/ourcareer.png"
              alt="Our career"
              className="
                rounded-3xl
                w-full
                h-full
                object-cover
                opacity-90
              "
            />
          </div>

        </div>

        {/* TEXT */}
        <div
          className="
            order-1
            lg:order-2
            text-center
            lg:text-right
            ml-auto
            sm:ml-0
          "
        >

          <div
            className="
              font-rubik
              text-[#BAEA29]
              text-2xl
              font-semibold
              mb-4
              sm:text-right
            "
          >
            <span className="h-[2px] w-16 bg-white inline-block opacity-60 mr-2" />
            Why Work With Us?
          </div>

          <h2
            className="
              font-rubik
              text-white
              text-4xl
              lg:text-5xl
              sm:text-4xl
              md:text-right
              sm:text-center
              font-extrabold
              leading-tight
              mb-6
            "
          >
            Fast-growing Fintech Organization
          </h2>

          <p
            className="
              font-poppins
              text-gray-300
              text-lg
              sm:text-xl
              sm:text-center
              leading-relaxed
              ml-auto
              sm:ml-0
            "
          >
            You'll learn, earn, and evolve with a team that's redefining how
            finance works for millions. We invest in your growth — with
            training, mentorship, and real-world exposure that takes your
            career to the next level.
          </p>

        </div>

      </div>


      {/* PERKS */}
      <div className="pt-20 m-20">

        <h3 className="font-rubik text-[#BAEA29] text-2xl font-semibold mb-4">
          Perks That Actually Excite You
        </h3>

        <ul
          className="
            font-poppins
            text-gray-200
            text-lg
            space-y-3
            leading-relaxed
          "
        >
          <li>
            🧠 Performance-based growth (earn more as you achieve more)
          </li>

          <li>
            ✈️ National and international trips for top performers —
            every single month!
          </li>

          <li>
            🤝 A supportive team that’s got your back
          </li>

          <li>
            🧠 Opportunities to learn directly from industry leaders
          </li>

          <li>
            🎯 A place where your ideas matter
          </li>
        </ul>

      </div>


      {/* IMAGE GRID */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-3
          pt-10
        "
      >

        <div className="bg-black rounded-3xl overflow-hidden">
          <img
            src="/websiteimages/aboutus/career1.png"
            alt="Career at Runamarga"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="bg-black rounded-3xl overflow-hidden">
          <img
            src="/websiteimages/aboutus/career2.png"
            alt="Runamarga workplace"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="bg-[#E5E5E5] rounded-3xl overflow-hidden">
          <img
            src="/websiteimages/aboutus/career4.jpg"
            alt="Runamarga team"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="bg-[#E5E5E5] rounded-3xl overflow-hidden">
          <img
            src="/websiteimages/aboutus/career5.jpg"
            alt="Runamarga culture"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="bg-black rounded-3xl overflow-hidden">
          <img
            src="/websiteimages/aboutus/career3.png"
            alt="Runamarga career"
            className="w-full h-full object-cover"
          />
        </div>

      </div>


      {/* READY TO LEVEL UP */}
      <div
        className="
          mt-20
          bg-gradient-to-br
          from-[#2d3f10]
          to-[#1a2508]
          p-10
          rounded-3xl
          text-center
          shadow-[0_0_40px_rgba(154,255,46,0.15)]
        "
      >

        <h2
          className="
            font-rubik
            text-white
            text-3xl
            md:text-4xl
            font-extrabold
            mb-4
          "
        >
          Ready to Level Up?
        </h2>

        <p
          className="
            font-poppins
            text-gray-300
            text-lg
            mx-auto
            mb-8
          "
        >
          If you're ambitious, love challenges, and want to build a
          rewarding career in fintech — Runamarga is your place.
        </p>

        <div className="flex items-center justify-center gap-3">

          <img
            src="/websiteimages/aboutus/emailcareer.png"
            alt="Contact careers"
            className="w-20 mb-2"
          />

          <div>

            <div className="text-[#BAEA29] text-3xl font-bold">
              Send Your Resume to
            </div>

            <div className="text-gray-300 -mt-1">
              contactus@runamarga.com
            </div>

            <div className="text-white text-xl font-semibold">
              8147740043

              <span className="text-[#BAEA29] ml-1 text-sm">
                or connect with us today!
              </span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}