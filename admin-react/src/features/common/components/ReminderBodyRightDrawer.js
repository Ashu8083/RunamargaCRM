// admin-react/src/features/common/components/ReminderBodyRightDrawer.js

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    setReminderStatus,
} from "../reminders/reminderDrawerSlice";

import apiClient from "../../../app/apiClient";

function formatScheduledAt(scheduledAt) {
    if (!scheduledAt) {
        return "Not specified";
    }

    const date = new Date(scheduledAt);

    if (Number.isNaN(date.getTime())) {
        return "Invalid date";
    }

    return date.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

function getStatusLabel(status) {
    switch (status) {
        case "pending":
            return "Pending";

        case "ringing":
            return "Ringing";

        case "completed":
            return "Acknowledged";

        case "cancelled":
            return "Cancelled";

        default:
            return "Unknown";
    }
}

function ReminderBodyRightDrawer() {
    const dispatch = useDispatch();

    /*
     * Redux already filters out completed/cancelled
     * reminders.
     *
     * We keep an additional frontend filter here as
     * a safety layer so terminal reminders can never
     * accidentally be rendered.
     */
    const reminders = useSelector(
        (state) =>
            state.reminderDrawer?.reminders ?? [],
    );

    const visibleReminders =
        reminders.filter(
            (reminder) =>
                reminder.backendStatus ===
                    "pending" ||
                reminder.status ===
                    "pending" ||
                reminder.status ===
                    "ringing",
        );

    const [updatingIds, setUpdatingIds] =
        useState([]);

    const [error, setError] =
        useState("");

    /**
     * Update reminder status.
     *
     * API:
     *
     * PATCH /reminders/{id}
     *
     * apiClient handles authentication:
     *
     *     401
     *       ↓
     * refreshAccessToken()
     *       ↓
     * retry PATCH
     */
    const updateReminderStatus = async (
        reminder,
        status,
    ) => {
        const id = String(
            reminder.id,
        );

        /*
         * Don't allow multiple requests for
         * the same reminder.
         */
        if (
            updatingIds.includes(id)
        ) {
            return;
        }

        /*
         * Only these backend statuses are
         * allowed from this drawer.
         */
        if (
            status !== "completed" &&
            status !== "cancelled"
        ) {
            return;
        }

        setUpdatingIds(
            (current) => [
                ...current,
                id,
            ],
        );

        setError("");

        try {
            /*
             * Use apiClient rather than raw fetch().
             *
             * This means an expired access token
             * can be refreshed automatically.
             */
            await apiClient.patch(
                `/reminders/${encodeURIComponent(id)}`,
                {
                    status,
                },
            );

            /*
             * Backend update succeeded.
             *
             * setReminderStatus() now removes the
             * reminder from Redux immediately when
             * status is completed/cancelled.
             */
            dispatch(
                setReminderStatus({
                    id,
                    status,
                }),
            );

        } catch (err) {
            console.error(
                "[Reminder] Failed to update status:",
                err,
            );

            /*
             * Axios error response.
             */
            const responseData =
                err?.response?.data;

            let message =
                "Unable to update reminder status.";

            if (
                typeof responseData ===
                    "string" &&
                responseData
            ) {
                message =
                    responseData;
            } else if (
                responseData?.detail
            ) {
                message =
                    responseData.detail;
            } else if (
                err?.message
            ) {
                message =
                    err.message;
            }

            setError(message);
        } finally {
            setUpdatingIds(
                (current) =>
                    current.filter(
                        (itemId) =>
                            itemId !== id,
                    ),
            );
        }
    };

    /*
     * No pending/ringing reminders.
     */
    if (
        visibleReminders.length === 0
    ) {
        return (
            <div className="py-10 text-center text-base-content/60">
                <p className="text-lg font-semibold">
                    No reminders
                </p>

                <p className="mt-1 text-sm">
                    Your reminders will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 py-4">
            {error && (
                <p
                    className="alert alert-error text-sm"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {visibleReminders.map(
                (reminder) => {
                    const isRinging =
                        reminder.status ===
                        "ringing";

                    const isPending =
                        reminder.backendStatus ===
                            "pending" ||
                        reminder.status ===
                            "pending";

                    const isUpdating =
                        updatingIds.includes(
                            String(
                                reminder.id,
                            ),
                        );

                    /*
                     * Cancel is allowed for both:
                     *
                     *     pending
                     *     ringing
                     *
                     * because both are still backend
                     * status = pending.
                     */
                    const canCancel =
                        isPending &&
                        !isUpdating;

                    /*
                     * Acknowledge is available only
                     * when the reminder is actually due.
                     */
                    const canAcknowledge =
                        isRinging &&
                        !isUpdating;

                    return (
                        <article
                            key={
                                reminder.id
                            }
                            className={[
                                "rounded-xl border p-4 shadow-sm transition-all duration-300",

                                isRinging
                                    ? "border-error bg-error/10 ring-2 ring-error/40 animate-pulse"
                                    : "border-base-300 bg-base-100",
                            ].join(" ")}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="font-semibold text-base-content">
                                    {
                                        reminder.title
                                    }
                                </h3>

                                <span
                                    className={[
                                        "badge badge-sm shrink-0",

                                        isRinging
                                            ? "badge-error"
                                            : "badge-info",
                                    ].join(
                                        " ",
                                    )}
                                >
                                    {getStatusLabel(
                                        reminder.status,
                                    )}
                                </span>
                            </div>

                            {reminder.description && (
                                <p className="mt-2 text-sm text-base-content/70">
                                    {
                                        reminder.description
                                    }
                                </p>
                            )}

                            <p className="mt-3 text-sm text-base-content/60">
                                <span className="font-medium">
                                    Scheduled:
                                </span>{" "}
                                {formatScheduledAt(
                                    reminder.scheduledAt,
                                )}
                            </p>

                            {isRinging && (
                                <p
                                    className="mt-3 font-semibold text-error"
                                    role="status"
                                >
                                    Reminder is due!
                                </p>
                            )}

                            <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-error btn-outline"
                                    disabled={
                                        !canCancel
                                    }
                                    onClick={() =>
                                        updateReminderStatus(
                                            reminder,
                                            "cancelled",
                                        )
                                    }
                                >
                                    {isUpdating
                                        ? "Updating..."
                                        : "Cancel"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-success"
                                    disabled={
                                        !canAcknowledge
                                    }
                                    onClick={() =>
                                        updateReminderStatus(
                                            reminder,
                                            "completed",
                                        )
                                    }
                                >
                                    {isUpdating
                                        ? "Updating..."
                                        : "Acknowledge"}
                                </button>
                            </div>
                        </article>
                    );
                },
            )}
        </div>
    );
}

export default ReminderBodyRightDrawer;