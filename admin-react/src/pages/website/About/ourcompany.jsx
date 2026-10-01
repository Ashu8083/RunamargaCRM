export default function OurCompany() {
  return (
    <section className="relative py-20 px-6 lg:px-20 sm:px-2">

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

      {/* ABOUT COMPANY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT TEXT */}
        <div>

          <div className="text-[#BAEA29] text-2xl font-semibold mb-4">
            About Runamarga
            <span className="h-[2px] w-16 bg-white inline-block opacity-60 ml-2" />
          </div>

          <h2
            className="
              text-white
              text-4xl
              md:text-6xl
              font-extrabold
              leading-tight
              mb-6
            "
          >
            Your Path to Smarter Finance
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
            Runamarga is an AI-powered platform that helps you find the right
            bank for your loan — quickly and transparently. We simplify
            borrowing by connecting you with trusted lenders that match
            your needs.
          </p>

        </div>

        {/* IMAGE */}
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
              src="/websiteimages/aboutus/ourcompany.png"
              alt="Runamarga company"
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


      {/* VISION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-20">

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
              src="/websiteimages/aboutus/ourcompany1.png"
              alt="Our vision"
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
          "
        >

          <div
            className="
              text-[#BAEA29]
              text-2xl
              font-semibold
              mb-4
              sm:text-right
            "
          >
            <span className="h-[2px] w-16 bg-white inline-block opacity-60 mr-2" />
            Our Vision
          </div>

          <h2
            className="
              text-white
              text-4xl
              md:text-6xl
              font-extrabold
              leading-tight
              mb-6
            "
          >
            Empowering Financial Freedom for Everyone
          </h2>

          <p
            className="
              text-gray-300
              text-lg
              leading-relaxed
              max-w-xl
              ml-auto
            "
          >
            We aim to make finance simple, smart, and accessible to all
            through technology that understands your goals.
          </p>

        </div>

      </div>


      {/* MISSION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-20">

        {/* TEXT */}
        <div className="text-right lg:text-left ml-auto sm:text-left">

          <div className="text-[#BAEA29] text-2xl font-semibold mb-4">

            Our Mission

            <span className="h-[2px] w-16 bg-white inline-block opacity-60 ml-2" />

          </div>

          <h2
            className="
              text-white
              text-4xl
              md:text-6xl
              font-extrabold
              leading-tight
              mb-6
              sm:text-left
            "
          >
            Simplifying Borrowing with AI Innovation
          </h2>

          <p
            className="
              text-gray-300
              text-lg
              leading-relaxed
              max-w-xl
              mr-auto
              sm:text-left
            "
          >
            Our mission is to bridge the gap between borrowers and banks
            using AI to deliver fast, personalized, and secure loan
            solutions.
          </p>

        </div>

        {/* IMAGE */}
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
              src="/websiteimages/aboutus/ourcompany4.jpg"
              alt="Our mission"
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


      {/* WHY RUNAMARGA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-20">

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
              src="/websiteimages/aboutus/ourcompany2.png"
              alt="Why Runamarga"
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
          "
        >

          <div
            className="
              text-[#BAEA29]
              text-2xl
              font-semibold
              mb-4
              sm:text-right
            "
          >
            <span className="h-[2px] w-16 bg-white inline-block opacity-60 mr-2" />
            Why Runamarga
          </div>

          <h2
            className="
              text-white
              text-4xl
              md:text-6xl
              font-extrabold
              leading-tight
              mb-6
              sm:text-right
            "
          >
            Smart. Fast. Transparent.
          </h2>

          <p
            className="
              text-gray-300
              text-lg
              leading-relaxed
              max-w-xl
              ml-auto
              sm:text-right
            "
          >
            From eligibility checks to loan disbursal, Runamarga ensures
            a clear and transparent process at every step — giving you
            confidence and control over your financial journey.
          </p>

        </div>

      </div>


      {/* PROMISE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-20">

        {/* TEXT */}
        <div className="text-right lg:text-left ml-auto sm:ml-0">

          <div
            className="
              text-[#BAEA29]
              text-2xl
              font-semibold
              mb-4
              sm:text-left
            "
          >
            Our Promise

            <span className="h-[2px] w-16 bg-white inline-block opacity-60 ml-2" />
          </div>

          <h2
            className="
              text-white
              text-4xl
              md:text-6xl
              font-extrabold
              leading-tight
              mb-6
              sm:text-left
            "
          >
            Finance You Can Trust
          </h2>

          <p
            className="
              text-gray-300
              text-lg
              leading-relaxed
              max-w-xl
              mr-auto
              sm:text-left
            "
          >
            We’re committed to transparency, data security, and building
            lasting trust with every customer.
          </p>

        </div>

        {/* IMAGE */}
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
              src="/websiteimages/aboutus/ourcompany3.png"
              alt="Our promise"
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

    </section>
  );
}