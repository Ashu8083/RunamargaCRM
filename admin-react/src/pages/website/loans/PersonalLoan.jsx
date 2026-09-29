export default function PersonalLoan() {
  return (
    <section className="bg-[#0A1103] text-white min-h-screen pb-20">

      {/* HERO SECTION */}
      <div className="relative w-full h-[650px]">
        <img
          src="/websiteimages/herosections/loandetails/personal_loans/personal_loan_banner.png"
          className="w-full h-full object-cover opacity-70"
          alt="Personal Loan Banner"
        />

        <div className="absolute inset-0 flex text-center flex-col justify-end px-8 md:px-20">
          <h1
            className="font-rubik lg:text-[8rem] sm:text-[5rem] font-extrabold drop-shadow-xl px-4
            bg-gradient-to-r from-[#F5FEEB] to-[#DAF6BB]
            bg-clip-text text-transparent"
          >
            PERSONAL LOAN
          </h1>
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className="text-lg font-poppins text-center lg:text-4xl md:text-2xl opacity-90 p-10">
        Whether it’s your wedding or a vacation, a medical emergency,
        <br /> unplanned expense, or a dream purchase - a personal loan is
        <br /> your buddy to cover it all. Quick, easy, and flexible, it’s the
        <br /> smartest way to get funds right when you need them.
      </p>

      {/* LOAN CATEGORIES */}
      <div className="container mx-auto px-6 mt-10 w-[60%] sm:w-[80%]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

          {[
            { img: "wedding.jpg", title: "Wedding Loan" },
            { img: "home.jpg", title: "Home Renovation Loan" },
            { img: "wedding.jpg", title: "Travel Loan" },
            { img: "wedding.jpg", title: "Medical Loan" },
          ].map((item, i) => (
            <div key={i} className="rounded-xl shadow-lg">
              <img
                src={`/websiteimages/herosections/loandetails/personal_loans/${item.img}`}
                className="h-[8rem] mx-auto mb-3 rounded-lg shadow-lg border-r-2 border-b-2"
                style={{ borderColor: "#BAEA29" }}
                alt={item.title}
              />
              <p className="font-poppins md:text-md font-semibold">
                {item.title}
              </p>
            </div>
          ))}

        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="container mx-auto px-6 mt-16">
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/websiteimages/herosections/loandetails/listicon.png"
            className="h-[3rem]"
            alt=""
          />
          <h2 className="font-rubik text-2xl md:text-5xl font-bold text-[#C2EC41]">
            Features & Benefits
          </h2>
        </div>

        <ul className="space-y-5 text-lg">

          {[
            {
              icon: "icon1.png",
              title: "Income-Friendly Loans",
              desc: "Eligible even with monthly earnings starting at ₹12,000.",
            },
            {
              icon: "icon2.png",
              title: "Wide Employment Acceptance",
              desc: "Salaried individuals from small businesses, startups, and private firms can apply.",
            },
            {
              icon: "icon3.png",
              title: "Credit Score Support",
              desc: "Strong approval chances for profiles with a 700+ score.",
            },
            {
              icon: "icon4.png",
              title: "Your Backup Option",
              desc: "If traditional lenders turn you away, we help you find workable loan choices.",
            },
            {
              icon: "icon5.png",
              title: "Easy EMI Transfer",
              desc: "Shift your existing EMIs into one simple monthly payment.",
            },
            {
              icon: "icon6.png",
              title: "Better Deals. Smarter Savings.",
              desc: "Access attractive loan plans and lower interest options based on your profile.",
            },
          ].map((f, i) => (
            <li key={i} className="flex gap-4 items-start">
              <img
                src={`/websiteimages/herosections/loandetails/personal_loans/${f.icon}`}
                className="h-[3rem]"
                alt=""
              />
              <span>
                <strong className="font-rubik">{f.title}</strong>
                <p className="font-poppins text-sm text-[#F1F4E7]">{f.desc}</p>
              </span>
            </li>
          ))}

        </ul>
      </div>

      {/* REQUIRED DOCUMENTS */}
      <div className="container mx-auto px-6 mt-16">
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/websiteimages/herosections/loandetails/fileicon.png"
            className="h-[3rem]"
            alt=""
          />
          <h2 className="font-rubik text-2xl md:text-5xl font-bold text-[#C2EC41]">
            Required Documents
          </h2>
        </div>

        <div className="flex flex-col gap-10">

          {/* Personal Docs */}
          <div>
            <h3 className="font-rubik flex items-center gap-3 text-xl font-semibold mb-3">
              <img src="/websiteimages/herosections/loandetails/loan1.png" className="h-[3rem]" alt="" />
              Personal Documents
            </h3>

            <div className="flex flex-wrap gap-3">
              {["Aadhaar Card", "PAN Card", "Address Proof", "Personal Mail ID", "Official Mail ID"].map((doc, i) => (
                <span
                  key={i}
                  className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20"
                >
                  {doc}
                </span>
              ))}
            </div>
          </div>

          {/* Income Docs */}
          <div>
            <h3 className="font-rubik flex items-center gap-3 text-xl font-semibold mb-3">
              <img src="/websiteimages/herosections/loandetails/loan2.png" className="h-[3rem]" alt="" />
              Income Documents (For Salaried Individuals)
            </h3>

            <ul className="space-y-3 text-lg">
              <li className="flex items-center gap-3">
                <img src="/websiteimages/herosections/loandetails/rupeeicon.png" className="h-[3rem]" alt="" />
                <span>6 months Bank Statement</span>
              </li>
              <li className="flex items-center gap-3">
                <img src="/websiteimages/herosections/loandetails/emailicon.png" className="h-[3rem]" alt="" />
                <span>Latest 3 months’ salary slips</span>
              </li>
              <li className="flex items-center gap-3">
                <img src="/websiteimages/herosections/loandetails/mailicon.png" className="h-[3rem]" alt="" />
                <span>Form 16 – Part A & Part B (last 2 years)</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

    </section>
  );
}
