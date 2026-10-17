// admin-react\src\pages\Loans\AgentApplications\components\ReminderModal.jsx
// admin-react/src/pages/Loans/AgentApplications/components/ReminderModal.jsx

import { useEffect, useState } from "react";

import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import BellAlertIcon from "@heroicons/react/24/outline/BellAlertIcon";

import apiClient from "../../../app/apiClient";
import FeedbackModal from "../../../components/GlobalModels/FeedbackModal";

function ReminderModal({ open, application, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    note: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);
  const [applicationId] = useState(true);

  // =========================================================
  // FEEDBACK MODAL STATE
  // =========================================================

  const [feedback, setFeedback] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  // =========================================================
  // GET CURRENT LOCAL DATE
  // =========================================================

  const getCurrentLocalDate = () => {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =========================================================
  // GET CURRENT LOCAL TIME
  // =========================================================

  const getCurrentLocalTime = () => {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");

    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  // =========================================================
  // SHOW FEEDBACK
  // =========================================================

  const showFeedback = (type, title, message) => {
    setFeedback({
      open: true,
      type,
      title,
      message,
    });
  };

  // =========================================================
  // CLOSE FEEDBACK
  // =========================================================

  const closeFeedback = () => {
    setFeedback((previous) => ({
      ...previous,
      open: false,
    }));
  };

  // =========================================================
  // RESET FORM WHEN MODAL OPENS
  //
  // Default:
  // Current date
  // Current time
  // Empty note
  // =========================================================

  useEffect(() => {
    if (!open || !applicationId) {
      setFormData({
        date: "",
        time: "",
        note: "",
      });

      setError("");

      return;
    }

    const currentDate = getCurrentLocalDate();

    const currentTime = getCurrentLocalTime();

    setFormData({
      date: currentDate,
      time: currentTime,
      note: "",
    });

    setError("");
    setLoading(false);
  }, [open, applicationId]);

  // =========================================================
  // CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    // =====================================================
    // DATE CHANGE
    // =====================================================

    if (name === "date") {
      const currentDate = getCurrentLocalDate();

      const currentTime = getCurrentLocalTime();

      /*
       * If today is selected and the currently selected
       * time is already in the past, move the time to
       * the current time.
       */

      if (
        value === currentDate &&
        formData.time &&
        formData.time < currentTime
      ) {
        setFormData((previous) => ({
          ...previous,

          date: value,

          time: currentTime,
        }));
      } else {
        setFormData((previous) => ({
          ...previous,

          date: value,
        }));
      }

      setError("");

      return;
    }

    // =====================================================
    // TIME CHANGE
    // =====================================================

    if (name === "time") {
      const currentDate = getCurrentLocalDate();

      const currentTime = getCurrentLocalTime();

      /*
       * When today is selected, don't allow a time
       * earlier than the current time.
       */

      if (formData.date === currentDate && value < currentTime) {
        setFormData((previous) => ({
          ...previous,

          time: currentTime,
        }));
      } else {
        setFormData((previous) => ({
          ...previous,

          time: value,
        }));
      }

      setError("");

      return;
    }

    // =====================================================
    // OTHER FIELDS
    // =====================================================

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // =========================================================
  // VALIDATION ERROR
  // =========================================================

  const showValidationError = (message) => {
    setError(message);

    showFeedback("error", "Unable to Add Reminder", message);
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    // =====================================================
    // APPLICATION ID
    // =====================================================

    if (
      applicationId === null ||
      applicationId === undefined ||
      applicationId === ""
    ) {
      showValidationError("Application information is missing.");

      return;
    }

    const parsedApplicationId = Number(applicationId);

    if (
      !Number.isSafeInteger(parsedApplicationId) ||
      parsedApplicationId <= 0
    ) {
      showValidationError("Invalid application ID.");

      return;
    }

    // =====================================================
    // DATE
    // =====================================================

    if (!formData.date) {
      showValidationError("Reminder date is required.");

      return;
    }

    // =====================================================
    // TIME
    // =====================================================

    if (!formData.time) {
      showValidationError("Reminder time is required.");

      return;
    }

    // =====================================================
    // NOTE
    // =====================================================

    if (!formData.note.trim()) {
      showValidationError("Reminder note is required.");

      return;
    }

    // =====================================================
    // CURRENT DATE / TIME
    // =====================================================

    const currentDate = getCurrentLocalDate();

    const currentTime = getCurrentLocalTime();

    // =====================================================
    // PREVIOUS DATE VALIDATION
    // =====================================================

    if (formData.date < currentDate) {
      showValidationError("Reminder date cannot be in the past.");

      return;
    }

    // =====================================================
    // PREVIOUS TIME VALIDATION
    //
    // Only applies when the reminder date is today.
    // =====================================================

    if (formData.date === currentDate && formData.time < currentTime) {
      showValidationError("Reminder time cannot be in the past.");

      return;
    }

    // =====================================================
    // CREATE REMINDER DATETIME
    // =====================================================

    const reminderDateTime = new Date(`${formData.date}T${formData.time}`);

    if (Number.isNaN(reminderDateTime.getTime())) {
      showValidationError("Invalid reminder date or time.");

      return;
    }

    // =====================================================
    // FINAL FUTURE VALIDATION
    // =====================================================

    if (reminderDateTime.getTime() <= Date.now()) {
      showValidationError("Reminder date and time must be in the future.");

      return;
    }

    // =====================================================
    // START LOADING
    // =====================================================

    setLoading(true);

    setError("");

    // =====================================================
    // SAVE REMINDER
    // =====================================================

    try {
      const response = await apiClient({
        method: "POST",

        url: "/reminders",

        data: {
          application_id: parsedApplicationId,

          reminder_at: reminderDateTime.toISOString(),

          note: formData.note.trim(),
        },
      });

      // =================================================
      // SUCCESS CALLBACK
      // =================================================

      if (typeof onSubmit === "function") {
        onSubmit(response.data);
      }

      // =================================================
      // RESET FORM
      // =================================================

      setFormData({
        date: "",
        time: "",
        note: "",
      });

      setError("");

      // =================================================
      // SHOW SUCCESS FEEDBACK
      // =================================================

      showFeedback(
        "success",
        "Reminder Created",
        "The reminder was created successfully.",
      );

      // =================================================
      // CLOSE REMINDER FORM
      // =================================================

      if (typeof onClose === "function") {
        onClose();
      }
    } catch (requestError) {
      console.error("Failed to create reminder:", requestError);

      let errorMessage = "Unable to create reminder.";

      const responseData = requestError?.response?.data;

      const detail = responseData?.detail;

      if (typeof detail === "string") {
        errorMessage = detail;
      } else if (Array.isArray(detail)) {
        const messages = detail.map((item) => item?.msg).filter(Boolean);

        if (messages.length > 0) {
          errorMessage = messages.join(", ");
        }
      } else if (typeof responseData?.message === "string") {
        errorMessage = responseData.message;
      }

      // =================================================
      // INLINE ERROR
      // =================================================

      setError(errorMessage);

      // =================================================
      // FEEDBACK MODAL
      // =================================================

      showFeedback("error", "Unable to Create Reminder", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // MODAL
  // =========================================================

  if (!open || !application) {
    return (
      <FeedbackModal
        open={feedback.open}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onClose={closeFeedback}
      />
    );
  }

  // =========================================================
  // MINIMUM DATE
  // =========================================================

  const minimumDate = getCurrentLocalDate();

  // =========================================================
  // MINIMUM TIME
  //
  // Only restrict time when selected date is today.
  // For future dates, there is no minimum time.
  // =========================================================

  const minimumTime =
    formData.date === minimumDate ? getCurrentLocalTime() : "00:00";

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <dialog
        open
        className="
                    modal
                    modal-bottom
                    sm:modal-middle
                "
      >
        <div
          className="
                        modal-box
                        w-11/12
                        max-w-lg
                        p-0
                        bg-base-100
                        border
                        border-base-300
                    "
        >
          {/* =================================================
                        HEADER
                    ================================================= */}

          <div
            className="
                            flex
                            items-center
                            justify-between
                            p-5
                            border-b
                            border-base-300
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
                                    w-9
                                    h-9
                                    rounded-lg
                                    bg-[#8BCF00]/10
                                    flex
                                    items-center
                                    justify-center
                                "
              >
                <BellAlertIcon
                  className="
                                        w-5
                                        h-5
                                        text-[#78B300]
                                    "
                />
              </div>

              <div>
                <h3
                  className="
                                        text-lg
                                        font-semibold
                                    "
                >
                  Add Reminder
                </h3>

                <p
                  className="
                                        text-xs
                                        text-base-content/50
                                        mt-1
                                    "
                >
                  Schedule a reminder for this application.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                                btn
                                btn-sm
                                btn-ghost
                                btn-circle
                            "
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* =================================================
                        FORM
                    ================================================= */}

          <form onSubmit={handleSubmit}>
            <div
              className="
                                p-5
                                space-y-5
                            "
            >
              {/* =========================================
                                APPLICATION DETAILS
                            ========================================= */}

              <div
                className="
                                    rounded-lg
                                    border
                                    border-base-300
                                    bg-base-200/30
                                    px-4
                                    py-3
                                "
              >
                <p
                  className="
                                        text-xs
                                        text-base-content/50
                                    "
                >
                  Application
                </p>

                <p
                  className="
                                        text-sm
                                        font-semibold
                                        mt-1
                                    "
                >
                  {application.name || "N/A"}
                </p>

                <p
                  className="
                                        text-xs
                                        text-base-content/50
                                        mt-0.5
                                    "
                >
                  {application.phone || "N/A"}
                </p>

                {(application.loanId ||
                  application.loan_id ||
                  application.unique_id) && (
                  <p
                    className="
                                            text-[11px]
                                            text-base-content/40
                                            mt-1
                                        "
                  >
                    Loan ID:{" "}
                    {application.loanId ||
                      application.loan_id ||
                      application.unique_id}
                  </p>
                )}
              </div>

              {/* =========================================
                                DATE AND TIME
                            ========================================= */}

              <div
                className="
                                    grid
                                    grid-cols-1
                                    sm:grid-cols-2
                                    gap-4
                                "
              >
                {/* =====================================
                                    DATE
                                ===================================== */}

                <div>
                  <label
                    className="
                                            label
                                            px-0
                                        "
                  >
                    <span
                      className="
                                                label-text
                                                text-sm
                                                font-medium
                                            "
                    >
                      Reminder Date
                    </span>
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={minimumDate}
                    disabled={loading}
                    required
                    className="
                                            input
                                            input-bordered
                                            w-full
                                            focus:border-[#8BCF00]
                                            focus:outline-[#8BCF00]
                                        "
                  />
                </div>

                {/* =====================================
                                    TIME
                                ===================================== */}

                <div>
                  <label
                    className="
                                            label
                                            px-0
                                        "
                  >
                    <span
                      className="
                                                label-text
                                                text-sm
                                                font-medium
                                            "
                    >
                      Reminder Time
                    </span>
                  </label>

                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    min={minimumTime}
                    disabled={loading}
                    required
                    className="
                                            input
                                            input-bordered
                                            w-full
                                            focus:border-[#8BCF00]
                                            focus:outline-[#8BCF00]
                                        "
                  />
                </div>
              </div>

              {/* =========================================
                                REMINDER NOTE
                            ========================================= */}

              <div>
                <label
                  className="
                                        label
                                        px-0
                                    "
                >
                  <span
                    className="
                                            label-text
                                            text-sm
                                            font-medium
                                        "
                  >
                    Reminder Note
                  </span>
                </label>

                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={4}
                  maxLength={5000}
                  disabled={loading}
                  required
                  placeholder="
                                        e.g. Follow up with customer regarding documents...
                                    "
                  className="
                                        textarea
                                        textarea-bordered
                                        w-full
                                        resize-none
                                        focus:border-[#8BCF00]
                                        focus:outline-[#8BCF00]
                                    "
                />
              </div>

              {/* =========================================
                                INLINE ERROR
                            ========================================= */}

              {error && (
                <div
                  className="
                                        rounded-lg
                                        border
                                        border-error/20
                                        bg-error/5
                                        px-3
                                        py-2
                                    "
                >
                  <p
                    className="
                                            text-xs
                                            text-error
                                        "
                  >
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* =================================================
                            FOOTER
                        ================================================= */}

            <div
              className="
                                flex
                                justify-end
                                gap-2
                                p-4
                                border-t
                                border-base-300
                            "
            >
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="
                                    btn
                                    btn-sm
                                    btn-ghost
                                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="
                                    btn
                                    btn-sm
                                    border-[#8BCF00]
                                    bg-[#8BCF00]
                                    text-white
                                    hover:bg-[#6FA800]
                                    hover:border-[#6FA800]
                                "
              >
                {loading ? "Saving..." : "Add Reminder"}
              </button>
            </div>
          </form>
        </div>

        {/* =================================================
                    BACKDROP
                ================================================= */}

        <form
          method="dialog"
          className="modal-backdrop"
          onClick={loading ? (event) => event.preventDefault() : onClose}
        >
          <button type="button" disabled={loading}>
            close
          </button>
        </form>
      </dialog>

      {/* =================================================
                SUCCESS / ERROR FEEDBACK
            ================================================= */}

      <FeedbackModal
        open={feedback.open}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onClose={closeFeedback}
      />
    </>
  );
}

export default ReminderModal;
