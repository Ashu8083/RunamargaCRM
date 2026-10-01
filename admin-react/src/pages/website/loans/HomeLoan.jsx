export default function HomeLoan() {
  return (

  <section className="bg-[#0A1103] text-white min-h-screen pb-20">

    {/* <!-- HERO SECTION --> */}
    <div className="relative w-full h-[650px]">
      <img src="/websiteimages/herosections/loandetails/home_loans/home_loan_banner.png"
           className="w-full h-full object-cover opacity-70" />

      <div className="absolute inset-0 flex text-center flex-col justify-end px-8 md:px-20">
      <h1 className=" font-rubik md:text-[8rem] font-extrabold drop-shadow-xl px-4
              bg-gradient-to-r from-[#F5FEEB] to-[#DAF6BB]
              bg-clip-text text-transparent">
        HOME LOAN
      </h1>
      </div>
    </div>

    {/* <!-- LOAN CATEGORIES --> */}
     <p className="text-lg font-poppins text-center md:text-4xl opacity-90 p-10">
         Your dream home doesn’t have to wait! A home loan helps you buy, build, or renovate your house with easy EMI’s and flexible repayment. Whether it’s your first home or a new upgrade, it’s the smartest way to make your dream address a reality.

        </p>
    <div className="container mx-auto px-6 mt-10 w-[60%]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

       <div className="rounded-xl shadow-lg">
      <img 
        src="/websiteimages/herosections/loandetails/home_loans/homepurchase.jpg"
        className="h-[8rem] mx-auto mb-3 rounded-lg shadow-lg border-r-2 border-b-2"
         style={{borderColor: "#BAEA29"}}
      />
      <p className="md:text-md font-semibold">Home Purchase</p>
    </div>

    <div className="rounded-xl shadow-lg">
      <img 
        src="/websiteimages/herosections/loandetails/home_loans/constructionloan.jpg"
        className="h-[8rem] mx-auto mb-3 rounded-lg shadow-lg border-r-2 border-b-2"
        style={{borderColor: "#BAEA29"}}
      />
      <p className="font-poppins md:text-md font-semibold">Construction Loan</p>
    </div>

    <div className="rounded-xl shadow-lg">
      <img 
        src="/websiteimages/herosections/loandetails/home_loans/propertypurchase.jpg"
        className="h-[8rem] mx-auto mb-3 rounded-lg shadow-lg border-r-2 border-b-2"
        style={{borderColor: "#BAEA29"}}
      />
      <p className="font-poppins md:text-md font-semibold">Property Purchase</p>
    </div>

    <div className="rounded-xl shadow-lg">
      <img 
        src="/websiteimages/herosections/loandetails/home_loans/homerenovation.jpg"
        className="h-[8rem] mx-auto mb-3 rounded-lg shadow-lg border-r-2 border-b-2"
        style={{borderColor: "#BAEA29"}}
      />
      <p className="font-poppins md:text-md font-semibold">Home renovation</p>
    </div>
    
    

      </div>
    </div>

    {/* <!-- FEATURES SECTION -->/ */}
    <div className="container mx-auto px-6 mt-16">
    <div className="flex items-center gap-3 mb-6">
        <img 
            src="/websiteimages/herosections/loandetails/listicon.png"
            className="h-[3rem]"
        />
        <h2 className="font-rubik text-2xl md:text-5xl font-bold" style={{color:"#C2EC41"}}>
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
            <strong className="font-rubik">Loans for All Profiles</strong><br/>
               <p  style={{ color: "#F1F4E7" }} className="font-poppins text-sm"> Home loans available for salaried, self-employed, and even NRIs.</p>
          </span>
        </li>

        <li className="flex gap-4 items-start">
         <img 
            src="/websiteimages/herosections/loandetails/home_loans/icon1.png"
            className="h-[3rem]"
        />
          <span>
            <strong className="font-rubik">Attractive Interest Rates</strong><br/>
            <p  style={{ color: "#F1F4E7" }} className="font-poppins text-sm">Competitive rates starting from 8.40% p.a. with both fixed and floating options.</p>
          </span>
        </li>

        <li className="flex gap-4 items-start">
          <img 
            src="/websiteimages/herosections/loandetails/home_loans/icon2.png"
            className="h-[3rem]"
        />
          <span>
            <strong className="font-rubik">Small Property Eligibility</strong><br/>
             <p  style={{ color: "#F1F4E7" }} className="font-poppins text-sm">Financing available for properties from 350 sq. ft. with 650+ CIBIL.</p>
          </span>
        </li>

        <li className="flex gap-4 items-start">
        <img 
            src="/websiteimages/herosections/loandetails/home_loans/icon3.png"
            className="h-[3rem]"
        />
          <span>
            <strong className="font-rubik" >Flexible Co-Borrower Options</strong><br/>
           <p  style={{ color: "#F1F4E7" }} className="font-poppins text-sm">Add a friend or non-family member as co-applicant — a unique advantage.</p>
          </span>
        </li>

        <li className="flex gap-4 items-start">
         <img 
            src="/websiteimages/herosections/loandetails/home_loans/icon4.png"
            className="h-[3rem]"
        />
          <span>
            <strong className="font-rubik" >Zero Unfair Charges</strong><br/>
           <p  style={{ color: "#F1F4E7" }} className="font-poppins text-sm">  No login or upfront fees if you’re not eligible.</p>
          </span>
        </li>

        <li className="flex gap-4 items-start">
        <img 
            src="/websiteimages/herosections/loandetails/home_loans/icon5.png"
            className="h-[3rem]"
        />
          <span>
            <strong className="font-rubik" >High Loan-to-Value (LTV)</strong><br/>
            <p  style={{ color: "#F1F4E7" }} className="font-poppins text-sm">Get up to 90% of the property value for loans up to ₹30 lakhs.</p>
          </span>
        </li>
         <li className="flex gap-4 items-start">
        <img 
            src="/websiteimages/herosections/loandetails/home_loans/icon6.png"
            className="h-[3rem]"
        />
          <span>
            <strong className="font-rubik" >Long Tenure Flexibility</strong><br/>
            <p  style={{ color: "#F1F4E7" }} className="font-poppins text-sm">Repayment terms of up to 30 years for comfortable EMIs.</p>
          </span>
        </li>
         <li className="flex gap-4 items-start">
        <img 
            src="/websiteimages/herosections/loandetails/home_loans/icon7.png"
            className="h-[3rem]"
        />
          <span>
            <strong className="font-rubik" >Tax Savings Benefits</strong><br/>
            <p  style={{ color: "#F1F4E7" }} className="font-poppins text-sm">Enjoy deductions under Section 24 and Section 80C.</p>
          </span>
        </li>
         <li className="flex gap-4 items-start">
        <img 
            src="/websiteimages/herosections/loandetails/home_loans/icon8.png"
            className="h-[3rem]"
        />
          <span>
            <strong className="font-rubik" >Fast Processing</strong><br/>
            <p  style={{ color: "#F1F4E7" }} className="font-poppins text-sm"> Quick approval and disbursal with minimal paperwork.</p>
          </span>
        </li>
         <li className="flex gap-4 items-start">
        <img 
            src="/websiteimages/herosections/loandetails/home_loans/icon9.png"
            className="h-[3rem]"
        />
          <span>
            <strong className="font-rubik" >Balance Transfer Support</strong><br/>
            <p  style={{ color: "#F1F4E7" }} className="font-poppins text-sm"> Shift your existing home loan for better rates and lower EMIs.</p>
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
        <h2 className="font-rubik text-2xl md:text-5xl font-bold"  style={{ color: "#C2EC41" }}>
            Required Documents
        </h2>

     </div>

              {/* <!-- Wrapper (NO grid columns) --> */}
        <div className="flex flex-col gap-10">

          {/* <!-- Personal Docs --> */}
          <div>
            {/* <!-- Heading --> */}
            <h3 className=" font-rubik flex items-center gap-3 text-xl font-semibold mb-3">
              <img 
                src="/websiteimages/herosections/loandetails/loan1.png"
                className="h-[3rem]"
                alt="Personal Docs"
              />
              Personal Documents (Applicant & Co-applicant)
            </h3>

            {/* <!-- Pills --> */}
            <div className="flex flex-wrap gap-3">
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Aadhaar Card</span>
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">PAN Card</span>
               <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Address Proof</span>
                <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Passport size photo</span>
              
            </div>
          </div>
            {/* <!-- Business Docs --> */}
           <div className="flex items-center gap-3 mb-1">
              <img 
                  src="/websiteimages/herosections/loandetails/fileicon.png"
                  className="h-[3rem]"
              />
              <h2 className="font-rubik text-2xl md:text-4xl font-bold" style={{ color: "#C2EC41" }}>
                  For Self-Employed
              </h2>

          </div>


          {/* <!-- Income Docs --> */}
          <div>
            {/* <!-- Heading --> */}
            <h3 className="font-rubik flex items-center gap-3 text-xl font-semibold mb-3">
             <img 
                src="/websiteimages/herosections/loandetails/personal_loans/loan2.png"
                className="h-[3rem]"
                alt="income Docs"
              />
            Income Documents
            </h3>

            {/* <!-- List --> */}
            <ul className="space-y-3 text-lg">
              <li className="flex items-center gap-3">
                <img 
                  src="/websiteimages/herosections/loandetails/rupeeicon.png"
                  className="h-[3rem]"
                  alt="Bank Statement"
                />
                <span>Last 1 year complete Bank Statements(All accounts)</span>
              </li>

              <li className="flex items-center gap-3">
                <img 
                  src="/websiteimages/herosections/loandetails/business_loans/tax.png"
                  className="h-[3rem]"
                  alt="ITR"
                />
                <span>Last 3months Salary Slip</span>
              </li>

            
            </ul>
          </div>
        {/* <!-- property Docs --> */}
          <div>
            {/* <!-- Heading --> */}
            <h3 className="font-rubik flex items-center gap-3 text-xl font-semibold mb-3">
              <img 
                src="/websiteimages/herosections/loandetails/business_loans/business-doc.png"
                className="h-[3rem]"
                alt="income Docs"
              />
            Property Documents
            </h3>
             {/* <!-- Pills --> */}
            <div className="flex flex-wrap gap-3 mb-5">
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Sale Deed</span>
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Mother Deed</span>
               <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Khata Certificate</span>
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Property Tax Paid Receipts</span>
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Udyam Aadhar</span>
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Encumbrance Certificate</span>
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Property Location Details</span>
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Business Location Proof</span>
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Business Photos/Video</span>
              
            </div>
            {/* <!-- List --> */}
            <ul className="space-y-3 text-lg mb-3">
              <li className="flex items-center gap-3">
                <img 
                  src="/websiteimages/herosections/loandetails/rupeeicon.png"
                  className="h-[3rem]"
                  alt="Bank Statement"
                />
                <span>Last 1 year complete Bank Statements(All accounts)</span>
              </li>

              <li className="flex items-center gap-3">
                <img 
                  src="/websiteimages/herosections/loandetails/business_loans/tax.png"
                  className="h-[3rem]"
                  alt="ITR"
                />
                <span>Last 3months Salary Slip</span>
              </li>

             
            </ul>
              {/* <!-- Business Docs --> */}
           <div className="flex items-center gap-3 mb-6">
              <img 
                  src="/websiteimages/herosections/loandetails/fileicon.png"
                  className="h-[3rem]"
              />
              <h2 className="font-rubik text-2xl md:text-4xl font-bold" style={{ color: "#C2EC41" }}>
                  For Salaried Person
              </h2>

          </div>


          {/* <!-- Income Docs --> */}
          <div>
            {/* <!-- Heading --> */}
            <h3 className="font-rubik flex items-center gap-3 text-xl font-semibold mb-3">
              <img 
                src="/websiteimages/herosections/loandetails/personal_loans/loan2.png"
                className="h-[3rem]"
                alt="income Docs"
              />
            Income Documents
            </h3>

            {/* <!-- List --> */}
            <ul className="space-y-3 text-lg">
              <li className="flex items-center gap-3">
                <img 
                  src="/websiteimages/herosections/loandetails/rupeeicon.png"
                  className="h-[3rem]"
                  alt="Bank Statement"
                />
                <span>Last 6 months Bank Statements</span>
              </li>

              <li className="flex items-center gap-3">
                <img 
                  src="/websiteimages/herosections/loandetails/business_loans/gst.png"
                  className="h-[3rem]"
                  alt="ITR"
                />
                <span>Last 12 months GST R3B</span>
              </li>

            </ul>
          </div>
          {/* <!-- Property Docs --> */}
          <div>
            {/* <!-- Heading --> */}
            <h3 className="font-rubik flex items-center gap-3 text-xl font-semibold mt-5 mb-4 ">
              <img 
                src="/websiteimages/herosections/loandetails/business_loans/business-doc.png"
                className="h-[3rem]"
                alt="property Docs"
              />
            Property Documents
            </h3>

            {/* <!-- Pills --> */}
            <div className="flex flex-wrap gap-3 mb-5">
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Sale Deed</span>
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Mother Deed</span>
               <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Khata Certificate</span>
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Property Tax Paid Receipts</span>
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Udyam Aadhar</span>
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Encumbrance Certificate</span>
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">DC Conversion Order Copy</span>
              <span className="font-poppins px-5 py-2 bg-[#20350e] rounded-full border border-white/20">Approved Layout Plan</span>
         
              
            </div>
          </div>
          </div>
        </div>

      

      </div>

    </section>

  );
}
