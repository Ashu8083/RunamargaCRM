/*
 * admin-react/src/pages/crm/EmployeeManagement/LeaveManagement/components/LeaveModal.jsx
 */

import { useEffect, useState } from "react";

import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";
import ClipboardDocumentCheckIcon from "@heroicons/react/24/outline/ClipboardDocumentCheckIcon";

// ============================================================================
// DATE HELPERS
// ============================================================================

const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const calculateDateRangeDays = (fromDate, toDate) => {
  if (!fromDate || !toDate || toDate < fromDate) return 0;

  const from = new Date(`${fromDate}T00:00:00`);
  const to = new Date(`${toDate}T00:00:00`);

  return Math.round((to.getTime() - from.getTime()) / 86400000) + 1;
};

// ============================================================================
// STATUS STYLING
// ============================================================================

const getStatusClasses = (status) => {
  const normalizedStatus = String(status || "").trim().toLowerCase();

  if (normalizedStatus === "approved") {
    return "bg-[#8BCF00]/10 text-[#6FA800] border-[#8BCF00]/40";
  }

  if (normalizedStatus === "rejected") {
    return "bg-red-50 text-red-600 border-red-300";
  }

  return "bg-amber-50 text-amber-700 border-amber-300";
};

// ============================================================================
// FIELD LABEL
// ============================================================================

const FieldLabel = ({ children, required = false }) => (
  <label className="mb-1.5 block text-xs font-medium text-base-content/60">
    {children}
    {required && <span className="ml-1 text-red-500">*</span>}
  </label>
);

// ============================================================================
// DETAIL ITEM
// ============================================================================

const DetailItem = ({ label, children }) => (
  <div className="min-w-0 rounded-lg border border-base-300 bg-base-200/30 p-3">
    <p className="text-[11px] font-medium uppercase tracking-wide text-base-content/45">
      {label}
    </p>

    <div className="mt-1.5 break-words text-sm font-medium text-base-content">
      {children || "—"}
    </div>
  </div>
);

// ============================================================================
// LEAVE MODAL
// ============================================================================

function LeaveModal({
  open = false,
  leave = null,
  mode = "create",
  onClose,
  onSave,
  onReview,
  saving = false,
  error = "",
}) {
  // =========================================================================
  // FORM STATE
  // =========================================================================

  const [formData, setFormData] = useState({
    from_date: getTodayDate(),
    to_date: getTodayDate(),
    leave_type: "Full Day Leave",
    reason: "",
  });

  const [reviewStatus, setReviewStatus] = useState("Approved");
  const [reviewRemarks, setReviewRemarks] = useState("");
  const [formError, setFormError] = useState("");

  // =========================================================================
  // RESET FORM WHEN OPENING / CHANGING REQUEST
  // =========================================================================

  useEffect(() => {
    if (!open) return;

    setFormError("");

    if (leave) {
      setFormData({
        from_date: String(leave.from_date || getTodayDate()).slice(0, 10),
        to_date: String(leave.to_date || getTodayDate()).slice(0, 10),
        leave_type: leave.leave_type || "Full Day Leave",
        reason: leave.reason || "",
      });

      setReviewStatus("Approved");
      setReviewRemarks(leave.review_remarks || "");
    } else {
      const today = getTodayDate();

      setFormData({
        from_date: today,
        to_date: today,
        leave_type: "Full Day Leave",
        reason: "",
      });

      setReviewStatus("Approved");
      setReviewRemarks("");
    }
  }, [open, leave, mode]);

  // =========================================================================
  // ESCAPE KEY
  // =========================================================================

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, saving, onClose]);

  // =========================================================================
  // FORM CHANGE
  // =========================================================================

  const handleChange = (field, value) => {
    const today = getTodayDate();

    setFormData((current) => {
      if (field === "from_date") {
        const safeStartDate = value < today ? today : value;

        return {
          ...current,
          from_date: safeStartDate,
          to_date:
            current.to_date < safeStartDate
              ? safeStartDate
              : current.to_date,
        };
      }

      if (field === "to_date") {
        const minimumDate =
          current.from_date > today ? current.from_date : today;

        return {
          ...current,
          to_date: value < minimumDate ? minimumDate : value,
        };
      }

      return {
        ...current,
        [field]: value,
      };
    });

    setFormError("");
  };

  // =========================================================================
  // CLOSE
  // =========================================================================

  const handleClose = () => {
    if (!saving) onClose?.();
  };

  // =========================================================================
  // SAVE LEAVE REQUEST
  // =========================================================================

  const handleSave = async (event) => {
    event.preventDefault();

    if (saving) return;

    setFormError("");

    const today = getTodayDate();

    if (!formData.from_date) {
      setFormError("Please select a start date.");
      return;
    }

    if (!formData.to_date) {
      setFormError("Please select an end date.");
      return;
    }

    if (formData.from_date < today) {
      setFormError("Past dates are not allowed. Select today or a future date.");
      return;
    }

    if (formData.to_date < today) {
      setFormError("The end date cannot be in the past.");
      return;
    }

    if (formData.to_date < formData.from_date) {
      setFormError("The end date cannot be before the start date.");
      return;
    }

    if (!formData.reason.trim()) {
      setFormError("Please enter a reason for your leave request.");
      return;
    }

    if (typeof onSave !== "function") {
      setFormError("Leave submission is unavailable.");
      return;
    }

    await onSave({
      from_date: formData.from_date,
      to_date: formData.to_date,
      leave_type: formData.leave_type,
      reason: formData.reason.trim(),
    });
  };

  // =========================================================================
  // REVIEW LEAVE REQUEST
  // =========================================================================

  const handleReview = async (event) => {
    event.preventDefault();

    if (saving || !leave?.id) return;

    setFormError("");

    if (typeof onReview !== "function") {
      setFormError("Leave review is unavailable.");
      return;
    }

    await onReview(leave.id, {
      status: reviewStatus,
      review_remarks: reviewRemarks.trim() || null,
    });
  };

  // =========================================================================
  // CALCULATE DAYS
  // =========================================================================

  const calculateDays = () =>
    calculateDateRangeDays(formData.from_date, formData.to_date);

  // =========================================================================
  // MODAL VISIBILITY
  // =========================================================================

  if (!open) return null;

  // =========================================================================
  // MODE FLAGS
  // =========================================================================

  const isCreateMode = mode === "create";
  const isReviewMode = mode === "review" && leave?.status === "Pending";
  const isViewMode = !isCreateMode && !isReviewMode;

  const modalTitle = isCreateMode
    ? "Apply for Leave"
    : isReviewMode
      ? "Review Leave Request"
      : "Leave Request Details";

  const modalDescription = isCreateMode
    ? "Submit your leave request for approval."
    : isReviewMode
      ? "Review the request and record your decision."
      : "View the submitted leave request and its review details.";

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-start justify-center
        overflow-y-auto overscroll-contain
        bg-black/50 backdrop-blur-sm
        p-3 pt-3
        sm:p-4 sm:pt-4
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-modal-title"
        className="
          relative flex w-full max-w-2xl flex-col
          max-h-[calc(100vh-1.5rem)]
          max-h-[calc(100dvh-1.5rem)]
          overflow-hidden rounded-2xl
          border border-base-300 bg-base-100 shadow-2xl
          sm:max-h-[calc(100vh-2rem)]
          sm:max-h-[calc(100dvh-2rem)]
        "
      >
        {/* HEADER */}

        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-base-300 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8BCF00]/10 text-[#6FA800]">
              {isReviewMode ? (
                <ClipboardDocumentCheckIcon className="h-5 w-5" />
              ) : (
                <CalendarDaysIcon className="h-5 w-5" />
              )}
            </div>

            <div>
              <h2 id="leave-modal-title" className="text-base font-semibold text-base-content">
                {modalTitle}
              </h2>

              <p className="mt-1 text-xs leading-5 text-base-content/50">
                {modalDescription}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            aria-label="Close modal"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base-content/50 transition hover:bg-base-200 hover:text-base-content disabled:opacity-50"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {(formError || error) && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {formError || error}
            </div>
          )}

          {/* CREATE MODE */}

          {isCreateMode && (
            <form id="leave-create-form" onSubmit={handleSave} className="space-y-5">
              <div>
                <FieldLabel required>Leave Type</FieldLabel>

                <select
                  value={formData.leave_type}
                  onChange={(event) => handleChange("leave_type", event.target.value)}
                  required
                  disabled={saving}
                  className="select select-bordered h-11 min-h-11 w-full"
                >
                  <option value="Full Day Leave">Full Day Leave</option>
                  <option value="Half Day Leave">Half Day Leave</option>
                  <option value="WFH">Work From Home (WFH)</option>
                </select>
              </div>

              {/* DATE RANGE */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel required>From Date</FieldLabel>

                  <input
                    type="date"
                    value={formData.from_date}
                    min={getTodayDate()}
                    onChange={(event) => handleChange("from_date", event.target.value)}
                    required
                    disabled={saving}
                    className="input input-bordered h-11 min-h-11 w-full"
                  />
                </div>

                <div>
                  <FieldLabel required>To Date</FieldLabel>

                  <input
                    type="date"
                    value={formData.to_date}
                    min={
                      formData.from_date > getTodayDate()
                        ? formData.from_date
                        : getTodayDate()
                    }
                    onChange={(event) => handleChange("to_date", event.target.value)}
                    required
                    disabled={saving}
                    className="input input-bordered h-11 min-h-11 w-full"
                  />
                </div>
              </div>

              {/* DAY COUNT */}

              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#8BCF00]/30 bg-[#8BCF00]/5 px-4 py-3">
                <div>
                  <p className="text-xs font-medium text-base-content/60">
                    Total Duration
                  </p>
                  <p className="mt-1 text-xs text-base-content/45">
                    Inclusive of both dates
                  </p>
                </div>

                <p className="text-lg font-semibold text-[#6FA800]">
                  {calculateDays()} {calculateDays() === 1 ? "day" : "days"}
                </p>
              </div>

              {/* REASON */}

              <div>
                <FieldLabel required>Reason</FieldLabel>

                <textarea
                  value={formData.reason}
                  onChange={(event) => handleChange("reason", event.target.value)}
                  rows={4}
                  maxLength={2000}
                  required
                  disabled={saving}
                  placeholder="Explain the reason for your leave request..."
                  className="textarea textarea-bordered min-h-[110px] w-full resize-y"
                />

                <p className="mt-1.5 text-right text-[11px] text-base-content/40">
                  {formData.reason.length}/2000
                </p>
              </div>
            </form>
          )}

          {/* VIEW / REVIEW DETAILS */}

          {!isCreateMode && leave && (
            <div className="space-y-5">
              <div className="flex flex-col gap-3 rounded-xl border border-base-300 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-base-content/45">Request ID</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-base-content">
                    #{leave.id}
                  </p>
                </div>

                <span
                  className={[
                    "inline-flex self-start rounded-full border px-3 py-1.5 text-xs font-medium",
                    getStatusClasses(leave.status),
                  ].join(" ")}
                >
                  {leave.status || "Pending"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailItem label="Employee">
                  {leave.employee_name || `Employee #${leave.applied_by}`}
                </DetailItem>

                <DetailItem label="Leave Type">
                  {leave.leave_type === "WFH"
                    ? "Work From Home (WFH)"
                    : leave.leave_type}
                </DetailItem>

                <DetailItem label="From Date">{formatDate(leave.from_date)}</DetailItem>
                <DetailItem label="To Date">{formatDate(leave.to_date)}</DetailItem>

                <DetailItem label="Duration">
                  {leave.days ?? calculateDateRangeDays(leave.from_date, leave.to_date)}{" "}
                  {(leave.days ?? calculateDateRangeDays(leave.from_date, leave.to_date)) === 1
                    ? "day"
                    : "days"}
                </DetailItem>

                <DetailItem label="Submitted">
                  {leave.created_at
                    ? new Date(leave.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "—"}
                </DetailItem>
              </div>

              <div>
                <FieldLabel>Reason</FieldLabel>
                <div className="whitespace-pre-wrap break-words rounded-lg border border-base-300 bg-base-200/30 p-4 text-sm leading-6 text-base-content/80">
                  {leave.reason || "No reason provided."}
                </div>
              </div>

              {!isReviewMode && (
                <div>
                  <FieldLabel>Review Remarks</FieldLabel>
                  <div className="whitespace-pre-wrap break-words rounded-lg border border-base-300 bg-base-200/30 p-4 text-sm leading-6 text-base-content/70">
                    {leave.review_remarks || "No review remarks provided."}
                  </div>

                  {leave.reviewed_at && (
                    <p className="mt-2 text-xs text-base-content/45">
                      Reviewed on{" "}
                      {new Date(leave.reviewed_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
                </div>
              )}

              {isReviewMode && (
                <form id="leave-review-form" onSubmit={handleReview} className="space-y-4 border-t border-base-300 pt-5">
                  <div>
                    <FieldLabel required>Decision</FieldLabel>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => setReviewStatus("Approved")}
                        className={[
                          "flex h-11 items-center justify-center rounded-lg border text-sm font-medium transition",
                          reviewStatus === "Approved"
                            ? "border-[#8BCF00]/50 bg-[#8BCF00]/10 text-[#6FA800] ring-2 ring-[#8BCF00]/20"
                            : "border-base-300 bg-base-100 text-base-content/60 hover:bg-base-200",
                        ].join(" ")}
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => setReviewStatus("Rejected")}
                        className={[
                          "flex h-11 items-center justify-center rounded-lg border text-sm font-medium transition",
                          reviewStatus === "Rejected"
                            ? "border-red-300 bg-red-50 text-red-600 ring-2 ring-red-200"
                            : "border-base-300 bg-base-100 text-base-content/60 hover:bg-base-200",
                        ].join(" ")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Review Remarks</FieldLabel>

                    <textarea
                      value={reviewRemarks}
                      onChange={(event) => setReviewRemarks(event.target.value)}
                      rows={3}
                      maxLength={2000}
                      disabled={saving}
                      placeholder="Add optional remarks for the employee..."
                      className="textarea textarea-bordered min-h-[90px] w-full resize-y"
                    />

                    <p className="mt-1.5 text-right text-[11px] text-base-content/40">
                      {reviewRemarks.length}/2000
                    </p>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-base-300 bg-base-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-base-300 bg-base-100 px-4 text-xs font-medium text-base-content/70 transition hover:bg-base-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isViewMode ? "Close" : "Cancel"}
          </button>

          {isCreateMode && (
            <button
              type="submit"
              form="leave-create-form"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#8BCF00] px-5 text-xs font-semibold text-white transition hover:bg-[#75b000] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {saving ? "Submitting..." : "Submit Request"}
            </button>
          )}

          {isReviewMode && (
            <button
              type="submit"
              form="leave-review-form"
              disabled={saving}
              className={[
                "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-5 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50",
                reviewStatus === "Approved"
                  ? "bg-[#8BCF00] hover:bg-[#75b000]"
                  : "bg-red-600 hover:bg-red-700",
              ].join(" ")}
            >
              {saving && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {saving
                ? "Saving..."
                : reviewStatus === "Approved"
                  ? "Confirm Approval"
                  : "Confirm Rejection"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeaveModal;