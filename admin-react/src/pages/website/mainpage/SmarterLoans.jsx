import React from "react";

export default function SmarterLoans() {
    const capabilities = [
        {
            icon: "🎙",
            title: "Voice Intelligence",
            text: "Understand natural speech and respond through real-time voice conversations.",
        },
        {
            icon: "🧠",
            title: "Context Awareness",
            text: "Track what has been discussed, what is already known, and what needs to happen next.",
        },
        {
            icon: "▣",
            title: "Information Extraction",
            text: "Turn unstructured conversations into structured information that systems can use.",
        },
        {
            icon: "⌘",
            title: "Workflow Intelligence",
            text: "Connect conversations with policies, workflows and enterprise systems.",
        },
    ];

    return (
        <section
            className="
                relative
                overflow-hidden
                py-36
                md:py-52
                bg-[linear-gradient(180deg,#050900_0%,#0A1204_50%,#050900_100%)]
                text-white
            "
        >
            {/* Background glow */}
            <div
                className="
                    absolute
                    top-[35%]
                    left-1/2
                    -translate-x-1/2
                    -translate-y-1/2
                    w-[300px]
                    h-[300px]
                    md:w-[600px]
                    md:h-[600px]
                    rounded-full
                    bg-[radial-gradient(circle,rgba(186,234,41,0.12)_0%,transparent_70%)]
                    blur-[30px]
                    pointer-events-none
                "
            />

            <div
                className="
                    container
                    mx-auto
                    max-w-6xl
                    relative
                    z-[1]
                "
            >

                {/* HEADER */}
                <div
                    className="
                        text-center
                        max-w-[800px]
                        mx-auto
                        mb-7
                        md:mb-9
                    "
                >
                    <div
                        className="
                            inline-block
                            px-2
                            py-[3px]
                            mb-2.5
                            rounded-full
                            border
                            border-[rgba(186,234,41,0.25)]
                            bg-[rgba(186,234,41,0.05)]
                            text-[#BAEA29]
                            text-[12px]
                            font-semibold
                            tracking-[1.5px]
                            uppercase
                        "
                    >
                        Conversational AI Infrastructure
                    </div>

                    <h2
                        className="
                            text-[36px]
                            sm:text-[46px]
                            md:text-[58px]
                            font-bold
                            leading-[1.12]
                            tracking-[-1.5px]
                        "
                    >
                        Make Every{" "}
                        <span className="text-[#BAEA29]">
                            Conversation
                        </span>{" "}
                        Intelligent
                    </h2>

                    <p
                        className="
                            mt-2.5
                            text-[rgba(255,255,255,0.65)]
                            text-[15px]
                            md:text-[18px]
                            leading-[1.7]
                        "
                    >
                        Runamarga brings together voice, context,
                        intelligence and workflows to transform
                        natural conversations into meaningful actions.
                    </p>
                </div>

                {/* MAIN FLOW */}
                <div
                    className="
                        flex
                        justify-center
                        items-center
                        flex-wrap
                        gap-1.5
                        md:gap-2
                        mb-7
                        md:mb-9
                    "
                >
                    {[
                        "Customer Voice",
                        "Understand",
                        "Extract",
                        "Act",
                    ].map((item, index) => (
                        <React.Fragment key={item}>
                            <div
                                className="
                                    px-[8.8px]
                                    md:px-3
                                    py-1.5
                                    rounded-[12px]
                                    border
                                    border-[rgba(186,234,41,0.18)]
                                    bg-[rgba(255,255,255,0.035)]
                                    shadow-[0_10px_40px_rgba(0,0,0,0.15)]
                                "
                            >
                                <span
                                    className="
                                        text-[13px]
                                        md:text-[15px]
                                        font-semibold
                                        whitespace-nowrap
                                    "
                                >
                                    {item}
                                </span>
                            </div>

                            {index < 3 && (
                                <span
                                    className="
                                        hidden
                                        sm:block
                                        text-[#BAEA29]
                                        text-[20px]
                                    "
                                >
                                    →
                                </span>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* CAPABILITY CARDS */}
                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        md:grid-cols-4
                        gap-2.5
                    "
                >
                    {capabilities.map((item) => (
                        <div
                            key={item.title}
                            className="
                                h-full
                                p-3
                                rounded-[20px]
                                border
                                border-[rgba(255,255,255,0.08)]
                                bg-[rgba(255,255,255,0.025)]
                                transition-all
                                duration-300
                                hover:-translate-y-1.5
                                hover:border-[rgba(186,234,41,0.35)]
                                hover:bg-[rgba(186,234,41,0.045)]
                                hover:shadow-[0_15px_45px_rgba(0,0,0,0.25)]
                            "
                        >
                            {/* ICON */}
                            <div
                                className="
                                    w-[50px]
                                    h-[50px]
                                    rounded-[14px]
                                    flex
                                    items-center
                                    justify-center
                                    mb-2.5
                                    text-[#BAEA29]
                                    bg-[rgba(186,234,41,0.08)]
                                    border
                                    border-[rgba(186,234,41,0.15)]
                                    text-[26px]
                                "
                            >
                                {item.icon}
                            </div>

                            <h3
                                className="
                                    text-[18px]
                                    font-semibold
                                    mb-1.2
                                "
                            >
                                {item.title}
                            </h3>

                            <p
                                className="
                                    text-[14px]
                                    leading-[1.7]
                                    text-[rgba(255,255,255,0.58)]
                                "
                            >
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* BOTTOM STATEMENT */}
                <div
                    className="
                        mt-6
                        md:mt-8
                        pt-4
                        border-t
                        border-[rgba(255,255,255,0.08)]
                        text-center
                    "
                >
                    <p
                        className="
                            text-[16px]
                            md:text-[20px]
                            font-medium
                        "
                    >
                        From{" "}
                        <span className="text-[#BAEA29]">
                            voice
                        </span>{" "}
                        to{" "}
                        <span className="text-[#BAEA29]">
                            intelligence
                        </span>{" "}
                        to{" "}
                        <span className="text-[#BAEA29]">
                            action
                        </span>
                        .
                    </p>
                </div>

            </div>
        </section>
    );
}