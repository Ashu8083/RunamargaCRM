export default function OtherLoans() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0b1a00] to-[#132600] text-white py-20">

      {/* <!-- ====== HEADING ====== --> */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 
                        text-[9vw] font-black text-white/5 select-none pointer-events-none 
                        whitespace-nowrap z-0 pt-[5%]">
        ALL LOANS
      </div>

      {/* <!-- ====== LOANS LIST ====== --> */}
      <div className="container mx-auto px-4 pt-[20rem] relative z-10">
        <div className="max-w-6xl mx-auto space-y-24 px-6">

          {/* <!-- Educational Loan --> */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-rubik font-bold mb-4">
                Educational Loan
              </h2>
              <p className="text-gray-300 text-lg font-poppins leading-relaxed">
                Dreaming big about your studies? An education loan helps you cover tuition fees, books, travel, or living expenses – whether in India or abroad.
              </p>
            </div>
            <div className="text-center md:text-left">
              <img
                src="/websiteimages/educationloan.jpg"
                className="w-full rounded-xl md:w-full sm:w-50 mx-auto md:mx-0 shadow-[4px_4px_0_#BAEA29]"
              />
            </div>
          </div>



          {/* <!-- Loan Against Property --> */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <img
              src="/websiteimages/LAP.jpg"
              className="rounded-xl 
                  shadow-[4px_4px_0_#BAEA29]"
            />

            <div>
              <h2 className="text-4xl font-rubik text-right font-bold mb-4">Loan Against Property</h2>
              <p className="text-gray-300 text-right text-lg font-poppins leading-relaxed">
                Got property? Unlock its value with a loan against property! Use your residential or commercial property as security and get big funds for business, education, weddings, or emergencies – all with lower interest and longer repayment options.
              </p>
            </div>
          </div>

          {/* <!-- Gold Loan --> */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl font-rubik font-bold mb-4">Gold Loan</h2>
              <p className="text-gray-300 font-poppins text-lg leading-relaxed">
                Why let your gold sit idle when it can support your needs? You simply pledge your gold ornaments or jewelry with the lender and receive cash based on its value. The gold stays safe with the bank/NBFC, and once you repay the loan with interest, your gold is returned. It’s fast, secure, and perfect for handling emergencies, big purchases, or personal needs.
              </p>
            </div>
            <img
              src="/websiteimages/goldloan.jpg"
              className="rounded-xl 
                  shadow-[4px_4px_0_#BAEA29]"
            />
          </div>

          {/* <!-- Car Loan --> */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <img
              src="/websiteimages/carloan.jpg"
              className="rounded-xl 
                  shadow-[4px_4px_0_#BAEA29]"
            />
            <div>
              <h2 className="text-4xl font-rubik text-right font-bold mb-4">Car Loan</h2>
              <p className="text-right text-lg font-poppins text-gray-300 leading-relaxed">
                Why wait to own your dream car? A car loan makes it easy to buy a new or used car with simple EMIs and quick approval. Just choose your car, and let the loan take care of the rest - fast, easy, and worry-free!
              </p>
            </div>
          </div>

          {/* <!-- Credit Card --> */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-rubik font-bold mb-4">Credit Card</h2>
              <p className="text-gray-300 font-poppins text-lg leading-relaxed">
                A credit card is your handy money partner – swipe now, pay later! It lets you shop, pay bills, travel, or book tickets with ease, while also giving rewards, cashback, and offers. Safe, convenient, and flexible - it’s like carrying extra power in your pocket.
              </p>
            </div>
            <img
              src="/websiteimages/creditcard.png"
              className="rounded-xl 
                  shadow-[4px_4px_0_#BAEA29]"
            />
          </div>

        </div>
      </div>

    </section>
  );
}
