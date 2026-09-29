export default function TermsConditions() {
  return (
    <div className="contact-page-wrapper min-h-screen bg-zinc-950 relative overflow-hidden p-5">

      {/* GREEN RADIAL GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] 
            bg-[radial-gradient(circle,rgba(154,255,46,0.35),transparent_70%)] 
            blur-[140px] opacity-90 rounded-full pointer-events-none z-0">
      </div>

      <div className="container mx-auto px-4 max-w-5xl">

        {/* BACKGROUND TEXT */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 
            text-[7vw] font-black text-white/5 select-none pointer-events-none 
            whitespace-nowrap z-0 pt-[20%] lg:pt-[5%]">
          TERMS & CONDITIONS
        </div>

        <div className="container mx-auto px-4 pt-[12rem] lg:pt-[20rem] relative z-10">

          <div className="space-y-8 text-gray-300 leading-relaxed">

            <p>
              Welcome to Runamarga. By accessing or using our website, mobile
              application, or services related to loan facilitation, you agree
              to abide by these Terms & Conditions. Please review them carefully
              before proceeding.
            </p>

            {/* 1 */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                1. Nature of Service
              </h2>
              <p>
                Runamarga operates as a Direct Selling Agent (DSA), partnering
                with banks, NBFCs, and financial institutions to help customers
                explore, compare, and apply for loan products. Our role is
                strictly limited to connecting customers with lending partners —
                we do not ourselves sanction, approve, or disburse loans.
              </p>
            </div>

            {/* 2 */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                2. Eligibility
              </h2>
              <p>
                Loan approval and eligibility are solely determined by the
                respective financial institutions based on their internal
                credit assessment policies, such as income level, repayment
                capacity, employment status, and credit history. Submitting an
                application via Runamarga does not imply guaranteed approval.
              </p>
            </div>

            {/* 3 */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                3. User Responsibility & Information Accuracy
              </h2>
              <p>
                You agree to provide complete, accurate, and up-to-date
                information while applying for a loan. Any incorrect, misleading,
                or falsified information may result in cancellation of your
                application, rejection by lenders, or other legal consequences.
              </p>
            </div>

            {/* 4 */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                4. Documentation
              </h2>
              <p>
                Applicants may be required to furnish KYC documents, financial
                proofs, employment details, and other relevant records as
                requested by lending partners. Runamarga does not modify,
                tamper with, or misrepresent any customer-provided documentation.
              </p>
            </div>

            {/* 5 */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                5. Fees & Charges
              </h2>
              <p>
                We do not charge any upfront or hidden fees for loan facilitation
                services. However, our partner banks or NBFCs may apply their own
                processing fees, administrative charges, or other applicable costs
                in accordance with their policies. Customers are advised to review
                such charges before finalizing any loan offer.
              </p>
            </div>

            {/* 6 */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                6. Loan Disbursement
              </h2>
              <p>
                The loan amount, tenure, interest rate, and disbursement timeline
                are governed entirely by the respective bank or NBFC. Runamarga
                does not influence lending decisions and shall not be held
                responsible for delays, rejections, or variations in loan terms.
              </p>
            </div>

            {/* 7 */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                7. Limitation of Liability
              </h2>

              <p className="mb-3">
                We act solely as an intermediary platform. We shall not be held
                responsible for any financial loss, claim, delay, or dispute
                arising between the customer and the lender.
              </p>

              <p className="italic text-gray-400">
                *Note: We do not directly offer or disburse loans. Our role is
                limited to providing a digital platform that facilitates loan
                connections between customers and registered banks or NBFCs.
              </p>
            </div>

            {/* 8 */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                8. Privacy & Data Protection
              </h2>
              <p>
                Your personal and financial information is collected for the sole
                purpose of facilitating loan applications and is shared only with
                authorized lending partners. We adhere to strict confidentiality
                and data protection standards. For further details, refer to our
                Privacy Policy.
              </p>
            </div>

            {/* 9 */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                9. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify, revise, or update these Terms &
                Conditions at any time without prior notice. Any changes will
                become effective once published on our website or app.
                Continued use of our services implies acceptance of the updated
                terms.
              </p>
            </div>

            {/* 10 */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                10. Contact Us
              </h2>

              <p>Email: runamarga1@gmail.com</p>
              <p>Phone: +91-8147740043</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}