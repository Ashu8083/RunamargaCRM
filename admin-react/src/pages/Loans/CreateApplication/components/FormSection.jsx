import React from "react";
import DynamicField from "./DynamicField";

function FormSection({
    section,
    formData,
    onFieldChange,
}) {
    if (!section || !section.fields) {
        return null;
    }

    return (
        <div className="card bg-base-100 shadow-md mb-5">

            <div className="card-body">

                {/* Section Header */}
                <div className="mb-4">

                    <h2 className="card-title text-base font-semibold">
                        {section.title}
                    </h2>

                    {section.description && (
                        <p className="text-sm text-base-content/60 mt-1">
                            {section.description}
                        </p>
                    )}

                </div>


                {/* Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    {section.fields.map((field) => (

                        <div
                            key={field.name}
                            className={
                                field.fullWidth
                                    ? "md:col-span-2 lg:col-span-3"
                                    : ""
                            }
                        >

                            <DynamicField
                                field={field}
                                value={formData[field.name]}
                                onChange={onFieldChange}
                            />

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}

export default FormSection;