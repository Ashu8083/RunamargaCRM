// admin-react/src/features/common/reminders/reminderData_API.js

import apiClient from "../../../app/apiClient";
import {
    clearAuthSession,
    refreshAccessToken,
} from "../../../app/auth";

import { WS_BASE_URL } from "../../../config/url";

const RECONNECT_DELAY_MS = 3000;
const MAX_RECONNECT_DELAY_MS = 30000;

/*
 * Prevent multiple refresh requests from running
 * at the same time.
 */
let refreshRequest = null;

/**
 * Refresh authentication using the existing
 * HttpOnly refresh-token cookie.
 */
async function refreshAuthentication() {
    if (refreshRequest) {
        return refreshRequest;
    }

    refreshRequest = refreshAccessToken()
        .finally(() => {
            refreshRequest = null;
        });

    return refreshRequest;
}

/**
 * Fetch existing reminders from the backend.
 *
 * Uses the existing apiClient.
 *
 * Therefore:
 *
 *     GET /api/reminders
 *             ↓
 *          401
 *             ↓
 *     apiClient interceptor
 *             ↓
 *     refreshAccessToken()
 *             ↓
 *       retry request
 */
export async function fetchReminders() {
    const response = await apiClient.get(
        "/reminders"
    );

    const result = response.data;

    /*
     * Backend normally returns:
     *
     * {
     *     items: [...],
     *     total: 2
     * }
     */

    if (Array.isArray(result)) {
        return result;
    }

    if (Array.isArray(result.items)) {
        return result.items;
    }

    if (Array.isArray(result.reminders)) {
        return result.reminders;
    }

    if (Array.isArray(result.data)) {
        return result.data;
    }

    throw new Error(
        "Unexpected reminder-list API response format"
    );
}

/**
 * Connect to the authenticated reminder WebSocket.
 *
 * Browser automatically sends the authentication
 * cookies during the WebSocket handshake.
 *
 * If the WebSocket disconnects:
 *
 *     WebSocket disconnect
 *             ↓
 *     refreshAccessToken()
 *             ↓
 *     reconnect WebSocket
 */
export function connectReminderWebSocket({
    onMessage,
    onStatusChange,
} = {}) {
    let socket = null;
    let reconnectTimer = null;

    let reconnectDelay = RECONNECT_DELAY_MS;

    let stopped = false;
    let reconnectInProgress = false;

    const notifyStatus = (status) => {
        onStatusChange?.(status);
    };

    /**
     * Authentication refresh failed.
     */
    const handleAuthenticationFailure = (error) => {
        console.error(
            "[Reminder WebSocket] Authentication refresh failed:",
            error
        );

        notifyStatus("authentication-failed");

        clearAuthSession();

        if (
            typeof window !== "undefined" &&
            window.location.pathname !== "/login"
        ) {
            window.location.href = "/login";
        }
    };

    /**
     * Schedule WebSocket reconnect.
     */
    const scheduleReconnect = () => {
        if (
            stopped ||
            reconnectTimer !== null
        ) {
            return;
        }

        const delay = reconnectDelay;

        notifyStatus("reconnecting");

        reconnectTimer = window.setTimeout(() => {
            reconnectTimer = null;

            if (!stopped) {
                connect();
            }
        }, delay);

        reconnectDelay = Math.min(
            reconnectDelay * 2,
            MAX_RECONNECT_DELAY_MS
        );
    };

    /**
     * Refresh authentication and then reconnect.
     */
    const refreshAndReconnect = async () => {
        if (
            stopped ||
            reconnectInProgress
        ) {
            return;
        }

        reconnectInProgress = true;

        try {
            notifyStatus(
                "refreshing-authentication"
            );

            await refreshAuthentication();

            if (stopped) {
                return;
            }

            notifyStatus(
                "authentication-refreshed"
            );

            scheduleReconnect();
        } catch (error) {
            handleAuthenticationFailure(error);
        } finally {
            reconnectInProgress = false;
        }
    };

    /**
     * Create WebSocket connection.
     */
    const connect = () => {
        if (stopped) {
            return;
        }

        if (
            typeof window === "undefined" ||
            typeof window.WebSocket === "undefined"
        ) {
            notifyStatus("unsupported");
            return;
        }

        /*
         * Don't create another WebSocket if one
         * is already connecting or open.
         */
        if (
            socket &&
            (
                socket.readyState ===
                    WebSocket.CONNECTING ||
                socket.readyState ===
                    WebSocket.OPEN
            )
        ) {
            return;
        }

        const baseUrl =
            WS_BASE_URL.replace(
                /\/+$/,
                ""
            );

        const currentSocket =
            new WebSocket(
                `${baseUrl}/reminders/ws`
            );

        socket = currentSocket;

        notifyStatus("connecting");

        /**
         * WebSocket connected.
         */
        currentSocket.onopen = () => {
            /*
             * Successful connection.
             *
             * Reset exponential reconnect delay.
             */
            reconnectDelay =
                RECONNECT_DELAY_MS;

            notifyStatus("connected");

            console.info(
                "[Reminder WebSocket] connected"
            );
        };

        /**
         * WebSocket message received.
         */
        currentSocket.onmessage = (
            event
        ) => {
            try {
                const message =
                    JSON.parse(
                        event.data
                    );

                console.info(
                    "[Reminder WebSocket] message:",
                    message
                );

                onMessage?.(message);
            } catch (error) {
                console.error(
                    "[Reminder WebSocket] Invalid message:",
                    event.data
                );

                notifyStatus(
                    "invalid-message"
                );
            }
        };

        /**
         * WebSocket error.
         */
        currentSocket.onerror = (
            error
        ) => {
            console.error(
                "[Reminder WebSocket] error:",
                error
            );

            notifyStatus("error");
        };

        /**
         * WebSocket closed.
         */
        currentSocket.onclose = async (
            event
        ) => {
            if (
                socket === currentSocket
            ) {
                socket = null;
            }

            if (stopped) {
                return;
            }

            console.warn(
                "[Reminder WebSocket] disconnected:",
                {
                    code: event.code,
                    reason: event.reason,
                    wasClean: event.wasClean,
                }
            );

            notifyStatus(
                "disconnected"
            );

            /*
             * Before reconnecting, refresh the
             * authentication session.
             */
            await refreshAndReconnect();
        };
    };

    /*
     * Start WebSocket immediately.
     */
    connect();

    /**
     * Cleanup function.
     */
    return () => {
        stopped = true;

        if (
            reconnectTimer !== null
        ) {
            window.clearTimeout(
                reconnectTimer
            );

            reconnectTimer = null;
        }

        if (socket) {
            const currentSocket =
                socket;

            socket = null;

            /*
             * Remove handlers before closing.
             *
             * This prevents our intentional cleanup
             * from triggering another reconnect.
             */
            currentSocket.onopen = null;
            currentSocket.onmessage = null;
            currentSocket.onerror = null;
            currentSocket.onclose = null;

            currentSocket.close();
        }

        notifyStatus("closed");
    };
}