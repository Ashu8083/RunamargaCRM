import { useState } from "react";
import { API_BASE_URL } from "../../config/url";

export default function ContactUs() {
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(`${API_BASE_URL}/contactus/store`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        setShowPopup(true);
        e.target.reset();
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#09090b] relative overflow-hidden">
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
          CONTACT US
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* LEFT CONTACT DETAILS */}
            <div className="text-white">
              <h2 className="text-[2.2rem] font-bold mb-2">
                Get In Touch
              </h2>

              <p className="text-[#d1d5db] max-w-[340px] mb-5">
                Feel free to connect with us anytime.
                We’ll get back to you as soon as possible!
              </p>

              <div className="text-[#d1d5db] flex flex-col gap-3">
                <div className="flex gap-2 items-start">
                  <img
                    src="/websiteimages/icons/location.png"
                    alt=""
                    className="w-6 opacity-80 shrink-0"
                  />

                  <p>
                    D.K Building, 5, Kannada Kasturi Rd, next to Post Office,
                    Maheswari Nagar, T. Dasarahalli, Bengaluru, Karnataka 560057
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <img
                    src="/websiteimages/icons/phone.png"
                    alt=""
                    className="w-6 opacity-80 shrink-0"
                  />

                  <p>8147740043</p>
                </div>

                <div className="flex gap-2 items-center">
                  <img
                    src="/websiteimages/icons/email.png"
                    alt=""
                    className="w-6 opacity-80 shrink-0"
                  />

                  <p>contact.runamarga@gmail.com</p>
                </div>

                <div className="flex gap-2 items-center">
                  <img
                    src="/websiteimages/icons/time.png"
                    alt=""
                    className="w-6 opacity-80 shrink-0"
                  />

                  <p>10am to 6pm</p>
                </div>
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
                <h3 className="text-[#BAEA29] text-[1.6rem] font-semibold mb-6">
                  Your Detail
                </h3>

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                >
                  {/* NAME + EMAIL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#d1d5db] text-[14px]">
                        Name{" "}
                        <span className="text-[#BAEA29]">*</span>
                      </label>

                      <input
                        name="name"
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
                      <label className="text-[#d1d5db] text-[14px]">
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="email"
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
                    <label className="text-[#d1d5db] text-[14px]">
                      Subject{" "}
                      <span className="text-[#BAEA29]">*</span>
                    </label>

                    <input
                      type="text"
                      name="subject"
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
                    <label className="text-[#d1d5db] text-[14px]">
                      Message
                    </label>

                    <textarea
                      name="message"
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
                    disabled={loading}
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
                    {loading ? (
                      <span className="loading loading-spinner loading-md text-black" />
                    ) : (
                      "Send Message"
                    )}
                  </button>

                  {error && (
                    <p className="text-red-400 text-sm">
                      {error}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* GOOGLE MAP */}
        <div className="mt-20 overflow-hidden shadow-lg">
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
            className="w-full object-cover"
          />
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {showPopup && (
        <div
          className="
            fixed
            inset-0
            flex
            items-center
            justify-center
            bg-[rgba(0,0,0,0.7)]
            z-[9999]
          "
        >
          <div
            className="
              bg-[#18181b]
              border
              border-[#BAEA2930]
              rounded-[16px]
              p-5
              w-[90%]
              max-w-[400px]
              text-center
              shadow-[0_20px_50px_rgba(0,0,0,0.6)]
            "
          >
            <div className="text-[2.5rem] mb-2">
              ✅
            </div>

            <h3 className="text-white text-[1.5rem] font-bold mb-1">
              Message Sent!
            </h3>

            <p className="text-[#d1d5db] mb-4">
              We’ll get back to you shortly.
            </p>

            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="
                btn
                px-4
                py-2
                bg-[#BAEA29]
                hover:bg-[#a5d824]
                text-black
                font-semibold
                rounded-[10px]
                border-0
                min-h-0
                h-auto
                normal-case
              "
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}