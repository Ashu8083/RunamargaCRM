import { useState } from "react";

export default function HomeLoan() {
  const [activeTab, setActiveTab] = useState("self");

  // Salaried
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");
  const [pincode, setPincode] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [emi, setEmi] = useState("");
  const [houseType, setHouseType] = useState("Own");

  // Self employed
  const [businessNature, setBusinessNature] = useState("");
  const [businessVintage, setBusinessVintage] = useState("");
  const [businessEmi, setBusinessEmi] = useState("");
  const [businessCredit, setBusinessCredit] = useState("");
  const [bankStatement, setBankStatement] = useState(null);

  function uploadFile(e) {
    setBankStatement(e.target.files[0]);
  }

  function checkEligibility() {
    console.log("Checking Eligibility...");
  }

  return (
    <div className="flex justify-center py-12 px-6 text-[#d4ffb2]">

      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT PANEL */}
        <div className="p-2">

          {/* TAB SWITCH */}
          <div
            role="tablist"
            className="
              tabs
              tabs-box
              bg-[#1a2a13]
              rounded-lg
              overflow-hidden
              mb-6
              border
              border-[#3a542e]/40
              p-1
            "
          >

            <button
              type="button"
              role="tab"
              onClick={() => setActiveTab("salaried")}
              className={`
                tab
                flex-1
                font-semibold
                transition-all

                ${
                  activeTab === "salaried"
                    ? "bg-[#d4ffb2] text-black rounded-md"
                    : "text-[#6d8f5a]"
                }
              `}
            >
              Salaried
            </button>

            <button
              type="button"
              role="tab"
              onClick={() => setActiveTab("self")}
              className={`
                tab
                flex-1
                font-semibold
                transition-all

                ${
                  activeTab === "self"
                    ? "bg-[#d4ffb2] text-black rounded-md"
                    : "text-[#6d8f5a]"
                }
              `}
            >
              Self Employed
            </button>

          </div>


          {/* SALARIED FORM */}
          {activeTab === "salaried" && (
            <div className="space-y-5">

              <div>
                <label className="text-sm block mb-1">
                  Present Company Name:
                </label>

                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="glowInput"
                />
              </div>

              <div>
                <label className="text-sm block mb-1">
                  Net Take-Home Salary:
                </label>

                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="glowInput"
                />
              </div>

              <div>
                <label className="text-sm block mb-1">
                  Residential Pin Code:
                </label>

                <input
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="glowInput"
                />
              </div>

              <div>
                <label className="text-sm block mb-1">
                  Credit Score (Approx):
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

              <div>
                <label className="text-sm block mb-1">
                  Current Monthly EMI:
                </label>

                <input
                  type="number"
                  value={emi}
                  onChange={(e) => setEmi(e.target.value)}
                  className="glowInput"
                />
              </div>

              {/* HOUSE TYPE */}
              <div>

                <label className="text-sm block mb-2">
                  House Type:
                </label>

                <div className="flex gap-6">

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="salariedHouseType"
                      checked={houseType === "Own"}
                      onChange={() => setHouseType("Own")}
                      className="radio radio-success"
                    />
                    Own
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="salariedHouseType"
                      checked={houseType === "Rent"}
                      onChange={() => setHouseType("Rent")}
                      className="radio radio-success"
                    />
                    Rent
                  </label>

                </div>

              </div>

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
          )}


          {/* SELF EMPLOYED FORM */}
          {activeTab === "self" && (
            <div className="space-y-6">

              <div>
                <label className="text-sm block mb-1">
                  Nature Of Business:
                </label>

                <input
                  value={businessNature}
                  onChange={(e) =>
                    setBusinessNature(e.target.value)
                  }
                  className="glowInput"
                />
              </div>

              <div>
                <label className="text-sm block mb-1">
                  Vintage{" "}
                  <span className="italic text-[#a8ff6a]">
                    (Registered date of your Business)
                  </span>
                  :
                </label>

                <input
                  type="date"
                  value={businessVintage}
                  onChange={(e) =>
                    setBusinessVintage(e.target.value)
                  }
                  className="glowInput !pr-10"
                />
              </div>

              <div>
                <label className="text-sm block mb-1">
                  Present Monthly EMI Amount:
                </label>

                <input
                  type="number"
                  value={businessEmi}
                  onChange={(e) =>
                    setBusinessEmi(e.target.value)
                  }
                  className="glowInput"
                />
              </div>

              <div>
                <label className="text-sm block mb-1">
                  Approximate Credit Score:
                </label>

                <input
                  type="number"
                  value={businessCredit}
                  onChange={(e) =>
                    setBusinessCredit(e.target.value)
                  }
                  className="glowInput"
                />
              </div>

              {/* BANK STATEMENT */}
              <div>

                <label className="text-sm block mb-2">
                  6 months Bank Statement:
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

              <button
                type="button"
                onClick={checkEligibility}
                className="
                  w-full
                  bg-[#b4ff4e]
                  text-black
                  font-semibold
                  py-3
                  rounded-md
                  hover:bg-[#caff66]
                  shadow-[0_0_20px_#b4ff4e90]
                "
              >
                Check Eligibility
              </button>

            </div>
          )}

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
            src="/websiteimages/eligibility/home_loan.png"
            alt="Home Loan"
            className="w-full h-56 object-cover opacity-95"
          />

          <div className="p-6">

            <h2 className="text-lg font-semibold text-[#c8ff74] mb-6">
              Home Loan Summary
            </h2>

            <div className="space-y-2 text-sm">

              {activeTab === "salaried" && (
                <>
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
                </>
              )}

              {activeTab === "self" && (
                <>
                  <p>
                    <span className="labelText">Business:</span>{" "}
                    {businessNature || "-"}
                  </p>

                  <p>
                    <span className="labelText">Vintage:</span>{" "}
                    {businessVintage || "-"}
                  </p>

                  <p>
                    <span className="labelText">
                      Credit Score:
                    </span>{" "}
                    {businessCredit || "-"}
                  </p>

                  <p>
                    <span className="labelText">
                      Monthly EMI:
                    </span>{" "}
                    {businessEmi || "-"}
                  </p>
                </>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}