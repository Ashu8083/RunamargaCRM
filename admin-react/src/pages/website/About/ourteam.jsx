export default function OurTeam() {
  const teamMembers = [
    {
      image: "/websiteimages/aboutus/team2.png",
      name: "Prasanna Y R",
      role: "Co-Founder & CEO",
    },
    {
      image: "/websiteimages/aboutus/team1.jpg",
      name: "Ameer Kolur",
      role: "Co-Founder & CBO",
    },
    {
      image: "/websiteimages/team/gangadhara.png",
      name: "V Gangadhara",
      role: "Operation Head & Manager",
    },
    {
      image: "/websiteimages/team/komal.png",
      name: "Komal Mane",
      role: "CTO",
    },
    {
      image: "/websiteimages/team/ipsita.png",
      name: "Ipsita Behera",
      role: "Social Media Head",
    },
    {
      image: "/websiteimages/team/keerthana.png",
      name: "Keerthana",
      role: "Digital Marketing Manager",
    },
    {
      image: "/websiteimages/team/vaibhavi.png",
      name: "Vaibhavi C",
      role: "UI & Graphic Designer",
    },
    {
      image: "/websiteimages/team/sharath.png",
      name: "Sharath R E",
      role: "Full Stack Developer",
    },
    {
      image: "/websiteimages/team/anusman.png",
      name: "Anusman Gouda",
      role: "Android Developer",
    },
    {
      image: "/websiteimages/team/bhagya.png",
      name: "Bhayashree",
      role: "Relationship Manager",
    },
  ];

  return (
    <section
      className="
        relative
        py-20
        px-6
        lg:px-20
        sm:py-5
        sm:px-5
      "
    >

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

      {/* HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT TEXT */}
        <div>

          <h2
            className="
              text-white
              text-6xl
              md:text-6xl
              sm:text-2xl
              sm:text-center
              font-extrabold
              leading-tight
              mb-6
            "
          >
            One Team, One Vision!
          </h2>

          <p
            className="
              text-gray-300
              text-lg
              leading-relaxed
              sm:text-2xl
              sm:text-center
            "
          >
            We’re a dynamic mix of finance experts and tech innovators
            working together to make lending faster, more reliable,
            and truly customer-centric.
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


      {/* TEAM GRID */}

      <div
        className="
          mt-20
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          gap-10
        "
      >

        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="
              card
              bg-transparent
              text-center
              transition-all
              duration-300
              hover:-translate-y-2
            "
          >

            {/* MEMBER IMAGE */}
            <div
              className="
                w-full
                h-60
                bg-gray-300
                rounded-xl
                overflow-hidden
                mb-3
              "
            >
              <img
                src={member.image}
                alt={member.name}
                className="
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-500
                  hover:scale-105
                "
              />
            </div>

            {/* NAME */}
            <h3 className="text-white font-semibold">
              {member.name}
            </h3>

            {/* ROLE */}
            <p className="text-gray-400 text-sm">
              {member.role}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}