// admin-react/src/features/common/reminders/useReminderAlarm.js

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  checkDueReminders,
  setReminders,
} from "./reminderDrawerSlice";

import {
  connectReminderWebSocket,
  fetchReminders,
} from "./reminderData_API";

const CHECK_INTERVAL_MS = 250;
const RINGTONE_URL = "/sounds/reminder-ringtone.mp3";

export default function useReminderAlarm() {
  const dispatch = useDispatch();
  const audioRef = useRef(null);

  const reminders = useSelector(
    (state) =>
      state.reminderDrawer?.reminders ?? [],
  );

  /*
   * Audio should continue playing when at least
   * one reminder is currently ringing.
   */
  const hasRingingReminder = reminders.some(
    (reminder) =>
      reminder.status === "ringing",
  );

  /*
   * =========================================================
   * 1. INITIAL REMINDER LOAD
   * =========================================================
   *
   * Load reminders when the hook starts.
   *
   * fetchReminders() uses apiClient, so:
   *
   *     401
   *      ↓
   * refreshAccessToken()
   *      ↓
   * retry GET /api/reminders
   *
   * setReminders() filters out completed/cancelled
   * reminders and keeps only pending reminders.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadReminders() {
      try {
        const data =
          await fetchReminders();

        if (!cancelled) {
          dispatch(
            setReminders(data),
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load reminders:",
            error,
          );
        }
      }
    }

    loadReminders();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  /*
   * =========================================================
   * 2. WEBSOCKET
   * =========================================================
   *
   * When PostgreSQL sends:
   *
   *     REMINDER_CREATED
   *     REMINDER_UPDATED
   *     REMINDER_DUE
   *
   * fetch the complete reminder list again.
   *
   * This is important because the PostgreSQL trigger
   * can send only:
   *
   *     reminder_id
   *     employee_id
   *
   * After the API refresh:
   *
   *     pending     → remains in drawer
   *     completed   → removed
   *     cancelled   → removed
   */
  useEffect(() => {
    let cancelled = false;

    /*
     * Prevent multiple API requests from running
     * simultaneously.
     */
    let refreshInProgress = false;

    /*
     * If another WebSocket event arrives while an
     * API refresh is running, perform another refresh
     * after the current one finishes.
     */
    let refreshAgain = false;

    async function refreshReminders() {
      if (cancelled) {
        return;
      }

      /*
       * A refresh is already running.
       *
       * Don't start another request immediately.
       * Just remember that another refresh is needed.
       */
      if (refreshInProgress) {
        refreshAgain = true;
        return;
      }

      refreshInProgress = true;

      try {
        do {
          refreshAgain = false;

          const data =
            await fetchReminders();

          if (!cancelled) {
            /*
             * setReminders() is responsible for:
             *
             * - keeping pending reminders
             * - removing completed reminders
             * - removing cancelled reminders
             * - sorting newest reminders first
             */
            dispatch(
              setReminders(data),
            );
          }
        } while (
          refreshAgain &&
          !cancelled
        );
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to refresh reminders after WebSocket event:",
            error,
          );
        }
      } finally {
        refreshInProgress = false;
      }
    }

    const disconnect =
      connectReminderWebSocket({
        onStatusChange(status) {
          console.info(
            "[Reminder WebSocket]",
            status,
          );
        },

        onMessage(message) {
          console.info(
            "[Reminder WebSocket] Message received:",
            message,
          );

          const event =
            message?.event ??
            message?.type;

          switch (event) {
            /*
             * New reminder created.
             *
             * Fetch the list so the new reminder
             * appears in the drawer.
             */
            case "REMINDER_CREATED":
              refreshReminders();
              break;

            /*
             * Reminder changed.
             *
             * This covers:
             *
             *     pending
             *     completed
             *     cancelled
             *
             * After fetching:
             *
             *     completed/cancelled
             *     are removed by setReminders().
             */
            case "REMINDER_UPDATED":
              refreshReminders();
              break;

            /*
             * Keep existing functionality for
             * REMINDER_DUE.
             */
            case "REMINDER_DUE":
              refreshReminders();
              break;

            default:
              console.debug(
                "[Reminder WebSocket] Ignored event:",
                event,
              );
          }
        },
      });

    return () => {
      cancelled = true;

      disconnect();
    };
  }, [dispatch]);

  /*
   * =========================================================
   * 3. LOCAL DUE CHECK
   * =========================================================
   *
   * This keeps the existing 250ms local reminder
   * checking behavior.
   *
   * pending
   *    ↓
   * scheduled time reached
   *    ↓
   * ringing
   */
  useEffect(() => {
    /*
     * Check immediately when the hook starts.
     */
    dispatch(
      checkDueReminders(
        Date.now(),
      ),
    );

    const intervalId =
      window.setInterval(() => {
        dispatch(
          checkDueReminders(
            Date.now(),
          ),
        );
      }, CHECK_INTERVAL_MS);

    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, [dispatch]);

  /*
   * =========================================================
   * 4. CREATE AUDIO INSTANCE
   * =========================================================
   *
   * Keep the existing looping ringtone behavior.
   */
  useEffect(() => {
    const audio =
      new Audio(
        RINGTONE_URL,
      );

    audio.loop = true;
    audio.preload = "auto";

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  /*
   * =========================================================
   * 5. PLAY / STOP RINGTONE
   * =========================================================
   *
   * If at least one reminder is ringing:
   *
   *     play ringtone
   *
   * Otherwise:
   *
   *     stop ringtone
   */
  useEffect(() => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    if (hasRingingReminder) {
      audio.loop = true;

      audio
        .play()
        .catch(() => {
          /*
           * Browser may block autoplay until
           * the user interacts with the page.
           */
        });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [hasRingingReminder]);

  /*
   * =========================================================
   * 6. AUDIO UNLOCK
   * =========================================================
   *
   * Keep the existing behavior that attempts to unlock
   * audio after the first user interaction.
   */
  useEffect(() => {
    const unlockAudio = () => {
      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

      /*
       * If a reminder is already ringing,
       * immediately try to play it.
       */
      if (hasRingingReminder) {
        audio
          .play()
          .catch(() => {});

        return;
      }

      /*
       * Otherwise perform a muted playback once
       * to unlock audio for future reminders.
       */
      audio.muted = true;

      audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
        })
        .catch(() => {
          audio.muted = false;
        });
    };

    document.addEventListener(
      "pointerdown",
      unlockAudio,
    );

    document.addEventListener(
      "keydown",
      unlockAudio,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        unlockAudio,
      );

      document.removeEventListener(
        "keydown",
        unlockAudio,
      );
    };
  }, [hasRingingReminder]);
}