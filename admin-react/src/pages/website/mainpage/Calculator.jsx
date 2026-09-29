import {
    ChatBubbleLeftRightIcon,
    MicrophoneIcon,
    CpuChipIcon,
    CircleStackIcon,
    AdjustmentsHorizontalIcon,
    ShareIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function SmarterLoans() {
    const features = [
        {
            icon: ChatBubbleLeftRightIcon,
            title: "Multilingual",
            text: "Designed for conversations across languages and regional speech patterns.",
        },
        {
            icon: MicrophoneIcon ,
            title: "Code-Switching",
            text: "Built to handle natural conversations where languages change mid-sentence.",
        },
        {
            icon: CpuChipIcon ,
            title: "Conversation Memory",
            text: "Maintains context throughout the interaction instead of treating every response separately.",
        },
        {
            icon: CircleStackIcon ,
            title: "Structured Intelligence",
            text: "Turns conversational information into structured data that downstream systems can use.",
        },
        {
            icon: AdjustmentsHorizontalIcon ,
            title: "Policy-Aware",
            text: "Workflows can be configured around different products, policies and business requirements.",
        },
        {
            icon: ShareIcon ,
            title: "Enterprise Ready",
            text: "Designed to connect with existing CRM, LMS and enterprise systems.",
        },
    ];

    return (
        <section
            className="
                relative
                overflow-hidden
                py-36
                md:py-52
                bg-[#050900]
                text-white
            "
        >
            {/* Subtle glow */}
            <div
                className="
                    absolute
                    w-[500px]
                    h-[500px]
                    top-[10%]
                    right-[-180px]
                    rounded-full
                    bg-[radial-gradient(circle,rgba(186,234,41,0.08),transparent_70%)]
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
                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-12
                        gap-y-6
                        md:gap-y-9
                        items-center
                    "
                >
                    {/* LEFT */}
                    <div className="md:col-span-5">

                        <p
                            className="
                                text-[#BAEA29]
                                text-[13px]
                                font-semibold
                                tracking-[2px]
                                uppercase
                                mb-2.5
                            "
                        >
                            Built for the real world
                        </p>

                        <h2
                            className="
                                text-[38px]
                                sm:text-[46px]
                                md:text-[55px]
                                font-bold
                                leading-[1.12]
                                tracking-[-1.5px]
                            "
                        >
                            Conversations
                            <br />

                            <span className="text-[#BAEA29]">
                                aren't scripted.
                            </span>
                        </h2>

                        <p
                            className="
                                mt-3
                                max-w-[480px]
                                text-[rgba(255,255,255,0.62)]
                                text-[17px]
                                leading-[1.8]
                            "
                        >
                            Customers don't always speak in
                            perfect sentences or follow a fixed
                            flow. Runamarga is designed to work
                            with the way people actually
                            communicate.
                        </p>

                        {/* Highlight */}
                        <div
                            className="
                                mt-4
                                pl-3
                                border-l-2
                                border-[#BAEA29]
                            "
                        >
                            <p
                                className="
                                    text-[16px]
                                    leading-[1.7]
                                    text-[rgba(255,255,255,0.78)]
                                    font-medium
                                "
                            >
                                "The goal isn't just to make AI
                                talk. It's to make AI understand
                                the conversation."
                            </p>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="md:col-span-7">
                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                gap-2
                            "
                        >
                            {features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="
                                        h-full
                                        p-3
                                        rounded-[18px]
                                        bg-[rgba(255,255,255,0.025)]
                                        border
                                        border-[rgba(255,255,255,0.08)]
                                        transition-all
                                        duration-300
                                        hover:-translate-y-[5px]
                                        hover:bg-[rgba(186,234,41,0.045)]
                                        hover:border-[rgba(186,234,41,0.30)]
                                    "
                                >
                                    {/* ICON */}
                                    <div
                                        className="
                                            w-12
                                            h-12
                                            flex
                                            items-center
                                            justify-center
                                            rounded-[14px]
                                            mb-2.5
                                            text-[#BAEA29]
                                            bg-[rgba(186,234,41,0.08)]
                                            border
                                            border-[rgba(186,234,41,0.12)]
                                        "
                                    >
                                        <feature.icon className="w-[25px] h-[25px]" />
                                    </div>

                                    <h3
                                        className="
                                            text-[18px]
                                            font-semibold
                                            mb-1
                                        "
                                    >
                                        {feature.title}
                                    </h3>

                                    <p
                                        className="
                                            text-[13.5px]
                                            leading-[1.7]
                                            text-[rgba(255,255,255,0.55)]
                                        "
                                    >
                                        {feature.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* BOTTOM LINE */}
                <div
                    className="
                        mt-7
                        md:mt-10
                        pt-4
                        border-t
                        border-[rgba(255,255,255,0.08)]
                        flex
                        justify-center
                        md:justify-between
                        items-center
                        flex-wrap
                        gap-2
                    "
                >
                    <p
                        className="
                            text-[rgba(255,255,255,0.45)]
                            text-[14px]
                        "
                    >
                        Voice • Context • Intelligence • Workflows
                    </p>

                    <p
                        className="
                            text-[#BAEA29]
                            text-[14px]
                            font-semibold
                        "
                    >
                        Built for financial services
                    </p>
                </div>
            </div>
        </section>
    );
}