import { useState } from "react";
import { useNavigate } from "react-router-dom";
import lenders from "../../../data/lenders";
import { calculateBestOffer } from "../../../utils/businessloan_calc";

export default function BusinessLoan() {
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [hasChecked, setHasChecked] = useState(false);

  const [turnover, setTurnover] = useState("");
  const [abb, setAbb] = useState("");
  const [company, setCompany] = useState("");
  const [vintage, setVintage] = useState("");
  const [monthlyObligation, setMonthlyObligation] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [emi, setEmi] = useState("");
  const [houseType, setHouseType] = useState("Own");
  const [bankStatement, setBankStatement] = useState(null);

  function uploadFile(e) {
    setBankStatement(e.target.files[0]);
  }

  function checkEligibility() {
    if (!vintage) {
      return;
    }

    const today = new Date();
    const regDate = new Date(vintage);

    const years =
      (today - regDate) / (1000 * 60 * 60 * 24 * 365);

    const result = calculateBestOffer(lenders, {
      turnover: Number(turnover),
      abb: Number(abb),
      cibil: Number(creditScore),
      vintage: years,
      existingEmi: Number(monthlyObligation || emi),
    });

    setOffers(result);
    setHasChecked(true);
  }

  return (
    <div className="flex justify-center py-12 px-6 text-[#d4ffb2]">
      <div className="w-full max-w-7xl">

        {/* FORM + SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* LEFT PANEL */}
          <div className="p-2 space-y-4">

            {/* BUSINESS */}
            <div>
              <label className="text-sm block mb-1">
                Nature Of Business:
              </label>

              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="glowInput"
              />
            </div>

            {/* VINTAGE */}
            <div>
              <label className="text-sm block mb-1">
                Vintage (Registered date of your Business):
              </label>

              <input
                type="date"
                value={vintage}
                onChange={(e) => setVintage(e.target.value)}
                className="glowInput !pr-10"
              />
            </div>

            {/* EMI */}
            <div>
              <label className="text-sm block mb-1">
                Present Monthly EMI Amount:
              </label>

              <input
                type="number"
                value={monthlyObligation}
                onChange={(e) =>
                  setMonthlyObligation(e.target.value)
                }
                className="glowInput"
              />
            </div>

            {/* CREDIT SCORE */}
            <div>
              <label className="text-sm block mb-1">
                Approximate Credit Score:
              </label>

              <input
                type="number"
                value={creditScore}
                onChange={(e) =>
                  setCreditScore(e.target.value)
                }
                className="glowInput"
              />
            </div>

            {/* TURNOVER */}
            <div>
              <label className="text-sm block mb-1">
                Annual Turnover:
              </label>

              <input
                type="number"
                value={turnover}
                onChange={(e) =>
                  setTurnover(e.target.value)
                }
                className="glowInput"
              />
            </div>

            {/* ABB */}
            <div>
              <label className="text-sm block mb-1">
                Average Bank Balance (ABB):
              </label>

              <input
                type="number"
                value={abb}
                onChange={(e) =>
                  setAbb(e.target.value)
                }
                className="glowInput"
              />
            </div>

            {/* HOUSE */}
            <div>
              <label className="text-sm block mb-2">
                Do You Have Own House:
              </label>

              <div className="flex gap-6">

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="houseType"
                    checked={houseType === "Own"}
                    onChange={() => setHouseType("Own")}
                    className="radio radio-success"
                  />
                  Yes
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="houseType"
                    checked={houseType === "Rent"}
                    onChange={() => setHouseType("Rent")}
                    className="radio radio-success"
                  />
                  No
                </label>

              </div>
            </div>

            {/* BANK STATEMENT */}
            <div>
              <label className="text-sm block mb-2">
                6 Months Bank Statement:
              </label>

              <label className="btn btn-sm bg-[#d4ffb2] text-black border-none hover:bg-[#caff66] cursor-pointer">
                Upload

                <input
                  type="file"
                  onChange={uploadFile}
                  className="hidden"
                />
              </label>

              {bankStatement && (
                <span className="ml-3 text-xs text-gray-400">
                  {bankStatement.name}
                </span>
              )}
            </div>

            {/* CHECK BUTTON */}
            <button
              type="button"
              onClick={checkEligibility}
              className="
                w-full
                mt-4
                bg-[#b4ff4e]
                text-black
                font-semibold
                py-3
                rounded-md
                hover:bg-[#caff66]
                shadow-[0_0_20px_#b4ff4e90]
                transition
              "
            >
              Check Eligibility
            </button>

          </div>


          {/* RIGHT SUMMARY */}
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
              backdrop-blur-xl
            "
          >

            <img
              src="/websiteimages/eligibility/business_loan.png"
              alt="Business Loan"
              className="w-full h-56 object-cover opacity-95"
            />

            <div className="p-6">

              <h2 className="text-lg font-semibold text-[#c8ff74] mb-6 text-center">
                Business Loan Summary
              </h2>

              <div className="space-y-2 text-sm">

                <p>
                  <span className="labelText">Company:</span>{" "}
                  {company || "-"}
                </p>

                <p>
                  <span className="labelText">Vintage:</span>{" "}
                  {vintage || "-"}
                </p>

                <p>
                  <span className="labelText">Credit Score:</span>{" "}
                  {creditScore || "-"}
                </p>

                <p>
                  <span className="labelText">
                    Monthly Obligation:
                  </span>{" "}
                  {monthlyObligation || "-"}
                </p>

                <p>
                  <span className="labelText">House Type:</span>{" "}
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


        {/* OFFERS */}
        {hasChecked && (
          offers.length > 0 ? (

            <div className="mt-8 rounded-2xl overflow-hidden border border-[#3a542e]/40">

              {/* HEADER */}
              <div
                className="
                  bg-gradient-to-r
                  from-[#b4ff4e]
                  to-[#8fdc2c]
                  text-black
                  font-semibold
                  p-3
                  flex
                  justify-between
                "
              >
                <span>Bank Offers</span>
                <span>
                  ({offers.length} results found)
                </span>
              </div>

              {/* TABLE */}
              <div className="bg-[#0b1708]/80 overflow-x-auto">

                <table className="w-full text-sm text-left">

                  <thead className="text-[#c8ff74] border-b border-[#3a542e]">
                    <tr>
                      <th className="p-3">Bank</th>
                      <th className="p-3">Loan Amount</th>
                      <th className="p-3">Interest</th>
                      <th className="p-3">Tenure</th>
                      <th className="p-3">Processing Fee</th>
                      <th className="p-3">EMI</th>
                    </tr>
                  </thead>

                  <tbody>

                    {offers.map((o, i) => (
                      <tr
                        key={i}
                        className="
                          border-b
                          border-[#1f2e1a]
                          hover:bg-[#11210d]
                          transition
                        "
                      >

                        <td className="p-3 font-semibold text-[#d4ffb2]">
                          {i === 0 && "✔ "}
                          {o.lender}
                        </td>

                        <td className="p-3">
                          ₹ {o.loanAmount.toLocaleString()}
                        </td>

                        <td className="p-3">
                          {o.interest}%
                        </td>

                        <td className="p-3">
                          {o.tenure * 12}m
                        </td>

                        <td className="p-3">
                          ₹ {o.processingFee.toLocaleString()} (2%)
                        </td>

                        <td className="p-3">
                          ₹ {o.emi.toLocaleString()}
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>


              {/* APPLY BUTTON */}
              <div className="flex justify-center py-5 bg-[#0b1708]/80">

                <button
                  type="button"
                  onClick={() => navigate("/apply-now")}
                  className="
                    btn
                    bg-[#BAEA29]
                    text-black
                    border-none
                    font-semibold
                    px-10
                    py-4
                    text-base
                    sm:text-xl
                    hover:bg-[#a6d833]
                  "
                >
                  Apply Now
                </button>

              </div>

            </div>

          ) : (

            /* NO OFFERS */
            <div
              className="
                mt-8
                rounded-2xl
                border
                border-[#3a542e]/40
                p-8
                text-center
                bg-[#0b1708]/80
              "
            >

              <h2 className="text-lg font-semibold text-[#c8ff74] mb-4">
                No Offers Available
              </h2>

              <p className="text-sm text-[#d4ffb2]/80 mb-6">
                Based on the provided details, we couldn't find a
                matching loan offer. However, don't worry — your
                profile can still be reviewed manually by our team.
              </p>

              <p className="text-xs text-gray-400 mb-6">
                💡 Many applications get approved after manual
                verification and bank-level checks.
              </p>

              <button
                type="button"
                onClick={() => navigate("/apply-now")}
                className="
                  btn
                  bg-[#BAEA29]
                  text-black
                  border-none
                  font-semibold
                  px-10
                  py-4
                  hover:bg-[#a6d833]
                "
              >
                Apply for Manual Review
              </button>

            </div>
          )
        )}

      </div>
    </div>
  );
}