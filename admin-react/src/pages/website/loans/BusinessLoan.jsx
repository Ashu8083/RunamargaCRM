import { useNavigate } from "react-router-dom";

export default function BusinessLoan() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#0A1103] text-white min-h-screen pb-20">

      {/* <!-- HERO SECTION --> */}
      <div className="relative w-full h-[650px]">
        <img
          src="/websiteimages/herosections/loandetails/personal_loans/personal_loan_banner.png"
          className="w-full h-full object-cover opacity-70"
        />

        <div className="absolute inset-0 flex text-center flex-col justify-end px-8 md:px-20">
          <h1
            className="font-rubik text-[30px] md:text-[8rem] font-extrabold drop-shadow-xl px-4
              bg-gradient-to-r from-[#F5FEEB] to-[#DAF6BB]
              bg-clip-text text-transparent"
          >
            BUSINESS LOAN
          </h1>
        </div>
      </div>

      {/* <!-- LOAN CATEGORIES --> */}
      <p className="text-lg font-poppins text-center md:text-4xl opacity-90 p-10">
        Running a business comes with big dreams and bigger needs.<br />
        A business loan is your partner to manage cash flow, buy equipment, .<br />
        expand, or even start freshEasy, flexible, and fast - it gives your business the wings to grow without worries.
      </p>

      <div className="container mx-auto px-6 mt-10 w-[80%] md:w-[60%]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

          {/* <div className="rounded-xl shadow-lg">
            <img
              src="/websiteimages/herosections/loandetails/business_loans/startup.jpg"
              className="h-[8rem] w-[8rem] mx-auto mb-3 rounded-lg shadow-lg border-r-2 border-b-2"
              style={{borderColor: "#BAEA29"}}
            />
            <p className="md:text-md font-semibold">Start-Up Loan</p>
          </div> */}

          <div className="rounded-xl shadow-lg">
            <img
              src="/websiteimages/herosections/loandetails/business_loans/workingcapital.jpg"
              className="h-[8rem] w-[8rem] mx-auto mb-3 rounded-lg shadow-lg border-r-2 border-b-2"
              style={{ borderColor: "#BAEA29" }}
            />
            <p className="font-poppins md:text-md font-semibold">
              Working Capital Loan
            </p>
          </div>

          <div className="rounded-xl shadow-lg">
            <img
              src="/websiteimages/herosections/loandetails/business_loans/equipment.jpg"
              className="h-[8rem] w-[8rem] mx-auto mb-3 rounded-lg shadow-lg border-r-2 border-b-2"
              style={{ borderColor: "#BAEA29" }}
            />
            <p className="font-poppins md:text-md font-semibold">
              Equipment Financing
            </p>
          </div>

          <div className="rounded-xl shadow-lg">
            <img
              src="/websiteimages/herosections/loandetails/business_loans/businessexpansion.jpg"
              className="h-[8rem] w-[8rem] mx-auto mb-3 rounded-lg shadow-lg border-r-2 border-b-2"
              style={{ borderColor: "#BAEA29" }}
            />
            <p className="font-poppins md:text-md font-semibold">
              Business Expansion Loan
            </p>
          </div>

          <div className="rounded-xl shadow-lg">
            <img
              src="/websiteimages/herosections/loandetails/business_loans/invoice.jpg"
              className="h-[8rem] w-[8rem] mx-auto mb-3 rounded-lg shadow-lg border-r-2 border-b-2"
              style={{ borderColor: "#BAEA29" }}
            />
            <p className="font-poppins md:text-md font-semibold">
              Invoice Financing
            </p>
          </div>

          <div className="rounded-xl shadow-lg">
            <img
              src="/websiteimages/herosections/loandetails/business_loans/termloan.jpg"
              className="h-[8rem] w-[8rem] mx-auto mb-3 rounded-lg shadow-lg border-r-2 border-b-2"
              style={{ borderColor: "#BAEA29" }}
            />
            <p className="font-poppins md:text-md font-semibold">
              Term Loan
            </p>
          </div>

        </div>
      </div>

      {/* <!-- FEATURES SECTION --> */}
      <div className="container mx-auto px-6 mt-16">
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/websiteimages/herosections/loandetails/listicon.png"
            className="h-[3rem]"
          />

          <h2
            className="font-rubik text-2xl md:text-5xl font-bold"
            style={{ color: "#C2EC41" }}
          >
            Features & Benefits
          </h2>
        </div>

        <ul className="space-y-5 text-lg">

          <li className="flex gap-4 items-start">
            <img
              src="/websiteimages/herosections/loandetails/personal_loans/icon1.png"
              className="h-[3rem]"
            />

            <span>
              <strong className="font-rubik">
                For New & Established Businesses
              </strong>
              <br />

              <p
                style={{ color: "#F1F4E7" }}
                className="font-poppins text-sm"
              >
                Apply even if your business is just 6 months old.
              </p>
            </span>
          </li>

          <li className="flex gap-4 items-start">
            <img
              src="/websiteimages/herosections/loandetails/business_loans/icon2.png"
              className="h-[3rem]"
            />

            <span>
              <strong className="font-rubik">
                Turnover-Based Eligibility
              </strong>
              <br />

              <p
                style={{ color: "#F1F4E7" }}
                className="font-poppins text-sm"
              >
                Funding available for businesses with ₹30 lakh+ annual turnover.
              </p>
            </span>
          </li>

          <li className="flex gap-4 items-start">
            <img
              src="/websiteimages/herosections/loandetails/business_loans/icon3.png"
              className="h-[3rem]"
            />

            <span>
              <strong className="font-rubik">
                No ITR / GST Required
              </strong>
              <br />

              <p
                style={{ color: "#F1F4E7" }}
                className="font-poppins text-sm"
              >
                Basic business registration is enough to start your loan process.(T&C applied)
              </p>
            </span>
          </li>

          <li className="flex gap-4 items-start">
            <img
              src="/websiteimages/herosections/loandetails/business_loans/icon4.png"
              className="h-[3rem]"
            />

            <span>
              <strong className="font-rubik">
                Credit Score Flexibility
              </strong>
              <br />

              <p
                style={{ color: "#F1F4E7" }}
                className="font-poppins text-sm"
              >
                Small CIBIL issues won’t stop your eligibility.
              </p>
            </span>
          </li>

          <li className="flex gap-4 items-start">
            <img
              src="/websiteimages/herosections/loandetails/business_loans/icon5.png"
              className="h-[3rem]"
            />

            <span>
              <strong className="font-rubik">
                Supports Multiple Industries
              </strong>
              <br />

              <p
                style={{ color: "#F1F4E7" }}
                className="font-poppins text-sm"
              >
                From gyms to shops to restaurants — most small businesses qualify.
              </p>
            </span>
          </li>

          <li className="flex gap-4 items-start">
            <img
              src="/websiteimages/herosections/loandetails/business_loans/icon6.png"
              className="h-[3rem]"
            />

            <span>
              <strong className="font-rubik">
                Multiple Loans Allowed
              </strong>
              <br />

              <p
                style={{ color: "#F1F4E7" }}
                className="font-poppins text-sm"
              >
                Already paying EMIs? You can still qualify for an additional business loan.
              </p>
            </span>
          </li>

          <li className="flex gap-4 items-start">
            <img
              src="/websiteimages/herosections/loandetails/business_loans/icon7.png"
              className="h-[3rem]"
            />

            <span>
              <strong className="font-rubik">
                Free Documentation Support
              </strong>
              <br />

              <p
                style={{ color: "#F1F4E7" }}
                className="font-poppins text-sm"
              >
                We assist with the paperwork from start to finish — no extra charges.
              </p>
            </span>
          </li>

          <li className="flex gap-4 items-start">
            <img
              src="/websiteimages/herosections/loandetails/business_loans/icon8.png"
              className="h-[3rem]"
            />

            <span>
              <strong className="font-rubik">
                Fast & Hassle-Free Process
              </strong>
              <br />

              <p
                style={{ color: "#F1F4E7" }}
                className="font-poppins text-sm"
              >
                Skip long bank visits — we manage the entire process for you.
              </p>
            </span>
          </li>

          <li className="flex gap-4 items-start">
            <img
              src="/websiteimages/herosections/loandetails/business_loans/icon9.png"
              className="h-[3rem]"
            />

            <span>
              <strong className="font-rubik">
                Eligible Without Khata
              </strong>
              <br />

              <p
                style={{ color: "#F1F4E7" }}
                className="font-poppins text-sm"
              >
                Businesses without UDYAM / Shop Act / GST Khata can still apply.
              </p>
            </span>
          </li>

        </ul>
      </div>

      {/* <!-- REQUIRED DOCUMENTS --> */}
      <div className="container mx-auto px-6 mt-16">

        <div className="flex items-center gap-3 mb-6">
          <img
            src="/websiteimages/herosections/loandetails/fileicon.png"
            className="h-[3rem]"
          />

          <h2
            className="font-rubik text-2xl md:text-5xl font-bold"
            style={{ color: "#C2EC41" }}
          >
            Required Documents
          </h2>
        </div>

        <div className="flex flex-col gap-10">

          {/* <!-- Personal Docs --> */}
          <div>
            <h3 className="font-rubik flex items-center gap-3 text-xl font-semibold mb-3">
              <img
                src="/websiteimages/herosections/loandetails/loan1.png"
                className="h-[3rem]"
                alt="Personal Docs"
              />
              Personal Documents
            </h3>

            <div className="flex flex-wrap gap-3">
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">
                Aadhaar Card
              </span>

              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">
                PAN Card
              </span>
            </div>
          </div>

          {/* <!-- Business Docs --> */}
          <div>
            <h3 className="font-rubik flex items-center gap-3 text-xl font-semibold mb-3">
              <img
                src="/websiteimages/herosections/loandetails/business_loans/business-doc.png"
                className="h-[3rem]"
                alt="Business Docs"
              />
              Business Identity Documents
            </h3>

            <div className="flex flex-wrap gap-3">
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">
                GST Registration
              </span>

              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">
                Udyam Registration
              </span>
            </div>
          </div>

          {/* <!-- Financial Docs --> */}
          <div>
            <h3 className="font-rubik flex items-center gap-3 text-xl font-semibold mb-3">
              <img
                src="/websiteimages/herosections/loandetails/loan2.png"
                className="h-[3rem]"
                alt="Financial Docs"
              />
              Financial Documents
            </h3>

            <ul className="space-y-3 text-lg">

              <li className="flex items-center gap-3">
                <img
                  src="/websiteimages/herosections/loandetails/rupeeicon.png"
                  className="h-[3rem]"
                  alt="Bank Statement"
                />

                <span>
                  Last 1 year Savings Bank (SB) and Current Account Statements
                </span>
              </li>

              <li className="flex items-center gap-3">
                <img
                  src="/websiteimages/herosections/loandetails/business_loans/tax.png"
                  className="h-[3rem]"
                  alt="ITR"
                />

                <span>
                  Last 2 years ITR (Full Set)
                </span>
              </li>

              <li className="flex items-center gap-3">
                <img
                  src="/websiteimages/herosections/loandetails/business_loans/gst.png"
                  className="h-[3rem]"
                  alt="GST"
                />

                <span>
                  Last 12 months GST R3B
                </span>
              </li>

            </ul>
          </div>

        </div>
      </div>

      {/* Apply Now - DaisyUI replacement for MUI */}
      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={() => navigate("/apply-now")}
          className="
            btn
            w-[70%]
            md:w-[40%]
            py-3
            min-h-0
            h-auto
            rounded-lg
            border-0
            text-black
            text-[18px]
            font-semibold
            bg-gradient-to-r
            from-[#a3e635]
            to-[#65a30d]
            hover:from-[#a3e635]
            hover:to-[#65a30d]
          "
        >
          Apply Now
        </button>
      </div>

    </section>
  );
}