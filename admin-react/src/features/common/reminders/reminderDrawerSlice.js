// admin-react/src/features/common/reminders/reminderDrawerSlice.js

import { createSlice } from "@reduxjs/toolkit";

const TERMINAL_STATUSES = new Set([
  "completed",
  "cancelled",
]);

const initialState = {
  header: "",
  isOpen: false,
  reminders: [],
};

/**
 * Convert backend status into one of the supported
 * backend statuses.
 */
function mapBackendStatus(status) {
  if (
    status === "completed" ||
    status === "cancelled"
  ) {
    return status;
  }

  return "pending";
}

/**
 * Normalize one reminder from the backend/WebSocket.
 *
 * Backend status:
 *
 *     pending
 *     completed
 *     cancelled
 *
 * Frontend display status:
 *
 *     pending
 *     ringing
 *     completed
 *     cancelled
 *
 * "ringing" is NOT sent to the backend.
 */
function normalizeReminder(
  data,
  existing = null,
) {
  const note =
    data.note ??
    data.description ??
    existing?.description ??
    "";

  const scheduledAt =
    data.reminder_at ??
    data.reminderAt ??
    data.scheduledAt ??
    existing?.scheduledAt ??
    null;

  const backendStatus = mapBackendStatus(
    data.status ??
      existing?.backendStatus ??
      existing?.status,
  );

  const scheduledTime = scheduledAt
    ? Date.parse(scheduledAt)
    : NaN;

  const isDue =
    backendStatus === "pending" &&
    Number.isFinite(scheduledTime) &&
    scheduledTime <= Date.now();

  /*
   * Keep created_at so we can sort newest reminders first.
   */
  const createdAt =
    data.created_at ??
    data.createdAt ??
    existing?.createdAt ??
    null;

  return {
    id: String(
      data.id ??
        data.reminder_id ??
        existing?.id,
    ),

    title:
      note.trim() || "Reminder",

    description: note,

    scheduledAt,

    createdAt,

    applicationId:
      data.application_id ??
      data.applicationId ??
      existing?.applicationId ??
      null,

    employeeId:
      data.employee_id ??
      data.employeeId ??
      existing?.employeeId ??
      null,

    backendStatus,

    /*
     * Terminal backend statuses should never normally
     * reach Redux because they are filtered out.
     */
    status: TERMINAL_STATUSES.has(
      backendStatus,
    )
      ? backendStatus
      : isDue
        ? "ringing"
        : "pending",
  };
}

/**
 * Sort reminders with the newest reminder first.
 *
 * Primary:
 *     created_at DESC
 *
 * Fallback:
 *     id DESC
 */
function sortNewestFirst(reminders) {
  return reminders.sort((a, b) => {
    const aCreated = a.createdAt
      ? Date.parse(a.createdAt)
      : NaN;

    const bCreated = b.createdAt
      ? Date.parse(b.createdAt)
      : NaN;

    if (
      Number.isFinite(aCreated) &&
      Number.isFinite(bCreated)
    ) {
      return bCreated - aCreated;
    }

    if (Number.isFinite(bCreated)) {
      return 1;
    }

    if (Number.isFinite(aCreated)) {
      return -1;
    }

    const aId = Number(a.id);
    const bId = Number(b.id);

    if (
      Number.isFinite(aId) &&
      Number.isFinite(bId)
    ) {
      return bId - aId;
    }

    return 0;
  });
}

const reminderDrawerSlice = createSlice({
  name: "reminderDrawer",

  initialState,

  reducers: {
    /**
     * Open reminder drawer.
     */
    openReminderDrawer: (
      state,
      action,
    ) => {
      state.isOpen = true;

      state.header =
        action.payload?.header ||
        "Reminders";
    },

    /**
     * Close reminder drawer.
     */
    closeReminderDrawer: (state) => {
      state.isOpen = false;
      state.header = "";
    },

    /**
     * Load reminders from GET /api/reminders.
     *
     * IMPORTANT:
     * Only pending reminders are stored.
     *
     * completed/cancelled reminders are ignored.
     */
    setReminders: (
      state,
      action,
    ) => {
      const reminders =
        action.payload;

      if (!Array.isArray(reminders)) {
        return;
      }

      const normalizedReminders =
        reminders
          .filter(
            (item) =>
              item?.id != null,
          )
          .map((item) => {
            const id = String(
              item.id,
            );

            const existing =
              state.reminders.find(
                (reminder) =>
                  String(
                    reminder.id,
                  ) === id,
              );

            return normalizeReminder(
              item,
              existing,
            );
          })
          /*
           * NEVER show completed or cancelled
           * reminders in the drawer.
           */
          .filter(
            (reminder) =>
              reminder.backendStatus ===
              "pending",
          );

      state.reminders =
        sortNewestFirst(
          normalizedReminders,
        );
    },

    /**
     * Check whether pending reminders
     * have reached their scheduled time.
     *
     * This changes:
     *
     *     pending → ringing
     *
     * It does NOT change the backend status.
     */
    checkDueReminders: (
      state,
      action,
    ) => {
      const now = Number(
        action.payload ??
          Date.now(),
      );

      if (!Number.isFinite(now)) {
        return;
      }

      for (const reminder of state.reminders) {
        /*
         * Only pending backend reminders
         * can become ringing.
         */
        if (
          reminder.backendStatus !==
          "pending"
        ) {
          continue;
        }

        const scheduledTime =
          Date.parse(
            reminder.scheduledAt,
          );

        if (
          Number.isFinite(
            scheduledTime,
          ) &&
          scheduledTime <= now
        ) {
          reminder.status =
            "ringing";
        }
      }
    },

    /**
     * Handle a reminder WebSocket event.
     */
    receiveReminderEvent: (
      state,
      action,
    ) => {
      const event =
        action.payload;

      if (!event) {
        return;
      }

      /*
       * Supports:
       *
       * {
       *   event: "...",
       *   data: {...}
       * }
       *
       * and direct payloads.
       */
      const data =
        event.data ?? event;

      const reminderId =
        data.id ??
        data.reminder_id;

      if (reminderId == null) {
        return;
      }

      const id = String(
        reminderId,
      );

      const existing =
        state.reminders.find(
          (reminder) =>
            String(
              reminder.id,
            ) === id,
        );

      /*
       * IMPORTANT:
       *
       * Our database trigger currently sends only:
       *
       *     event
       *     reminder_id
       *     employee_id
       *
       * for the WebSocket event.
       *
       * Therefore, an ID-only UPDATE for an existing
       * reminder cannot tell us whether it became
       * completed/cancelled.
       *
       * In that situation, ignore the event here.
       * useReminderAlarm can refetch the API.
       */
      const hasReminderDetails =
        data.note != null ||
        data.description != null ||
        data.reminder_at != null ||
        data.reminderAt != null ||
        data.scheduledAt != null ||
        data.status != null;

      if (
        !hasReminderDetails &&
        !existing
      ) {
        return;
      }

      /*
       * If backend explicitly tells us:
       *
       * completed
       * cancelled
       *
       * remove it immediately.
       */
      if (
        data.status ===
          "completed" ||
        data.status ===
          "cancelled"
      ) {
        state.reminders =
          state.reminders.filter(
            (reminder) =>
              String(
                reminder.id,
              ) !== id,
          );

        return;
      }

      /*
       * Existing reminder.
       */
      if (existing) {
        const normalized =
          normalizeReminder(
            data,
            existing,
          );

        /*
         * Terminal status should never
         * remain in the drawer.
         */
        if (
          normalized.backendStatus ===
            "completed" ||
          normalized.backendStatus ===
            "cancelled"
        ) {
          state.reminders =
            state.reminders.filter(
              (reminder) =>
                String(
                  reminder.id,
                ) !== id,
            );

          return;
        }

        Object.assign(
          existing,
          normalized,
        );

        state.reminders =
          sortNewestFirst(
            state.reminders,
          );

        return;
      }

      /*
       * New reminder.
       *
       * Only add it if its backend status
       * is pending.
       */
      const normalized =
        normalizeReminder(data);

      if (
        normalized.backendStatus !==
        "pending"
      ) {
        return;
      }

      state.reminders.unshift(
        normalized,
      );

      state.reminders =
        sortNewestFirst(
          state.reminders,
        );
    },

    /**
     * Called after the backend confirms
     * a status update.
     *
     * completed/cancelled reminders are
     * immediately removed from the drawer.
     */
    setReminderStatus: (
      state,
      action,
    ) => {
      const {
        id,
        status,
      } = action.payload ?? {};

      if (
        id == null ||
        ![
          "pending",
          "completed",
          "cancelled",
        ].includes(status)
      ) {
        return;
      }

      /*
       * Terminal statuses should disappear
       * immediately.
       */
      if (
        status === "completed" ||
        status === "cancelled"
      ) {
        state.reminders =
          state.reminders.filter(
            (reminder) =>
              String(
                reminder.id,
              ) !== String(id),
          );

        return;
      }

      /*
       * Pending status.
       */
      const reminder =
        state.reminders.find(
          (item) =>
            String(
              item.id,
            ) === String(id),
        );

      if (!reminder) {
        return;
      }

      reminder.backendStatus =
        "pending";

      /*
       * Recalculate whether it should
       * currently be ringing.
       */
      const scheduledTime =
        Date.parse(
          reminder.scheduledAt,
        );

      reminder.status =
        Number.isFinite(
          scheduledTime,
        ) &&
        scheduledTime <=
          Date.now()
          ? "ringing"
          : "pending";

      state.reminders =
        sortNewestFirst(
          state.reminders,
        );
    },

    /**
     * Remove a reminder manually.
     */
    removeReminder: (
      state,
      action,
    ) => {
      const id = String(
        action.payload,
      );

      state.reminders =
        state.reminders.filter(
          (reminder) =>
            String(
              reminder.id,
            ) !== id,
        );
    },
  },
});

export const {
  openReminderDrawer,
  closeReminderDrawer,
  setReminders,
  checkDueReminders,
  receiveReminderEvent,
  setReminderStatus,
  removeReminder,
} = reminderDrawerSlice.actions;

export default reminderDrawerSlice.reducer;