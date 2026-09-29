export default function Footer({ navigate }) {
  return (
    <section className="bg-[linear-gradient(180deg,#0E1C00_0%,#3B4813_100%)] px-6 py-12 text-white">

      {/* Footer Links */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-4">Quick Links</h3>
          <div className="h-[3px] w-10 bg-[#A6FF3A] mb-4"></div>

          <ul className="space-y-2">
            <li className="cursor-pointer hover:text-[#BAEA29]" onClick={() => navigate("/")}>Home</li>
            {/* <li className="cursor-pointer hover:text-[#BAEA29]" onClick={() => navigate("/calculator")}>Calculator</li> */}
            <li className="cursor-pointer hover:text-[#BAEA29]" onClick={() => navigate("/contactus")}>Contact Us</li>
            {/* <li className="cursor-pointer hover:text-[#BAEA29]" onClick={() => navigate("/blogs")}>Blogs</li> */}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-bold text-lg mb-4">Support</h3>
          <div className="h-[3px] w-10 bg-[#A6FF3A] mb-4"></div>

          <ul className="space-y-2">
            <li className="cursor-pointer hover:text-[#BAEA29]" onClick={() => navigate("/faqs")} >Help (FAQ)</li>
            <li className="cursor-pointer hover:text-[#BAEA29]" onClick={() => navigate("/about")}>Careers</li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="font-bold text-lg mb-4">Policies</h3>
          <div className="h-[3px] w-10 bg-[#A6FF3A] mb-4"></div>

          <ul className="space-y-2">
            <li className="cursor-pointer hover:text-[#BAEA29]" onClick={() => navigate("/privacy-policy")}>Privacy Policy</li>
            <li className="cursor-pointer hover:text-[#BAEA29]" onClick={() => navigate("/terms-conditions")} >Terms & Condition</li>
            {/* <li className="cursor-pointer hover:text-[#BAEA29]">Deletion of Data</li> */}
          </ul>
        </div>
      </div>

      {/* Contact Card */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="bg-white text-black rounded-3xl p-6 md:p-10 shadow-lg">

          <div className="flex justify-center mb-6">
            <img src="/websiteimages/runamarga_blacklogo.png" className="h-10" />
          </div>

          {/* Email + Phone */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-20 text-lg text-center">
            <p>runamarga1@gmail.com</p>
            <p>+91 8147740043</p>
          </div>

          {/* Address */}
          <div className="text-center text-base md:text-lg mt-6 leading-relaxed">
            #05, D.K building, Near Post Office, Kannada <br />
            Kasturi Road, T.Dasarahalli, Bangalore 560057
          </div>
          <div className="flex justify-center items-center gap-6 text-2xl">

            <a
              href="https://www.instagram.com/runamarga_official/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition"
            >
              <i className="fab fa-instagram"></i>
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=61577463556836"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition"
            >
              <i className="fab fa-facebook"></i>
            </a>

            <a
              href="https://www.youtube.com/@RUNAMARGA"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition"
            >
              <i className="fab fa-youtube"></i>
            </a>
            <a
              href="https://x.com/runamarga"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition"
            >
              <i className="fab fa-twitter"></i>
            </a>

          </div>
          <p className="text-center text-gray-600 mt-6 text-sm">
            © {new Date().getFullYear()} Runamarga. All Rights Reserved.
          </p>


        </div>
      </div>

    </section>
  );
}