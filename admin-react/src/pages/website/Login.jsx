import { useState } from "react";

export default function Login() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtp = () => {
    if (phone.length < 10) {
      alert("Enter valid phone number");
      return;
    }

    setStep(2);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 4) {
      alert("Enter valid OTP");
      return;
    }

    alert("Login Successful 🚀");
  };

  return (
    <div
      className="
        h-screen
        bg-gradient-to-br
        from-[#0f172a]
        to-[#1e293b]
        flex
        items-center
        justify-center
      "
    >
      <div
        className="
          w-[380px]
          rounded-[20px]
          bg-base-100
          shadow-[0_20px_60px_rgba(0,0,0,0.3)]
          p-2
        "
      >
        <div className="card-body">

          {/* Title */}
          <h2 className="card-title font-bold mb-1">
            Welcome Back 👋
          </h2>

          <p className="text-base-content/60 mb-3">
            Login with your phone number
          </p>

          {/* STEP 1 - PHONE */}
          {step === 1 && (
            <>
              <label className="form-control w-full mb-3">
                <div className="label">
                  <span className="label-text">
                    Phone Number
                  </span>
                </div>

                <div className="join w-full">
                  <span
                    className="
                      join-item
                      flex
                      items-center
                      px-3
                      bg-base-200
                      border
                      border-base-300
                      text-base-content
                    "
                  >
                    +91
                  </span>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="
                      input
                      input-bordered
                      join-item
                      w-full
                    "
                  />
                </div>
              </label>

              <button
                type="button"
                onClick={handleSendOtp}
                className="
                  btn
                  btn-primary
                  btn-lg
                  w-full
                  rounded-[10px]
                  font-bold
                  normal-case
                  min-h-0
                  h-auto
                  py-3
                "
              >
                Send OTP
              </button>
            </>
          )}

          {/* STEP 2 - OTP */}
          {step === 2 && (
            <>
              <p className="mb-2">
                Enter OTP sent to +91 {phone}
              </p>

              <label className="form-control w-full mb-3">
                <div className="label">
                  <span className="label-text">
                    Enter OTP
                  </span>
                </div>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="input input-bordered w-full"
                />
              </label>

              <button
                type="button"
                onClick={handleVerifyOtp}
                className="
                  btn
                  btn-primary
                  btn-lg
                  w-full
                  rounded-[10px]
                  font-bold
                  normal-case
                  min-h-0
                  h-auto
                  py-3
                "
              >
                Verify & Login
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="
                  btn
                  btn-ghost
                  w-full
                  mt-1
                  normal-case
                "
              >
                Change Number
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}