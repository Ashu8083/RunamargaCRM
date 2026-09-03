// admin-react\src\pages\EmployeeManagement\Employees\components\EmployeeModal.jsx
import { useEffect, useRef, useState } from "react";

import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import CloudArrowUpIcon from "@heroicons/react/24/outline/CloudArrowUpIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { STATIC_BASE_URL } from "../../../../config/url";
// =============================================================
// DEFAULT FORM
// =============================================================

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  alternatePhone: "",
  role_id: "",
  status: "active",
  reports_to_id: "",
  dateOfBirth: "",
  joiningDate: "",
  designation: "",
  shiftType: "",
  currentAddress: "",
  currentCTC: "",
  previousCTC: "",
  bloodGroup: "",
  panCardNo: "",
  aadhaarCardNo: "",
  profileImage: null,
  aadhaarCard: null,
  panCard: null,
  salarySlips: [],
  bankPassbook: null,
  permission_ids: [],
};

// =============================================================
// COMPONENT
// =============================================================
function EmployeeModal({
  open = false,
  employee = null,
  employees = [],
  roles = [],
  permissions = [],
  onClose,
  onSubmit,
}) {
  const isRestrictedRole =
    employee &&
    ["admin", "business"].includes(
      employee.role?.name?.trim().toLowerCase()
    );
  const getFileUrl = (filePath) => {
    if (!filePath) {
      return null;
    }

    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://")
    ) {
      return filePath;
    }

    return `${STATIC_BASE_URL}${filePath}`;
  };
  // =========================================================
  // FORM
  // =========================================================
  const [form, setForm] = useState(INITIAL_FORM);
  const [existingDocuments, setExistingDocuments] = useState({
    profile_image: null,
    aadhar_card: null,
    pan_card: null,
    bank_passbook: null,
    salary_slip: [],
  });
  const [errors, setErrors] = useState({});

  const [saving, setSaving] = useState(false);

  // =========================================================
  // FILE INPUT REFS
  // =========================================================

  const profileImageRef = useRef(null);

  const aadhaarRef = useRef(null);

  const panRef = useRef(null);

  const salarySlipsRef = useRef(null);

  const bankPassbookRef = useRef(null);

  // =========================================================
  // LOAD EMPLOYEE
  // =========================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    if (employee) {
      setForm({
        ...INITIAL_FORM,

        name: employee.name ?? "",
        email: employee.email ?? "",
        phone: employee.phone ?? "",
        alternatePhone: employee.alternate_phone ?? "",

        role_id: employee.role?.id ?? "",
        reports_to_id: employee.reports_to?.id ?? "",
        status: employee.status ?? "active",

        permission_ids: Array.isArray(employee.permission_ids)
          ? employee.permission_ids
          : [],

        dateOfBirth: employee.date_of_birth ?? "",
        joiningDate: employee.joining_date ?? "",
        designation: employee.designation ?? "",
        shiftType: employee.shift_type ?? "",
        currentAddress: employee.address ?? "",
        currentCTC: employee.current_ctc ?? "",
        previousCTC: employee.previous_ctc ?? "",
        bloodGroup: employee.blood_group ?? "",
        panCardNo: employee.pan_no ?? "",
        aadhaarCardNo: employee.aadhar_no ?? "",
      });
      setExistingDocuments({
        profile_image:
          employee.documents?.profile_image ?? null,

        aadhar_card:
          employee.documents?.aadhar_card ?? null,

        pan_card:
          employee.documents?.pan_card ?? null,

        bank_passbook:
          employee.documents?.bank_passbook ?? null,

        salary_slip:
          Array.isArray(employee.documents?.salary_slip)
            ? employee.documents.salary_slip
            : [],
      });
      return;
    }

    // Add Employee
    setForm(INITIAL_FORM);
    setExistingDocuments({
      profile_image: null,
      aadhar_card: null,
      pan_card: null,
      bank_passbook: null,
      salary_slip: [],
    });
  }, [open, employee]);

  // =========================================================
  // UPDATE FIELD
  // =========================================================

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };
  // =========================================================
  // FILE HELPERS
  // =========================================================

  const handleSingleFile = (field, event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    updateField(field, file);
  };

  const handleSalarySlips = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    setForm((previous) => ({
      ...previous,

      salarySlips: [...previous.salarySlips, ...files],
    }));

    event.target.value = "";
  };

  const removeSalarySlip = (index) => {
    setForm((previous) => ({
      ...previous,

      salarySlips: previous.salarySlips.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email address is required";
    }

    if (!form.role_id) {
      nextErrors.role_id =
        "Role is required";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const submitForm = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const employeeData = {
      name: form.name.trim(),
      email: form.email || null,
      phone: form.phone || null,
      alternate_phone: form.alternatePhone || null,

      role_id: Number(form.role_id),
      reports_to_id: form.reports_to_id
        ? Number(form.reports_to_id)
        : null,

      status: form.status,

      date_of_birth: form.dateOfBirth || null,
      joining_date: form.joiningDate || null,
      designation: form.designation || null,
      shift_type: form.shiftType || null,
      address: form.currentAddress || null,

      current_ctc: form.currentCTC || null,
      previous_ctc: form.previousCTC || null,

      blood_group: form.bloodGroup || null,
      pan_no: form.panCardNo || null,
      aadhar_no: form.aadhaarCardNo || null,

      permission_ids: form.permission_ids,
    };

    const formData = new FormData();

    formData.append(
      "data",
      JSON.stringify(employeeData)
    );

    if (form.profileImage) {
      formData.append(
        "profile_image",
        form.profileImage
      );
    }

    if (form.aadhaarCard) {
      formData.append(
        "aadhaar_card",
        form.aadhaarCard
      );
    }

    if (form.panCard) {
      formData.append(
        "pan_card",
        form.panCard
      );
    }

    if (form.bankPassbook) {
      formData.append(
        "bank_passbook",
        form.bankPassbook
      );
    }

    form.salarySlips.forEach((file) => {
      if (file instanceof File) {
        formData.append(
          "salary_slips",
          file
        );
      }
    });

    await onSubmit(formData);
  };

  // =========================================================
  // CLOSE
  // =========================================================

  const handleClose = () => {
    if (saving) {
      return;
    }

    onClose?.();
  };

  // =========================================================
  // CLOSED
  // =========================================================

  if (!open) {
    return null;
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-black/40
                p-3
                sm:p-5
            "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="
                flex
                max-h-[94vh]
                w-full
                max-w-4xl
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-base-300
                bg-base-100
                shadow-2xl
            "
      >
        {/* =================================================
                    HEADER
                ================================================= */}

        <div
          className="
                    flex
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-base-300
                    px-5
                    py-4
                "
        >
          <div>
            <h2
              className="
                            text-base
                            font-semibold
                            text-base-content
                        "
            >
              {employee ? "Edit Employee" : "Add Employee"}
            </h2>

            <p
              className="
                            mt-0.5
                            text-xs
                            text-base-content/50
                        "
            >
              Enter employee information and access permissions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            text-base-content/50
                            transition
                            hover:bg-base-200
                            hover:text-base-content
                        "
            aria-label="Close"
          >
            <XMarkIcon
              className="
                            h-5
                            w-5
                        "
            />
          </button>
        </div>

        {/* =================================================
                    FORM
                ================================================= */}

        <form
          onSubmit={submitForm}
          className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                    "
        >
          <div
            className="
                        space-y-6
                        p-5
                    "
          >
            {/* =============================================
                            BASIC DETAILS
                        ============================================= */}

            <section>
              <div
                className="
                                mb-4
                                flex
                                items-center
                                gap-3
                            "
              >
                <div
                  className="
                                    h-5
                                    w-1
                                    rounded-full
                                    bg-[#8BCF00]
                                "
                />

                <h3
                  className="
                                    text-sm
                                    font-semibold
                                    text-base-content
                                "
                >
                  Basic Details
                </h3>
              </div>

              <div
                className="
                                grid
                                grid-cols-1
                                gap-4
                                md:grid-cols-2
                            "
              >
                {/* NAME */}

                <Field label="Name" required error={errors.name}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Enter employee name"
                    className="
                                            input
                                            input-bordered
                                            h-10
                                            min-h-10
                                            w-full
                                        "
                  />
                </Field>

                {/* EMAIL */}

                <Field label="Email Address" required error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="Enter email address"
                    className="
                                            input
                                            input-bordered
                                            h-10
                                            min-h-10
                                            w-full
                                        "
                  />
                </Field>

                {/* PHONE */}

                <Field label="Phone Number">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    placeholder="Enter phone number"
                    className="
                                            input
                                            input-bordered
                                            h-10
                                            min-h-10
                                            w-full
                                        "
                  />
                </Field>

                {/* ALTERNATE PHONE */}

                <Field label="Alternate Phone">
                  <input
                    type="tel"
                    value={form.alternatePhone}
                    onChange={(event) =>
                      updateField("alternatePhone", event.target.value)
                    }
                    placeholder="Enter alternate phone"
                    className="
                                            input
                                            input-bordered
                                            h-10
                                            min-h-10
                                            w-full
                                        "
                  />
                </Field>

                {/* ROLE */}
                <Field
                  label="Role"
                  required
                  error={errors.role_id}
                >
                  {employee &&
                    ["admin", "business"].includes(
                      employee.role?.name?.toLowerCase()
                    ) ? (
                    <div
                      className="
        flex
        h-10
        items-center
        rounded-lg
        border
        border-base-300
        bg-base-200/40
        px-3
        text-sm
        text-base-content
      "
                    >
                      {employee.role?.name}
                    </div>
                  ) : (
                    <select
                      value={form.role_id}
                      onChange={(event) => {
                        updateField(
                          "role_id",
                          event.target.value
                            ? Number(event.target.value)
                            : ""
                        );
                      }}
                      className="
        select
        select-bordered
        h-10
        min-h-10
        w-full
      "
                    >
                      <option value="">
                        Select role
                      </option>

                      {roles
                        .filter(
                          (role) =>
                            !["admin", "business"].includes(
                              role.name?.toLowerCase()
                            )
                        )
                        .map((role) => (
                          <option
                            key={role.id}
                            value={role.id}
                          >
                            {role.name}
                          </option>
                        ))}
                    </select>
                  )}
                </Field>
                {/* STATUS */}

                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateField("status", event.target.value)
                    }
                    className="
      select
      select-bordered
      h-10
      min-h-10
      w-full
    "
                  >
                    <option value="active">Active</option>

                    <option value="inactive">Inactive</option>

                    <option value="WFH">WFH</option>
                  </select>
                </Field>
              </div>
            </section>
            {/* =============================================================
                    REPORTING
                ============================================================= */}
            {!isRestrictedRole && (
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-5 w-1 rounded-full bg-[#8BCF00]" />

                  <h3 className="text-sm font-semibold text-base-content">
                    Reporting
                  </h3>
                </div>

                <Field label="Reports To">
                  <select
                    value={form.reports_to_id}
                    onChange={(event) =>
                      updateField(
                        "reports_to_id",
                        event.target.value
                          ? Number(event.target.value)
                          : ""
                      )
                    }
                    className="
          select
          select-bordered
          h-10
          min-h-10
          w-full
        "
                  >
                    <option value="">
                      Select employee
                    </option>

                    {employees
                      .filter((item) => {
                        if (employee && item.id === employee.id) {
                          return false;
                        }

                        if (item.blocked) {
                          return false;
                        }

                        if (item.status !== "active") {
                          return false;
                        }

                        return true;
                      })
                      .map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.name}
                        </option>
                      ))}
                  </select>
                </Field>
              </section>
            )}
            {/* =============================================
                            OTHER DETAILS
                        ============================================= */}

            <section>
              <div
                className="
                                mb-4
                                flex
                                items-center
                                gap-3
                            "
              >
                <div
                  className="
                                    h-5
                                    w-1
                                    rounded-full
                                    bg-[#8BCF00]
                                "
                />

                <h3
                  className="
                                    text-sm
                                    font-semibold
                                    text-base-content
                                "
                >
                  Other Details
                </h3>
              </div>

              <div
                className="
                                grid
                                grid-cols-1
                                gap-4
                                md:grid-cols-2
                            "
              >
                <Field label="Date of Birth">
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(event) =>
                      updateField("dateOfBirth", event.target.value)
                    }
                    className="
                                            input
                                            input-bordered
                                            h-10
                                            min-h-10
                                            w-full
                                        "
                  />
                </Field>

                <Field label="Joining Date">
                  <input
                    type="date"
                    value={form.joiningDate}
                    onChange={(event) =>
                      updateField("joiningDate", event.target.value)
                    }
                    className="
                                            input
                                            input-bordered
                                            h-10
                                            min-h-10
                                            w-full
                                        "
                  />
                </Field>

                <Field label="Designation">
                  <input
                    type="text"
                    value={form.designation}
                    onChange={(event) =>
                      updateField("designation", event.target.value)
                    }
                    placeholder="Enter designation"
                    className="
                                            input
                                            input-bordered
                                            h-10
                                            min-h-10
                                            w-full
                                        "
                  />
                </Field>

                <Field label="Shift Type">
                  <input
                    type="text"
                    value={form.shiftType}
                    onChange={(event) =>
                      updateField("shiftType", event.target.value)
                    }
                    placeholder="Enter shift type"
                    className="
                                            input
                                            input-bordered
                                            h-10
                                            min-h-10
                                            w-full
                                        "
                  />
                </Field>

                <Field label="Current Address">
                  <input
                    type="text"
                    value={form.currentAddress}
                    onChange={(event) =>
                      updateField("currentAddress", event.target.value)
                    }
                    placeholder="Enter current address"
                    className="
                                            input
                                            input-bordered
                                            h-10
                                            min-h-10
                                            w-full
                                        "
                  />
                </Field>

                <Field label="Current CTC">
                  <input
                    type="number"
                    value={form.currentCTC}
                    onChange={(event) =>
                      updateField("currentCTC", event.target.value)
                    }
                    placeholder="Enter current CTC"
                    className="
                                            input
                                            input-bordered
                                            h-10
                                            min-h-10
                                            w-full
                                        "
                  />
                </Field>

                <Field label="Previous CTC">
                  <input
                    type="number"
                    value={form.previousCTC}
                    onChange={(event) =>
                      updateField("previousCTC", event.target.value)
                    }
                    placeholder="Enter previous CTC"
                    className="
                                            input
                                            input-bordered
                                            h-10
                                            min-h-10
                                            w-full
                                        "
                  />
                </Field>

                <Field label="Blood Group">
                  <select
                    value={form.bloodGroup}
                    onChange={(event) =>
                      updateField("bloodGroup", event.target.value)
                    }
                    className="
                                            select
                                            select-bordered
                                            h-10
                                            min-h-10
                                            w-full
                                        "
                  >
                    <option value="">Select blood group</option>

                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ),
                    )}
                  </select>
                </Field>

                <Field label="PAN Card No">
                  <input
                    type="text"
                    value={form.panCardNo}
                    onChange={(event) =>
                      updateField("panCardNo", event.target.value.toUpperCase())
                    }
                    placeholder="Enter PAN number"
                    className="
                                            input
                                            input-bordered
                                            h-10
                                            min-h-10
                                            w-full
                                        "
                  />
                </Field>

                <Field label="Aadhaar Card No">
                  <input
                    type="text"
                    value={form.aadhaarCardNo}
                    onChange={(event) =>
                      updateField("aadhaarCardNo", event.target.value)
                    }
                    placeholder="Enter Aadhaar number"
                    className="
                                            input
                                            input-bordered
                                            h-10
                                            min-h-10
                                            w-full
                                        "
                  />
                </Field>
              </div>
            </section>

            {/* =============================================
                            DOCUMENTS
                        ============================================= */}

            <section>
              <div
                className="
      mb-4
      flex
      items-center
      gap-3
    "
              >
                <div
                  className="
        h-5
        w-1
        rounded-full
        bg-[#8BCF00]
      "
                />

                <h3
                  className="
        text-sm
        font-semibold
        text-base-content
      "
                >
                  Documents
                </h3>
              </div>

              <div
                className="
      grid
      grid-cols-1
      gap-5
      md:grid-cols-2
    "
              >
                {/* =====================================================
        PROFILE IMAGE
    ====================================================== */}

                <div>
                  <FileUpload
                    label="Profile Image"
                    file={form.profileImage}
                    accept="image/*"
                    inputRef={profileImageRef}
                    onChange={(event) =>
                      handleSingleFile(
                        "profileImage",
                        event
                      )
                    }
                    onClick={() =>
                      profileImageRef.current?.click()
                    }
                  />

                  {existingDocuments.profile_image && (
                    <div className="mt-3">
                      <p
                        className="
              mb-2
              text-xs
              font-medium
              text-base-content/60
            "
                      >
                        Existing Profile Image
                      </p>

                      <a
                        href={getFileUrl(
                          existingDocuments.profile_image
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block"
                      >
                        <img
                          src={getFileUrl(
                            existingDocuments.profile_image
                          )}
                          alt="Existing profile"
                          className="
                h-24
                w-24
                rounded-lg
                border
                border-base-300
                object-cover
                transition
                hover:opacity-80
              "
                        />
                      </a>
                    </div>
                  )}
                </div>

                {/* =====================================================
        AADHAAR
    ====================================================== */}

                <div>
                  <FileUpload
                    label="Aadhaar Card"
                    file={form.aadhaarCard}
                    accept=".pdf,.jpg,.jpeg,.png"
                    inputRef={aadhaarRef}
                    onChange={(event) =>
                      handleSingleFile(
                        "aadhaarCard",
                        event
                      )
                    }
                    onClick={() =>
                      aadhaarRef.current?.click()
                    }
                  />

                  {existingDocuments.aadhar_card && (
                    <div className="mt-3">
                      <p
                        className="
              mb-2
              text-xs
              font-medium
              text-base-content/60
            "
                      >
                        Existing Aadhaar
                      </p>

                      {/\.(jpg|jpeg|png|gif|webp)$/i.test(
                        existingDocuments.aadhar_card
                      ) ? (
                        <a
                          href={getFileUrl(
                            existingDocuments.aadhar_card
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block"
                        >
                          <img
                            src={getFileUrl(
                              existingDocuments.aadhar_card
                            )}
                            alt="Existing Aadhaar"
                            className="
                  h-24
                  w-36
                  rounded-lg
                  border
                  border-base-300
                  object-cover
                  transition
                  hover:opacity-80
                "
                          />
                        </a>
                      ) : (
                        <a
                          href={getFileUrl(
                            existingDocuments.aadhar_card
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="
                inline-flex
                items-center
                rounded-lg
                border
                border-base-300
                px-3
                py-2
                text-xs
                font-medium
                text-primary
                underline
              "
                        >
                          View existing Aadhaar
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* =====================================================
        PAN
    ====================================================== */}

                <div>
                  <FileUpload
                    label="PAN Card"
                    file={form.panCard}
                    accept=".pdf,.jpg,.jpeg,.png"
                    inputRef={panRef}
                    onChange={(event) =>
                      handleSingleFile(
                        "panCard",
                        event
                      )
                    }
                    onClick={() =>
                      panRef.current?.click()
                    }
                  />

                  {existingDocuments.pan_card && (
                    <div className="mt-3">
                      <p
                        className="
              mb-2
              text-xs
              font-medium
              text-base-content/60
            "
                      >
                        Existing PAN
                      </p>

                      {/\.(jpg|jpeg|png|gif|webp)$/i.test(
                        existingDocuments.pan_card
                      ) ? (
                        <a
                          href={getFileUrl(
                            existingDocuments.pan_card
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block"
                        >
                          <img
                            src={getFileUrl(
                              existingDocuments.pan_card
                            )}
                            alt="Existing PAN"
                            className="
                  h-24
                  w-36
                  rounded-lg
                  border
                  border-base-300
                  object-cover
                  transition
                  hover:opacity-80
                "
                          />
                        </a>
                      ) : (
                        <a
                          href={getFileUrl(
                            existingDocuments.pan_card
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="
                inline-flex
                items-center
                rounded-lg
                border
                border-base-300
                px-3
                py-2
                text-xs
                font-medium
                text-primary
                underline
              "
                        >
                          View existing PAN
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* =====================================================
        BANK PASSBOOK
    ====================================================== */}

                <div>
                  <FileUpload
                    label="Bank Passbook"
                    file={form.bankPassbook}
                    accept=".pdf,.jpg,.jpeg,.png"
                    inputRef={bankPassbookRef}
                    onChange={(event) =>
                      handleSingleFile(
                        "bankPassbook",
                        event
                      )
                    }
                    onClick={() =>
                      bankPassbookRef.current?.click()
                    }
                  />

                  {existingDocuments.bank_passbook && (
                    <div className="mt-3">
                      <p
                        className="
              mb-2
              text-xs
              font-medium
              text-base-content/60
            "
                      >
                        Existing Bank Passbook
                      </p>

                      {/\.(jpg|jpeg|png|gif|webp)$/i.test(
                        existingDocuments.bank_passbook
                      ) ? (
                        <a
                          href={getFileUrl(
                            existingDocuments.bank_passbook
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block"
                        >
                          <img
                            src={getFileUrl(
                              existingDocuments.bank_passbook
                            )}
                            alt="Existing bank passbook"
                            className="
                  h-24
                  w-36
                  rounded-lg
                  border
                  border-base-300
                  object-cover
                  transition
                  hover:opacity-80
                "
                          />
                        </a>
                      ) : (
                        <a
                          href={getFileUrl(
                            existingDocuments.bank_passbook
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="
                inline-flex
                items-center
                rounded-lg
                border
                border-base-300
                px-3
                py-2
                text-xs
                font-medium
                text-primary
                underline
              "
                        >
                          View existing bank passbook
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* =======================================================
      SALARY SLIPS
  ======================================================== */}

              <div className="mt-5">
                <p
                  className="
        mb-2
        text-xs
        font-medium
        text-base-content/70
      "
                >
                  Salary Slips
                </p>

                {/* Existing salary slips */}

                {existingDocuments.salary_slip.length > 0 && (
                  <div className="mb-3">
                    <p
                      className="
            mb-2
            text-xs
            font-medium
            text-base-content/60
          "
                    >
                      Existing Salary Slips
                    </p>

                    <div
                      className="
            space-y-2
          "
                    >
                      {existingDocuments.salary_slip.map(
                        (filePath, index) => (
                          <a
                            key={`${filePath}-${index}`}
                            href={getFileUrl(filePath)}
                            target="_blank"
                            rel="noreferrer"
                            className="
                  flex
                  items-center
                  justify-between
                  rounded-lg
                  border
                  border-base-300
                  px-3
                  py-2
                  text-xs
                  text-primary
                  transition
                  hover:bg-base-200
                "
                          >
                            <span>
                              Salary Slip {index + 1}
                            </span>

                            <span className="underline">
                              View
                            </span>
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Upload new salary slips */}

                <input
                  ref={salarySlipsRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleSalarySlips}
                />

                <button
                  type="button"
                  onClick={() =>
                    salarySlipsRef.current?.click()
                  }
                  className="
        flex
        h-10
        w-full
        items-center
        justify-center
        gap-2
        rounded-lg
        border
        border-[#8BCF00]
        bg-base-100
        text-xs
        font-medium
        text-[#78B300]
        transition
        hover:bg-[#8BCF00]/5
      "
                >
                  <PlusIcon
                    className="
          h-4
          w-4
        "
                  />

                  Add Salary Slips
                </button>

                {/* Newly selected salary slips */}

                {form.salarySlips.length > 0 && (
                  <div
                    className="
          mt-3
          space-y-2
        "
                  >
                    {form.salarySlips.map(
                      (file, index) => (
                        <div
                          key={`${file.name || "file"}-${index}`}
                          className="
                flex
                items-center
                justify-between
                rounded-lg
                border
                border-base-300
                px-3
                py-2
              "
                        >
                          <p
                            className="
                  min-w-0
                  truncate
                  text-xs
                  text-base-content/70
                "
                          >
                            {file.name ||
                              "Uploaded salary slip"}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              removeSalarySlip(index)
                            }
                            className="
                  ml-3
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-red-500
                  transition
                  hover:bg-red-50
                "
                            aria-label="Remove salary slip"
                          >
                            <TrashIcon
                              className="
                    h-4
                    w-4
                  "
                            />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* =============================================================
                    PERMISSIONS
                ============================================================= */}
            {!isRestrictedRole && (
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-5 w-1 rounded-full bg-[#8BCF00]" />

                  <div>
                    <h3 className="text-sm font-semibold text-base-content">
                      Permissions
                    </h3>

                    <p className="mt-0.5 text-xs text-base-content/45">
                      Select the common permissions for this employee.
                    </p>
                  </div>
                </div>

                {permissions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {permissions.map((permission) => {
                      const selected = form.permission_ids.includes(
                        permission.id
                      );

                      return (
                        <label
                          key={permission.id}
                          className="
              flex
              cursor-pointer
              items-center
              gap-3
              rounded-lg
              border
              border-base-300
              px-3
              py-3
              transition
              hover:bg-base-200
            "
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => {
                              setForm((previous) => ({
                                ...previous,
                                permission_ids: selected
                                  ? previous.permission_ids.filter(
                                    (id) => id !== permission.id
                                  )
                                  : [
                                    ...previous.permission_ids,
                                    permission.id,
                                  ],
                              }));
                            }}
                            className="checkbox checkbox-sm"
                          />

                          <div className="min-w-0">
                            <p className="text-xs font-medium text-base-content">
                              {permission.name || permission.code}
                            </p>

                            {permission.description &&
                              permission.description.toLowerCase() !== "common" && (
                                <p className="mt-0.5 text-[11px] text-base-content/45">
                                  {permission.description}
                                </p>
                              )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className="
        rounded-xl
        border
        border-base-300
        bg-base-200/20
        px-4
        py-4
        text-center
      "
                  >
                    <p className="text-xs text-base-content/50">
                      No common permissions available.
                    </p>
                  </div>
                )}

                <div className="mt-3 flex justify-end">
                  <span
                    className="
        rounded-full
        bg-[#8BCF00]/10
        px-3
        py-1
        text-xs
        font-semibold
        text-[#6FA800]
      "
                  >
                    {form.permission_ids.length} selected
                  </span>
                </div>
              </section>
            )}
          </div>

          {/* =================================================
                        FOOTER
                    ================================================= */}

          <div
            className="
                        sticky
                        bottom-0
                        flex
                        shrink-0
                        items-center
                        justify-end
                        gap-2
                        border-t
                        border-base-300
                        bg-base-100
                        px-5
                        py-4
                    "
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="
                                h-10
                                rounded-lg
                                px-4
                                text-xs
                                font-medium
                                text-base-content/60
                                transition
                                hover:bg-base-200
                                disabled:opacity-50
                            "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="
                                inline-flex
                                h-10
                                items-center
                                justify-center
                                rounded-lg
                                bg-[#8BCF00]
                                px-5
                                text-xs
                                font-semibold
                                text-white
                                transition
                                hover:bg-[#78B300]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
            >
              {saving ? "Saving..." : employee ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =============================================================
// FIELD
// =============================================================

function Field({ label, required = false, error = "", children }) {
  return (
    <div>
      <label
        className="
                mb-1.5
                block
                text-xs
                font-medium
                text-base-content/65
            "
      >
        {label}

        {required && (
          <span
            className="
                        ml-0.5
                        text-red-500
                    "
          >
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p
          className="
                    mt-1
                    text-[11px]
                    text-red-500
                "
        >
          {error}
        </p>
      )}
    </div>
  );
}

// =============================================================
// FILE UPLOAD
// =============================================================

function FileUpload({ label, file, accept, inputRef, onChange, onClick }) {
  return (
    <div>
      <p
        className="
                mb-1.5
                text-xs
                font-medium
                text-base-content/65
            "
      >
        {label}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onChange}
      />

      <button
        type="button"
        onClick={onClick}
        className="
                    flex
                    h-10
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-[#8BCF00]
                    bg-base-100
                    px-3
                    text-xs
                    font-medium
                    text-[#78B300]
                    transition
                    hover:bg-[#8BCF00]/5
                "
      >
        <CloudArrowUpIcon
          className="
                    h-4
                    w-4
                "
        />

        {file ? "Change File" : "Upload"}
      </button>

      {file && (
        <p
          className="
                    mt-1.5
                    truncate
                    text-[11px]
                    text-base-content/45
                "
        >
          {file.name || "File selected"}
        </p>
      )}
    </div>
  );
}

export default EmployeeModal;
