import { useState, useRef } from "react";

export default function PersonalLoan() {
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");
  const [pincode, setPincode] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [emi, setEmi] = useState("");
  const [houseType, setHouseType] = useState("Rent");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const resultRef = useRef(null);

  async function checkEligibility() {
    try {
      setLoading(true);
      setResult(null);

      const res = await fetch("/eligibility/personal-loan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company,
          salary: Number(salary),
          pincode,
          credit_score: Number(creditScore),
          emi: Number(emi),
          house_type: houseType.toLowerCase(),
        }),
      });

      if (!res.ok) {
        throw new Error("Eligibility request failed");
      }

      const data = await res.json();

      setResult(data);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);

    } catch (error) {
      console.error("Eligibility check failed:", error);

      setResult({
        eligible: false,
        error: true,
      });

    } finally {
      setLoading(false);
    }
  }

  return (
    <>

      <div className="flex justify-center py-12 px-6 text-[#d4ffb2]">

        <div
          className="
            w-full
            max-w-7xl
            grid
            grid-cols-1
            md:grid-cols-2
            gap-10
          "
        >

          {/* LEFT PANEL */}
          <div className="p-2 space-y-4">

            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="glowInput"
              placeholder="Company"
            />

            <input
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="glowInput"
              type="number"
              placeholder="Salary"
            />

            <input
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="glowInput"
              placeholder="Pincode"
            />

            <input
              value={creditScore}
              onChange={(e) => setCreditScore(e.target.value)}
              className="glowInput"
              type="number"
              placeholder="Credit Score"
            />

            <input
              value={emi}
              onChange={(e) => setEmi(e.target.value)}
              className="glowInput"
              type="number"
              placeholder="EMI"
            />


            {/* HOUSE TYPE */}
            <div>

              <label className="text-sm block mb-2">
                House Type:
              </label>

              <div className="flex gap-6">

                <label className="flex items-center gap-2 cursor-pointer">

                  <input
                    type="radio"
                    name="personalHouseType"
                    checked={houseType === "Own"}
                    onChange={() => setHouseType("Own")}
                    className="radio radio-success"
                  />

                  Own

                </label>

                <label className="flex items-center gap-2 cursor-pointer">

                  <input
                    type="radio"
                    name="personalHouseType"
                    checked={houseType === "Rent"}
                    onChange={() => setHouseType("Rent")}
                    className="radio radio-success"
                  />

                  Rent

                </label>

              </div>

            </div>


            {/* CHECK BUTTON */}
            <button
              type="button"
              onClick={checkEligibility}
              disabled={loading}
              className="
                btn
                w-full
                mt-4
                bg-[#b4ff4e]
                text-black
                border-none
                font-semibold
                hover:bg-[#caff66]
                shadow-[0_0_20px_#b4ff4e90]
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Checking Eligibility...
                </>
              ) : (
                "Check Eligibility"
              )}
            </button>

          </div>


          {/* RIGHT PANEL */}
          <div
            className="
              rounded-2xl
              overflow-hidden
              relative
              bg-gradient-to-b
              from-[#0f1f0c]/90
              via-[#0b1708]/80
              to-[#0d1b0a]/90
              border
              border-[#3a542e]/40
              shadow-[0_0_20px_rgba(142,255,70,0.12)]
              backdrop-blur-xl
            "
          >

            {/* IMAGE */}
            <div className="relative">

              <img
                src="/websiteimages/eligibility/personal_loan.png"
                className="w-full h-56 object-cover opacity-95"
                alt="Personal Loan"
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-b
                  from-[#1a3d14]/40
                  to-transparent
                "
              />

            </div>


            {/* SUMMARY */}
            <div className="p-6">

              <h2
                className="
                  text-lg
                  font-semibold
                  text-[#c8ff74]
                  mb-6
                  flex
                  justify-center
                  items-center
                  gap-2
                "
              >

                <img
                  src="/websiteimages/eligibility/pl.png"
                  className="h-8"
                  alt=""
                />

                Personal Loan Summary

              </h2>


              <div className="space-y-2 text-sm">

                <p>
                  <span className="labelText">Company:</span>{" "}
                  {company || "-"}
                </p>

                <p>
                  <span className="labelText">Net Salary:</span>{" "}
                  {salary || "-"}
                </p>

                <p>
                  <span className="labelText">
                    Credit Score:
                  </span>{" "}
                  {creditScore || "-"}
                </p>

                <p>
                  <span className="labelText">
                    Monthly Obligation:
                  </span>{" "}
                  {emi || "-"}
                </p>

                <p>
                  <span className="labelText">
                    House Type:
                  </span>{" "}
                  {houseType}
                </p>

              </div>


              <p className="text-xs text-red-400 mt-5 leading-relaxed">
                ❗ This summary is an approximation based on the
                information provided and does not constitute a loan
                offer or approval.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* RESULT */}
      {result && (
        <div
          ref={resultRef}
          className={`
            mt-10
            text-center
            font-semibold
            text-lg
            ${result.eligible
              ? "text-[#c8ff74]"
              : "text-red-400"
            }
          `}
        >

          {result.error ? (
            "❌ Unable to check eligibility. Please try again."
          ) : result.eligible ? (
            "✅ You are eligible for a personal loan"
          ) : (
            "❌ Sorry, you are currently not eligible for a personal loan"
          )}

        </div>
      )}

    </>
  );
}