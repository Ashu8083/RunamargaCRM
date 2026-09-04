import React from "react";

function DynamicField({
    field,
    value,
    onChange,
}) {

    const handleChange = (event) => {
        onChange(field.name, event.target.value);
    };


    // TEXTAREA
    if (field.type === "textarea") {
        return (
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">
                        {field.label}

                        {field.required && (
                            <span className="text-error ml-1">
                                *
                            </span>
                        )}
                    </span>
                </label>

                <textarea
                    className="textarea textarea-bordered w-full"
                    name={field.name}
                    value={value || ""}
                    placeholder={field.placeholder || ""}
                    onChange={handleChange}
                    rows={3}
                />
            </div>
        );
    }


    // SELECT
    if (field.type === "select") {
        return (
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">
                        {field.label}

                        {field.required && (
                            <span className="text-error ml-1">
                                *
                            </span>
                        )}
                    </span>
                </label>

                <select
                    className="select select-bordered w-full"
                    name={field.name}
                    value={value || ""}
                    onChange={handleChange}
                >
                    <option value="">
                        Select {field.label}
                    </option>

                    {(field.options || []).map((option) => (
                        <option
                            key={option.value || option}
                            value={option.value || option}
                        >
                            {option.label || option}
                        </option>
                    ))}
                </select>
            </div>
        );
    }


    // RADIO
    if (field.type === "radio") {
        return (
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">
                        {field.label}

                        {field.required && (
                            <span className="text-error ml-1">
                                *
                            </span>
                        )}
                    </span>
                </label>

                <div className="flex flex-wrap gap-4">
                    {(field.options || []).map((option) => {

                        const optionValue =
                            option.value || option;

                        const optionLabel =
                            option.label || option;

                        return (
                            <label
                                key={optionValue}
                                className="label cursor-pointer justify-start gap-2"
                            >
                                <input
                                    type="radio"
                                    className="radio radio-primary radio-sm"
                                    name={field.name}
                                    value={optionValue}
                                    checked={
                                        value === optionValue
                                    }
                                    onChange={handleChange}
                                />

                                <span className="label-text">
                                    {optionLabel}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>
        );
    }


    // CURRENCY
    if (field.type === "currency") {
        return (
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">
                        {field.label}

                        {field.required && (
                            <span className="text-error ml-1">
                                *
                            </span>
                        )}
                    </span>
                </label>

                <label className="input input-bordered flex items-center gap-2 w-full">
                    <span className="text-base-content/60">
                        ₹
                    </span>

                    <input
                        type="number"
                        className="grow"
                        name={field.name}
                        value={value || ""}
                        placeholder={field.placeholder || ""}
                        onChange={handleChange}
                    />
                </label>
            </div>
        );
    }


    // DEFAULT INPUT
    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text">
                    {field.label}

                    {field.required && (
                        <span className="text-error ml-1">
                            *
                        </span>
                    )}
                </span>
            </label>

            <input
                type={field.type || "text"}
                className="input input-bordered w-full"
                name={field.name}
                value={value || ""}
                placeholder={field.placeholder || ""}
                onChange={handleChange}
            />
        </div>
    );
}

export default DynamicField;