// admin-react\src\pages\EmployeeManagement\Employees\components\EmployeeModal.jsx
import { useEffect, useRef, useState } from "react";

import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import ShieldCheckIcon from "@heroicons/react/24/outline/ShieldCheckIcon";
import CloudArrowUpIcon from "@heroicons/react/24/outline/CloudArrowUpIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";

import PermissionsModal from "../../../../components/GlobalModels/PermissionsModal";
// =============================================================
// DEFAULT FORM
// =============================================================

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  alternatePhone: "",
  role: "",
  status: "Active",

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

  permissions: [],
};

// =============================================================
// COMPONENT
// =============================================================

function EmployeeModal({
  open = false,
  employee = null,
  roles = ["agent", "rm", "admin"],
  onClose,
  onSubmit,
  onManagePermissions,
}) {
  // =========================================================
  // FORM
  // =========================================================
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [permissionEmployee, setPermissionEmployee] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

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
        ...employee,

        salarySlips: Array.isArray(employee.salarySlips)
          ? employee.salarySlips
          : [],

        permissions: Array.isArray(employee.permissions)
          ? employee.permissions
          : [],
      });
    } else {
      setForm(INITIAL_FORM);
    }

    setErrors({});

    setSaving(false);
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

    if (!form.role) {
      nextErrors.role = "Role is required";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);

      /*
       * This is the payload that can later be
       * sent directly to your backend API.
       *
       * Employee ID is intentionally NOT included.
       * The backend should generate it.
       */

      const payload = {
        ...form,

        permissionIds: form.permissions.map((permission) => permission.id),
      };

      if (onSubmit) {
        await onSubmit(payload);
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // PERMISSIONS
  // =========================================================

  const assignedPermissionCount = form.permissions.length;

  const handlePermissions = () => {
    /*
     * Preferred approach:
     *
     * Parent opens the reusable/global
     * PermissionsModal and returns the
     * selected permissions through callback.
     */

    if (onManagePermissions) {
      onManagePermissions(form);
    }
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
          onSubmit={handleSubmit}
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

                <Field label="Role" required error={errors.role}>
                  <select
                    value={form.role}
                    onChange={(event) =>
                      updateField("role", event.target.value)
                    }
                    className="
                                            select
                                            select-bordered
                                            h-10
                                            min-h-10
                                            w-full
                                        "
                  >
                    <option value="">Select role</option>

                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {formatLabel(role)}
                      </option>
                    ))}
                  </select>
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
                    <option value="Active">Active</option>

                    <option value="Inactive">Inactive</option>
                  </select>
                </Field>
              </div>
            </section>

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
                                gap-4
                                md:grid-cols-2
                            "
              >
                <FileUpload
                  label="Profile Image"
                  file={form.profileImage}
                  accept="image/*"
                  inputRef={profileImageRef}
                  onChange={(event) => handleSingleFile("profileImage", event)}
                  onClick={() => profileImageRef.current?.click()}
                />

                <FileUpload
                  label="Aadhaar Card"
                  file={form.aadhaarCard}
                  accept=".pdf,.jpg,.jpeg,.png"
                  inputRef={aadhaarRef}
                  onChange={(event) => handleSingleFile("aadhaarCard", event)}
                  onClick={() => aadhaarRef.current?.click()}
                />

                <FileUpload
                  label="PAN Card"
                  file={form.panCard}
                  accept=".pdf,.jpg,.jpeg,.png"
                  inputRef={panRef}
                  onChange={(event) => handleSingleFile("panCard", event)}
                  onClick={() => panRef.current?.click()}
                />

                <FileUpload
                  label="Bank Passbook"
                  file={form.bankPassbook}
                  accept=".pdf,.jpg,.jpeg,.png"
                  inputRef={bankPassbookRef}
                  onChange={(event) => handleSingleFile("bankPassbook", event)}
                  onClick={() => bankPassbookRef.current?.click()}
                />
              </div>

              {/* SALARY SLIPS */}

              <div className="mt-4">
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
                  onClick={() => salarySlipsRef.current?.click()}
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

                {form.salarySlips.length > 0 && (
                  <div
                    className="
                                        mt-3
                                        space-y-2
                                    "
                  >
                    {form.salarySlips.map((file, index) => (
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
                          {file.name || "Uploaded salary slip"}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeSalarySlip(index)}
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
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* =============================================
                            PERMISSIONS
                        ============================================= */}

            <section>
              <div
                className="
                                mb-4
                                flex
                                items-center
                                justify-between
                                gap-3
                            "
              >
                <div
                  className="
                                    flex
                                    items-center
                                    gap-3
                                "
                >
                  <div
                    className="
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-[#8BCF00]/10
                                    "
                  >
                    <ShieldCheckIcon
                      className="
                                            h-4
                                            w-4
                                            text-[#78B300]
                                        "
                    />
                  </div>

                  <div>
                    <h3
                      className="
                                            text-sm
                                            font-semibold
                                            text-base-content
                                        "
                    >
                      Permissions
                    </h3>

                    <p
                      className="
                                            mt-0.5
                                            text-xs
                                            text-base-content/45
                                        "
                    >
                      Control what this employee can access.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPermissionEmployee({
                      ...employee,
                      permissions: employee?.permissions || [],
                    });

                    setShowPermissionsModal(true);
                  }}
                  className="
                        flex
                        h-10
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-base-300
                        bg-base-100
                        px-4
                        text-sm
                        font-medium
                        text-base-content
                        transition
                        hover:bg-base-200
                    "
                >
                  Manage Permissions
                </button>
              </div>
              <PermissionsModal
                open={showPermissionsModal}
                admin={permissionEmployee}
                onClose={() => {
                  setShowPermissionsModal(false);
                  setPermissionEmployee(null);
                }}
              />
              <div
                className="
                                flex
                                items-center
                                justify-between
                                rounded-xl
                                border
                                border-base-300
                                bg-base-200/20
                                px-4
                                py-3
                            "
              >
                <div>
                  <p
                    className="
                                        text-sm
                                        font-medium
                                        text-base-content
                                    "
                  >
                    Assigned Permissions
                  </p>

                  <p
                    className="
                                        mt-0.5
                                        text-xs
                                        text-base-content/45
                                    "
                  >
                    Permissions will be saved with this employee.
                  </p>
                </div>

                <span
                  className="
                                    shrink-0
                                    rounded-full
                                    bg-[#8BCF00]/10
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    text-[#6FA800]
                                "
                >
                  {assignedPermissionCount}
                </span>
              </div>
            </section>
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

// =============================================================
// FORMAT LABEL
// =============================================================

function formatLabel(value) {
  return String(value || "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default EmployeeModal;
