export default function PrivacyPolicy() {
    return (
        <div className="contact-page-wrapper min-h-screen bg-zinc-950 relative overflow-hidden p-5">

            {/* <!-- 🌟 BIG GREEN RADIAL GLOW --> */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] 
                    bg-[radial-gradient(circle,rgba(154,255,46,0.35),transparent_70%)] 
                    blur-[140px] opacity-90 rounded-full pointer-events-none z-0">
            </div>
            <div className="container mx-auto px-4 max-w-5xl">

                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 
                    text-[9vw] font-black text-white/5 select-none pointer-events-none 
                    whitespace-nowrap z-0 pt-[20%] lg:pt-[5%]">
                    PRIVACY POLICY
                </div>
                <div className="container mx-auto px-4 pt-[12rem] lg:pt-[20rem] relative z-10">
                    <div className="space-y-8 text-gray-300 leading-relaxed">

                        <p>
                            Runamarga respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, services, or interact with us.
                        </p>
                        <p>By using our website or services, you agree to the collection and use of information in accordance with this policy.</p>

                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Information We Collect
                            </h2>
                            <p>
                                We collect information both directly from you and automatically through your interaction with our site.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Information You Provide
                            </h2>
                            <ul className="list-disc pl-6 space-y-2"><li>Name, email address, phone number, postal address</li>
                                <li>Financial information (e.g., bank account number, loan application data)</li>
                                <li>Documents you submit (e.g., identity proofs, income proofs)</li>
                                <li>Login credentials & account information</li>
                                <li>Communication content (emails, support tickets, chat messages)</li></ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Usage and Technical Information (Automatically Collected)
                            </h2>
                            <ul><li>IP address, browser type & version, device type, OS</li>
                                <li>Visited pages, timestamps, clicks, referring URLs</li>
                                <li>Cookies, tracking pixels, user-agent strings</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Purposes of Processing / Use of Information
                            </h2>
                            <ul className="list-disc pl-6 space-y-2" ><li>Providing, operating, and maintaining our services</li>
                                <li>Verifying your identity and eligibility</li>
                                <li>Processing financial or loan applications</li>
                                <li>Communicating updates, notifications, and support</li>
                                <li>Marketing and promotional communications (with consent)</li>
                                <li>Fraud detection, compliance, and security</li>
                                <li>Analytics and performance improvement</li>
                                <li>Legal and regulatory obligations</li>


                            </ul>
                        </div>
                        {/* LEGAL BASIS */}
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Legal Basis for Processing
                            </h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Your consent</li>
                                <li>Performance of a contract</li>
                                <li>Legal obligation</li>
                                <li>Legitimate interests (e.g., service improvement, fraud prevention)</li>
                            </ul>
                        </div>

                        {/* DATA SHARING */}
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Disclosure of Information / Sharing
                            </h2>

                            <p className="mb-3">
                                We may share your data with:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>Service providers (e.g., analytics, payment gateways, KYC verification)</li>
                                <li>Banks, financial institutions, and lending partners</li>
                                <li>Law enforcement or regulators when required by law</li>
                                <li>Affiliates, subsidiaries, or successors (e.g., in mergers or acquisitions)</li>
                            </ul>

                            <p className="mt-3">
                                All third parties are contractually obligated to maintain confidentiality
                                and safeguard your data.
                            </p>
                        </div>

                        {/* DATA STORAGE */}
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Data Storage & Retention
                            </h2>

                            <p>
                                We retain your data only as long as necessary or as required by law.
                                Once no longer needed, data is securely deleted or anonymized.
                                Data may be stored on servers located in India or other jurisdictions
                                with appropriate safeguards.
                            </p>
                        </div>

                        {/* SECURITY */}
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Security
                            </h2>

                            <p>
                                We use appropriate technical, administrative, and physical measures to
                                protect data. However, no system is completely secure, and we cannot
                                guarantee absolute protection.
                            </p>
                        </div>

                        {/* COOKIES */}
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Cookies & Tracking
                            </h2>

                            <p>
                                We use cookies and similar technologies to enhance user experience,
                                remember preferences, and analyze trends. You can disable cookies in
                                your browser, but some features may not function properly.
                            </p>
                        </div>

                        {/* USER RIGHTS */}
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Your Rights
                            </h2>

                            <p className="mb-3">
                                You may have the right to:
                            </p>

                            <ul className="list-disc pl-6 space-y-2">
                                <li>Access, correct, or update your data</li>
                                <li>Request deletion (“Right to be forgotten”)</li>
                                <li>Restrict or object to processing</li>
                                <li>Request data portability</li>
                                <li>Withdraw consent (if processing is based on consent)</li>
                            </ul>

                            <p className="mt-3">
                                To exercise these rights, contact us via email. We may verify your
                                identity before acting on your request.
                            </p>
                        </div>

                        {/* CHILDREN */}
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Children
                            </h2>

                            <p>
                                We do not knowingly collect data from minors under 18. If such data
                                is inadvertently collected, we will promptly delete it.
                            </p>
                        </div>

                        {/* POLICY CHANGES */}
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Changes to the Privacy Policy
                            </h2>

                            <p>
                                We may update this Privacy Policy periodically. Material changes will
                                be notified via our website or email. Please review this policy
                                occasionally.
                            </p>
                        </div>

                        {/* CONTACT */}
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Contact Us
                            </h2>

                            <p>Email: runamarga1@gmail.com</p>
                            <p>
                                Postal Address: Kannada Kasturi Rd, near Post Office,
                                Maheshwari Nagar, Dasarahalli, Bengaluru, Karnataka, 560057
                            </p>
                        </div>

                 

                    </div>
                </div>
            </div>
        </div >
    );
}