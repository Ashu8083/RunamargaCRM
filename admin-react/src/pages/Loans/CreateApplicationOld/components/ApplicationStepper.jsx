import React from "react";

function ApplicationStepper({ currentStep }) {

    const steps = [
        {
            number: 1,
            label: "Select Loan Type",
        },
        {
            number: 2,
            label: "Fill Application",
        },
        {
            number: 3,
            label: "Review & Submit",
        },
    ];

    return (

        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm px-10 my-5 py-5">

            <div className="flex items-center">

                {steps.map((step, index) => {

                    const isCompleted =
                        step.number < currentStep;

                    const isCurrent =
                        step.number === currentStep;

                    const isActive =
                        isCompleted || isCurrent;

                    return (

                        <React.Fragment key={step.number}>

                            {/* STEP */}

                            <div className="flex flex-col items-center min-w-fit">

                                <div
                                    className={`
                                        w-8
                                        h-8
                                        rounded-full
                                        flex
                                        items-center
                                        justify-center
                                        text-sm
                                        font-semibold
                                        transition-colors
                                        ${
                                            isActive
                                                ? "text-white"
                                                : "bg-base-300 text-base-content/60"
                                        }
                                    `}
                                    style={
                                        isActive
                                            ? {
                                                backgroundColor:
                                                    "rgb(143, 212, 0)",
                                            }
                                            : {}
                                    }
                                >

                                    {isCompleted
                                        ? "✓"
                                        : step.number
                                    }

                                </div>


                                <span
                                    className={`
                                        mt-2
                                        text-sm
                                        whitespace-nowrap
                                        ${
                                            isActive
                                                ? "font-semibold text-base-content"
                                                : "text-base-content/50"
                                        }
                                    `}
                                >
                                    {step.label}
                                </span>

                            </div>


                            {/* CONNECTING LINE */}

                            {index < steps.length - 1 && (

                                <div
                                    className={`
                                        flex-1
                                        h-px
                                        mx-4
                                        mb-6
                                    `}
                                    style={{
                                        backgroundColor:
                                            step.number < currentStep
                                                ? "rgb(143, 212, 0)"
                                                : "rgb(229, 231, 235)",
                                    }}
                                />

                            )}

                        </React.Fragment>

                    );

                })}

            </div>

        </div>

    );
}

export default ApplicationStepper;