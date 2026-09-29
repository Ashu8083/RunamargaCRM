export default function ProcessFlow() {
    const steps = [
        {
            number: "01",
            title: "Customer Voice",
            description:
                "The customer speaks naturally in their preferred language.",
        },
        {
            number: "02",
            title: "STT",
            subtitle: "Speech-to-Text",
            description:
                "Converts the customer's voice into text in real time.",
        },
        {
            number: "03",
            title: "Conversation Manager",
            description:
                "Understands the conversation, tracks context and decides what to ask next.",
        },
        {
            number: "04",
            title: "Financial Extraction",
            description:
                "Extracts relevant financial information from the conversation.",
        },
        {
            number: "05",
            title: "Policy & Workflow",
            description:
                "Uses the collected information to move the customer through the appropriate workflow.",
        },
        {
            number: "06",
            title: "TTS",
            subtitle: "Text-to-Speech",
            description:
                "Converts the AI's response back into natural speech.",
        },
    ];

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
                        md:mb-8
                    "
                >
                    <h2
                        className="
                            text-[32px]
                            sm:text-[42px]
                            md:text-[52px]
                            font-bold
                            leading-[1.2]
                        "
                    >
                        From Voice to{" "}
                        <span className="text-[#BAEA29]">
                            Intelligence
                        </span>{" "}
                        to Action
                    </h2>

                    <p
                        className="
                            mt-2
                            max-w-[720px]
                            mx-auto
                            text-[rgba(255,255,255,0.68)]
                            text-[15px]
                            md:text-[17px]
                            leading-[1.6]
                        "
                    >
                        Our AI transforms natural customer conversations
                        into structured information and actionable
                        financial workflows.
                    </p>
                </div>

                {/* FLOW */}
                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-3
                        gap-2
                        md:gap-3
                    "
                >
                    {steps.map((step, index) => (
                        <div
                            key={step.number}
                            className="
                                relative
                                p-3
                                md:p-[14px]
                                min-h-[190px]
                                rounded-[18px]
                                bg-[linear-gradient(145deg,#151D0E,#0D1408)]
                                border
                                border-[rgba(186,234,41,0.12)]
                                transition-all
                                duration-300
                                hover:border-[rgba(186,234,41,0.45)]
                                hover:-translate-y-1
                            "
                        >
                            {/* NUMBER */}
                            <p
                                className="
                                    text-[#BAEA29]
                                    text-[13px]
                                    font-bold
                                    tracking-[1px]
                                    mb-2
                                "
                            >
                                {step.number}
                            </p>

                            {/* TITLE */}
                            <h3
                                className="
                                    text-[20px]
                                    md:text-[22px]
                                    font-semibold
                                    leading-[1.3]
                                "
                            >
                                {step.title}
                            </h3>

                            {/* SUBTITLE */}
                            {step.subtitle && (
                                <p
                                    className="
                                        text-[#BAEA29]
                                        text-[13px]
                                        font-medium
                                        mt-0.5
                                    "
                                >
                                    {step.subtitle}
                                </p>
                            )}

                            {/* DESCRIPTION */}
                            <p
                                className="
                                    mt-1.5
                                    text-[rgba(255,255,255,0.65)]
                                    text-[14px]
                                    leading-[1.6]
                                "
                            >
                                {step.description}
                            </p>

                            {/* DESKTOP ARROW */}
                            {index < steps.length - 1 && (
                                <span
                                    className="
                                        hidden
                                        md:block
                                        absolute
                                        right-[-22px]
                                        top-1/2
                                        -translate-y-1/2
                                        text-[#BAEA29]
                                        text-[26px]
                                        z-[2]
                                    "
                                >
                                    →
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* INTEGRATIONS */}
                <div
                    className="
                        mt-5
                        md:mt-7
                        text-center
                    "
                >
                    <p
                        className="
                            text-[rgba(255,255,255,0.5)]
                            text-[13px]
                            mb-1
                        "
                    >
                        CONNECTED TO
                    </p>

                    <p
                        className="
                            text-[rgba(255,255,255,0.8)]
                            text-[14px]
                            md:text-[16px]
                            font-medium
                        "
                    >
                        CRM &nbsp; • &nbsp; LMS &nbsp; • &nbsp;
                        Enterprise Systems
                    </p>
                </div>

            </div>
        </section>
    );
}