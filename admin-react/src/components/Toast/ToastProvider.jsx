// src/components/Toast/ToastProvider.jsx
import { createContext, useContext, useState } from "react"

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {

    const [toast, setToast] = useState(null)

    const showSuccess = (message) => {
        setToast({
            type: "success",
            message,
        })
    }

    const showError = (message) => {
        setToast({
            type: "error",
            message,
        })
    }

    const showWarning = (message) => {
        setToast({
            type: "warning",
            message,
        })
    }

    const showInfo = (message) => {
        setToast({
            type: "info",
            message,
        })
    }

    const closeToast = () => {
        setToast(null)
    }

    return (
        <ToastContext.Provider
            value={{
                showSuccess,
                showError,
                showWarning,
                showInfo,
                closeToast,
            }}
        >

            {children}

            {toast && (
                <div className="fixed right-5 top-5 z-[9999]">
                    <div
                        className={`
                            alert
                            shadow-lg
                            ${
                                toast.type === "success"
                                    ? "alert-success"
                                    : toast.type === "error"
                                    ? "alert-error"
                                    : toast.type === "warning"
                                    ? "alert-warning"
                                    : "alert-info"
                            }
                        `}
                    >
                        <span>{toast.message}</span>

                        <button
                            type="button"
                            onClick={closeToast}
                            className="btn btn-ghost btn-xs"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

        </ToastContext.Provider>
    )
}

export const useToast = () => {

    const context = useContext(ToastContext)

    if (!context) {
        throw new Error(
            "useToast must be used inside ToastProvider"
        )
    }

    return context
}