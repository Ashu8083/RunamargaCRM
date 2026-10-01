import { useState } from "react";

export default function PlatformSection() {
    const [activeTab, setActiveTab] = useState("sales");

    const tabs = [
        {
            id: "sales",
            title: "Loan Sales",
            icon: "fa-solid fa-hand-holding-dollar",
        },
        {
            id: "onboarding",
            title: "Onboarding",
            icon: "fa-solid fa-user-check",
        },
        {
            id: "support",
            title: "Customer Support",
            icon: "fa-solid fa-headset",
        },
        {
            id: "status",
            title: "Application Status",
            icon: "fa-solid fa-file-circle-check",
        },
        {
            id: "collections",
            title: "Collections",
            icon: "fa-solid fa-phone-volume",
        }
    ];

    const content = {
        sales: {
            title: "AI-powered conversations for loan sales",
            description:
                "Understand customer requirements, collect the right financial information and perform initial qualification through intelligent voice conversations.",
            points: [
                "Understand customer requirements",
                "Collect financial information",
                "Maintain conversation context",
                "Move qualified customers into the right workflow"
            ]
        },

        onboarding: {
            title: "Simplify customer onboarding",
            description:
                "Guide customers through the information required for onboarding while maintaining context throughout the conversation.",
            points: [
                "Collect required information",
                "Reduce repetitive interactions",
                "Maintain conversation context",
                "Connect with enterprise workflows"
            ]
        },

        support: {
            title: "Intelligent customer support",
            description:
                "Handle routine customer conversations while routing complex cases to human teams.",
            points: [
                "Understand customer intent",
                "Handle repetitive queries",
                "Maintain conversation history",
                "Escalate when human judgement is required"
            ]
        },

        status: {
            title: "Application status conversations",
            description:
                "Help customers get application-related information through natural voice conversations connected to enterprise systems.",
            points: [
                "Understand customer requests",
                "Retrieve relevant information",
                "Respond naturally",
                "Connect with CRM and LMS systems"
            ]
        },

        collections: {
            title: "AI-assisted collections",
            description:
                "Support structured collection conversations while allowing human teams to focus on cases requiring judgement.",
            points: [
                "Automate repetitive conversations",
                "Understand customer responses",
                "Capture relevant information",
                "Route complex cases to teams"
            ]
        }
    };

    const activeContent = content[activeTab];

    return (
        <section
            className="
                bg-[#0A1103]
                text-white
                py-8
                md:py-12
            "
        >

            <div className="container mx-auto max-w-6xl">

                {/* HEADING */}

                <div
                    className="
                        text-center
                        mb-6
                    "
                >
                    <h2
                        className="
                            text-[32px]
                            md:text-[48px]
                            font-bold
                            leading-[1.2]
                        "
                    >
                        One Platform.{" "}
                        <span className="text-[#BAEA29]">
                            Multiple Workflows.
                        </span>
                    </h2>

                    <p
                        className="
                            mt-2
                            text-[rgba(255,255,255,0.7)]
                            max-w-[700px]
                            mx-auto
                            text-[17px]
                            leading-[1.6]
                        "
                    >
                        Intelligent voice conversations designed for
                        the different stages of financial customer
                        interactions.
                    </p>
                </div>

                {/* TABS */}

                <div
                    className="
                        flex
                        justify-center
                        flex-wrap
                        gap-1.5
                        mb-6
                    "
                >
                    {tabs.map((tab) => (
                        <div
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex
                                items-center
                                gap-1
                                px-3
                                py-1.5
                                rounded-full
                                cursor-pointer
                                transition-all
                                duration-300
                                ${
                                    activeTab === tab.id
                                        ? "bg-[#BAEA29] text-black"
                                        : "bg-[#151D0E] text-white"
                                }
                                hover:bg-[#BAEA29]
                                hover:text-black
                            `}
                        >
                            <i className={tab.icon}></i>

                            <span
                                className="
                                    font-semibold
                                    text-[14px]
                                "
                            >
                                {tab.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* CONTENT */}

                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-6
                        items-center
                    "
                >

                    {/* LEFT */}

                    <div>

                        <h3
                            className="
                                text-[28px]
                                md:text-[38px]
                                font-bold
                                leading-[1.25]
                            "
                        >
                            {activeContent.title}
                        </h3>

                        <p
                            className="
                                mt-3
                                text-[rgba(255,255,255,0.7)]
                                text-[17px]
                                leading-[1.7]
                            "
                        >
                            {activeContent.description}
                        </p>

                        <div className="mt-3">
                            {activeContent.points.map((point, index) => (
                                <div
                                    key={index}
                                    className="
                                        flex
                                        items-center
                                        gap-1.5
                                        mb-1.5
                                    "
                                >
                                    <div
                                        className="
                                            w-2
                                            h-2
                                            rounded-full
                                            bg-[#BAEA29]
                                            shrink-0
                                        "
                                    />

                                    <span
                                        className="
                                            text-[rgba(255,255,255,0.85)]
                                        "
                                    >
                                        {point}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* <button
                            type="button"
                            className="
                                btn
                                mt-3
                                px-4
                                py-1.5
                                rounded-lg
                                bg-[#BAEA29]
                                text-black
                                font-semibold
                                normal-case
                                border-0
                                hover:bg-[#a6d833]
                            "
                        >
                            Explore Platform
                        </button> */}

                    </div>

                    {/* RIGHT */}

                    <div>

                        <div
                            className="
                                min-h-[380px]
                                rounded-[24px]
                                bg-[linear-gradient(145deg,#18220D,#0E1408)]
                                border
                                border-[rgba(186,234,41,0.15)]
                                flex
                                items-center
                                justify-center
                                p-4
                            "
                        >

                            <div className="text-center">

                                <p
                                    className="
                                        text-[#BAEA29]
                                        text-[18px]
                                        font-semibold
                                        mb-3
                                    "
                                >
                                    Intelligent Conversation Flow
                                </p>

                                <p
                                    className="
                                        text-[20px]
                                        font-semibold
                                    "
                                >
                                    Customer Voice
                                </p>

                                <p className="my-1">
                                    ↓
                                </p>

                                <p>
                                    Conversation Manager
                                </p>

                                <p className="my-1">
                                    ↓
                                </p>

                                <p>
                                    Financial Extraction
                                </p>

                                <p className="my-1">
                                    ↓
                                </p>

                                <p>
                                    Policy &amp; Workflow
                                </p>

                                <p className="my-1">
                                    ↓
                                </p>

                                <p
                                    className="
                                        text-[#BAEA29]
                                        font-semibold
                                    "
                                >
                                    Enterprise Systems
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}