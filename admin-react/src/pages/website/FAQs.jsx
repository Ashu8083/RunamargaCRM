import { useState } from "react";

export default function FAQ() {
  const [tab, setTab] = useState(0);

  const handleChange = (newValue) => {
    setTab(newValue);
  };

  return (
    <div
      className="
        min-h-screen
        bg-[#09090b]
        relative
        overflow-hidden
      "
    >
      {/* BIG GREEN RADIAL GLOW */}
      <div
        className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2
          w-[900px]
          h-[600px]
          bg-[radial-gradient(circle,rgba(154,255,46,0.35),transparent_70%)]
          blur-[140px]
          opacity-90
          rounded-[100%]
          pointer-events-none
          z-0
        "
      />

      {/* CONTACT BACKGROUND TEXT */}
      <div
        className="
          absolute
          top-10
          left-1/2
          -translate-x-1/2
          text-[9vw]
          font-black
          text-[rgba(255,255,255,0.05)]
          select-none
          pointer-events-none
          whitespace-nowrap
          z-0
          pt-[20%]
          lg:pt-[5%]
        "
      >
        FAQ
      </div>

      <div
        className="
          container
          mx-auto
          max-w-6xl
          px-4
          pt-[12rem]
          lg:pt-[20rem]
          relative
          z-10
        "
      >
        {/* GRID */}
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-12
            items-start
          "
        >
          {/* LEFT CONTACT DETAILS */}
          <div className="text-white">
            <h2
              className="
                text-[2.2rem]
                font-bold
                mb-2
              "
            >
              Frequently Asked Questions!
            </h2>

            <p
              className="
                text-[#d1d5db]
                max-w-[340px]
                mb-5
              "
            >
              Find Your Answers Below
            </p>

            <div>
              {/* Tabs */}
              <div className="flex mb-3">
                <button
                  type="button"
                  onClick={() => handleChange(0)}
                  className={`
                    px-6
                    py-2
                    font-semibold
                    rounded-l-[10px]
                    border-0
                    normal-case
                    min-h-0
                    h-auto
                    ${
                      tab === 0
                        ? "bg-[#eaffd3] text-black"
                        : "bg-transparent text-[#9ca3af]"
                    }
                  `}
                >
                  General
                </button>

                <button
                  type="button"
                  onClick={() => handleChange(1)}
                  className={`
                    px-6
                    py-2
                    font-semibold
                    rounded-r-[10px]
                    border-0
                    normal-case
                    min-h-0
                    h-auto
                    ${
                      tab === 1
                        ? "bg-[#eaffd3] text-black"
                        : "bg-transparent text-[#9ca3af]"
                    }
                  `}
                >
                  Loans
                </button>
              </div>

              {/* General Questions */}
              {tab === 0 && (
                <div>
                  <h3
                    className="
                      text-white
                      font-semibold
                      mb-1
                    "
                  >
                    What is this platform about?
                  </h3>

                  <p
                    className="
                      text-[#9ca3af]
                      text-[14px]
                      mb-3
                    "
                  >
                    This platform provides financial services and loan
                    management solutions.
                  </p>

                  <h3
                    className="
                      text-white
                      font-semibold
                      mb-1
                    "
                  >
                    How do I register?
                  </h3>

                  <p
                    className="
                      text-[#9ca3af]
                      text-[14px]
                    "
                  >
                    You can register by clicking the "Sign Up" button on the
                    homepage and filling in the required details.
                  </p>
                </div>
              )}

              {/* Loans Questions */}
              {tab === 1 && (
                <div>
                  <h3
                    className="
                      text-white
                      font-semibold
                      mb-1
                    "
                  >
                    How do I apply for a loan?
                  </h3>

                  <p
                    className="
                      text-[#9ca3af]
                      text-[14px]
                      mb-3
                    "
                  >
                    Simply go to the Loans section, choose your loan type, and
                    fill out the application form.
                  </p>

                  <h3
                    className="
                      text-white
                      font-semibold
                      mb-1
                    "
                  >
                    What documents are required?
                  </h3>

                  <p
                    className="
                      text-[#9ca3af]
                      text-[14px]
                    "
                  >
                    You will need to provide identity proof, address proof, and
                    income documents for loan approval.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT FORM */}
          <div>
            <div
              className="
                p-5
                rounded-[16px]
                border
                border-[#BAEA2915]
                bg-cover
                bg-center
                bg-no-repeat
              "
              style={{
                backgroundImage:
                  "url('/websiteimages/contact-bg.png')",
              }}
            >
              <h3
                className="
                  text-[#BAEA29]
                  text-[1.6rem]
                  font-semibold
                  mb-6
                "
              >
                Your Detail
              </h3>

              <form
                className="
                  flex
                  flex-col
                  gap-6
                "
              >
                {/* NAME + EMAIL */}
                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >
                  <div>
                    <label
                      className="
                        text-[#d1d5db]
                        text-[14px]
                      "
                    >
                      Name{" "}
                      <span className="text-[#BAEA29]">*</span>
                    </label>

                    <input
                      type="text"
                      placeholder="Your name"
                      className="
                        input
                        w-full
                        mt-1
                        bg-transparent
                        border-0
                        border-b-2
                        border-[#BAEA2940]
                        rounded-none
                        px-0
                        pb-[10px]
                        text-white
                        focus:outline-none
                        focus:border-[#BAEA29]
                      "
                    />
                  </div>

                  <div>
                    <label
                      className="
                        text-[#d1d5db]
                        text-[14px]
                      "
                    >
                      Email Address
                    </label>

                    <input
                      type="email"
                      placeholder="Your Email Address"
                      className="
                        input
                        w-full
                        mt-1
                        bg-transparent
                        border-0
                        border-b-2
                        border-[#BAEA2940]
                        rounded-none
                        px-0
                        pb-[10px]
                        text-white
                        focus:outline-none
                        focus:border-[#BAEA29]
                      "
                    />
                  </div>
                </div>

                {/* SUBJECT */}
                <div>
                  <label
                    className="
                      text-[#d1d5db]
                      text-[14px]
                    "
                  >
                    Subject{" "}
                    <span className="text-[#BAEA29]">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Message Subject"
                    className="
                      input
                      w-full
                      mt-1
                      bg-transparent
                      border-0
                      border-b-2
                      border-[#BAEA2940]
                      rounded-none
                      px-0
                      pb-[10px]
                      text-white
                      focus:outline-none
                      focus:border-[#BAEA29]
                    "
                  />
                </div>

                {/* MESSAGE */}
                <div>
                  <label
                    className="
                      text-[#d1d5db]
                      text-[14px]
                    "
                  >
                    Message
                  </label>

                  <textarea
                    rows={4}
                    placeholder="Your Message"
                    className="
                      textarea
                      w-full
                      mt-1
                      bg-transparent
                      border-0
                      border-b-2
                      border-[#BAEA2940]
                      rounded-none
                      px-0
                      pb-[10px]
                      text-white
                      resize-none
                      focus:outline-none
                      focus:border-[#BAEA29]
                    "
                  />
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="
                    btn
                    w-full
                    py-3
                    mt-2
                    bg-[#BAEA29]
                    hover:bg-[#a5d824]
                    text-black
                    font-semibold
                    rounded-[12px]
                    border-0
                    shadow-[0_0_20px_#BAEA2988]
                    min-h-0
                    h-auto
                    normal-case
                  "
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* GOOGLE MAP */}
      <div
        className="
          mt-20
          overflow-hidden
          shadow-lg
        "
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242.92691958800978!2d77.51284090981622!3d13.04644523274919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3d4ce6104a95%3A0xa1867106032b82ad!2sRunamarga!5e0!3m2!1sen!2sin!4v1764223282520!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
        ></iframe>
      </div>

      {/* OFFICE IMAGE */}
      <div className="overflow-hidden shadow-lg">
        <img
          src="/websiteimages/contactus.png"
          alt=""
          className="
            w-full
            object-cover
          "
        />
      </div>
    </div>
  );
}