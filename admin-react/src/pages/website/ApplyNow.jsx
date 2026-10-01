import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config/url";

export default function ApplyNow() {
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [loanTypes, setLoanTypes] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        loan_type_id: "",
        loan_amt: "",
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        fetch(`${API_BASE_URL}/loan-types`)
            .then(res => res.json())
            .then(data => {
                setLoanTypes(data.items);
            })
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(null);

        const form = new FormData();
        Object.keys(formData).forEach(key => {
            form.append(key, formData[key]);
        });

        try {
            const res = await fetch(`${API_BASE_URL}/loan-application/store`, {
                method: "POST",
                body: form,
            });

            const data = await res.json();

            if (data.status === "success") {
                setShowPopup(true);

                // Reset form
                setFormData({
                    name: "",
                    phone: "",
                    loan_type_id: "",
                    loan_amt: "",
                });
            } else {
                setError(data.message);
            }

        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        }
    };

    return (
        <div className="contact-page-wrapper min-h-screen bg-zinc-950 relative overflow-hidden">

            {/* Popup */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
                    <div className="bg-zinc-900 border border-[#BAEA2930] rounded-2xl p-8 w-[90%] max-w-md text-center shadow-2xl">

                        <div className="text-5xl mb-4">✅</div>

                        <h2 className="text-white text-2xl font-bold mb-2">
                            Application Submitted!
                        </h2>

                        <p className="text-gray-300 mb-6">
                            We’ll get back to you shortly.
                        </p>

                        <button
                            onClick={() => setShowPopup(false)}
                            className="px-6 py-2 bg-[#BAEA29] text-black font-semibold rounded-lg hover:bg-[#a5d824]"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] 
                bg-[radial-gradient(circle,rgba(154,255,46,0.35),transparent_70%)] 
                blur-[140px] opacity-90 rounded-full pointer-events-none z-0">
            </div>

            {/* Background Text */}
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 
                text-[9vw] font-black text-white/5 select-none pointer-events-none 
                whitespace-nowrap z-0 pt-[20%] lg:pt-[5%]">
                APPLY NOW
            </div>

            <div className="container mx-auto px-[6%] pt-[12rem] lg:pt-[20rem] relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* LEFT */}
                    {/* <!-- LEFT SIDE CONTACT DETAILS --> */}
                    <div className="text-white space-y-6">

                        <h2 className="text-white text-4xl font-bold">Apply for a Loan Today</h2>
                        <p className="text-gray-300 max-w-sm">
                            Fill out our simple application form and get a decision quickly. We offer competitive rates and flexible terms.
                        </p>

                        <div className="divide-y divide-gray-600 text-gray-300">

                            <p className="flex items-center gap-3 py-3">
                                <i className="fa-solid fa-circle-check text-[#BAEA29] text-lg"></i>
                                Fast approval process
                            </p>

                            <p className="flex items-center gap-3 py-3">
                                <i className="fa-solid fa-circle-check text-[#BAEA29] text-lg"></i>
                                Competitive interest rates
                            </p>

                            <p className="flex items-center gap-3 py-3">
                                <i className="fa-solid fa-circle-check text-[#BAEA29] text-lg"></i>
                                Flexible repayment options
                            </p>

                            <p className="flex items-center gap-3 py-3">
                                <i className="fa-solid fa-circle-check text-[#BAEA29] text-lg"></i>
                                No hidden fees
                            </p>

                            <p className="flex items-center gap-3 py-3">
                                <i className="fa-solid fa-circle-check text-[#BAEA29] text-lg"></i>
                                Dedicated customer support
                            </p>

                            <p className="flex items-center gap-3 py-3">
                                <i className="fa-solid fa-circle-check text-[#BAEA29] text-lg"></i>
                                Secure application process
                            </p>

                        </div>

                    </div>


                    {/* RIGHT FORM */}
                    <div className="p-10 rounded-2xl border border-[#BAEA2915] 
                         bg-cover bg-center bg-no-repeat">

                        {error && (
                            <div className="text-red-400 mb-4">{error}</div>
                        )}

                        <h3 className="text-[#BAEA29] text-2xl font-semibold mb-8">
                            Your Detail
                        </h3>

                        <form className="space-y-8" onSubmit={handleSubmit}>

                            {/* Name + Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    placeholder="Your name"
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b-2 border-[#BAEA2940] text-white py-3 outline-none"
                                />

                                <input
                                    type="number"
                                    name="phone"
                                    value={formData.phone}
                                    placeholder="Phone"
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b-2 border-[#BAEA2940] text-white py-3 outline-none"
                                />
                            </div>

                            {/* Loan Type */}
                            <select
                                name="loan_type_id"
                                value={formData.loan_type_id}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b-2 border-[#BAEA2940] text-white py-3 outline-none"
                            >
                                <option value="">Select Loan Type</option>
                                {loanTypes.map((type) => (
                                    <option key={type.id} value={type.id} className="text-black">
                                        {type.name}
                                    </option>
                                ))}
                            </select>

                            {/* Loan Amount */}
                            <input
                                type="number"
                                name="loan_amt"
                                value={formData.loan_amt}
                                placeholder="Loan Amount"
                                onChange={handleChange}
                                className="w-full bg-transparent border-b-2 border-[#BAEA2940] text-white py-3 outline-none"
                            />

                            <button
                                type="submit"
                                className="w-full py-3 bg-[#BAEA29] text-black rounded-xl font-semibold"
                            >
                                Apply Now
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}