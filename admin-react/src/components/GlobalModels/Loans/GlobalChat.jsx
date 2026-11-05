// admin-react\src\components\GlobalModels\Loans\GlobalChat.jsx


import { Fragment, useCallback, useEffect, useRef, useState } from 'react'

import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import PaperClipIcon from '@heroicons/react/24/outline/PaperClipIcon'
import FaceSmileIcon from '@heroicons/react/24/outline/FaceSmileIcon'
import PaperAirplaneIcon from '@heroicons/react/24/outline/PaperAirplaneIcon'

import {
    getTeamChat,
    sendTeamChat,
} from '../../../pages/crm/Loans/ViewApplication/components/Teamchat/Api'

import {
    getActiveContext,
    getStoredUser,
} from '../../../app/auth'
import { WS_BASE_URL } from '../../../config/url'

const EMOJIS = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
    '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
    '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
    '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
    '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
    '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
    '😰', '😥', '😓', '🤗', '🤔', '🫡', '🤭', '🤫',
    '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦',
    '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵',
    '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕',
    '👍', '👎', '👏', '🙌', '🙏', '❤️', '💚', '💙',
    '💯', '🔥', '✨', '🎉', '✅', '❌', '⭐', '💰',
    '📞', '📌', '💡', '🚀',
]

// NORMALIZE IDS
const normalizeId = (id) =>
    id === null || id === undefined ? null : String(id).trim()

const getLocalDateKey = (date) => [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
].join('-')

const formatDateSeparator = (date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    const dateKey = getLocalDateKey(date)

    if (dateKey === getLocalDateKey(today)) return 'Today'
    if (dateKey === getLocalDateKey(yesterday)) return 'Yesterday'

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

// FORMAT MESSAGE
const formatMessage = (item, currentEmployeeContextId) => {
    const date = item.created_at
        ? new Date(item.created_at)
        : null
    const hasValidDate = date && !isNaN(date.getTime())

    const senderContextId = normalizeId(item.sender_admin_id)
    const currentContextId = normalizeId(currentEmployeeContextId)

    const isCurrentUser =
        senderContextId !== null &&
        currentContextId !== null &&
        senderContextId === currentContextId

    return {
        id: item.id,
        senderContextId,

        senderName:
            item.sender_name ||
            item.sender?.name ||
            item.employee_name ||
            'Team Member',

        senderContextName:
            item.sender_context_name ||
            item.sender_context?.name ||
            item.context_name ||
            '',

        // WhatsApp alignment
        senderType: isCurrentUser
            ? 'current_user'
            : 'team_member',

        message: item.message_text || '',
        attachment: item.attachment || null,

        createdAt: hasValidDate
            ? date.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
            })
            : '',

        dateKey: hasValidDate ? getLocalDateKey(date) : null,
        dateLabel: hasValidDate ? formatDateSeparator(date) : '',
    }
}

// FILE SIZE
const formatFileSize = (bytes = 0) => {
    if (bytes < 1024) return `${bytes} B`

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function GlobalChat({
    open,
    onClose,
    loanId,
    agentId,
    currentEmployeeContextId,
    customerName = 'Customer',
    customerPhone = '',
}) {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [wsConnected, setWsConnected] = useState(false)

    const storedUser = getStoredUser()
    const activeContext = getActiveContext(storedUser)
    const effectiveEmployeeContextId =
        currentEmployeeContextId ?? activeContext?.id ?? null

    const messagesEndRef = useRef(null)
    const emojiPickerRef = useRef(null)

    const socketRef = useRef(null)
    const activeRef = useRef(false)

    // LOAD CHAT HISTORY
    const loadMessages = useCallback(async () => {
        if (!loanId) return

        try {
            const response = await getTeamChat(loanId)

            const formatted = (response?.data || []).map(item =>
                formatMessage(item, effectiveEmployeeContextId)
            )

            setMessages(formatted)
        } catch (error) {
            console.error('TEAM CHAT LOAD ERROR:', error)
        }
    }, [loanId, effectiveEmployeeContextId])

    // WEBSOCKET CONNECTION
    useEffect(() => {
        if (!open || !loanId) return

        activeRef.current = true

        loadMessages()

        const ws = new WebSocket(
            `${WS_BASE_URL}/team-chat/${encodeURIComponent(loanId)}/chat/ws${
                effectiveEmployeeContextId
                    ? `?context_id=${encodeURIComponent(effectiveEmployeeContextId)}`
                    : ''
            }`
        )

        socketRef.current = ws

        ws.onopen = () => {
            if (!activeRef.current) return

            setWsConnected(true)
        }

        ws.onmessage = (event) => {
            if (!activeRef.current) return

            try {
                const response = JSON.parse(event.data)

                if (!response?.success || !response?.data) return

                const formatted = formatMessage(
                    response.data,
                    effectiveEmployeeContextId
                )

                setMessages(previous => {
                    if (
                        previous.some(
                            item => String(item.id) === String(formatted.id)
                        )
                    ) {
                        return previous
                    }

                    return [...previous, formatted]
                })
            } catch (error) {
                console.error('TEAM CHAT MESSAGE ERROR:', error)
            }
        }

        ws.onerror = (error) => {
            console.error('TEAM CHAT WEBSOCKET ERROR:', error)
        }

        ws.onclose = () => {
            setWsConnected(false)
        }

        return () => {
            activeRef.current = false
            socketRef.current = null

            ws.close()
            setWsConnected(false)
        }
    }, [
        open,
        loanId,
        effectiveEmployeeContextId,
        loadMessages,
    ])

    // CLOSE EMOJI PICKER ON OUTSIDE CLICK
    useEffect(() => {
        if (!showEmojiPicker) return

        const handleOutsideClick = (event) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false)
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [showEmojiPicker])

    // AUTO SCROLL
    useEffect(() => {
        if (open) {
            messagesEndRef.current?.scrollIntoView({
                behavior: 'smooth',
            })
        }
    }, [messages, open])

    // SEND MESSAGE
    const handleSend = async () => {
        const value = message.trim()

        if (!value || loading || !loanId) return

        try {
            setLoading(true)

            await sendTeamChat(loanId, {
                message_text: value,
                message_type: 'text',
            })

            setMessage('')
            setShowEmojiPicker(false)

            // WebSocket should broadcast the saved message.
            // Reload only if the backend does not provide a usable
            // WebSocket connection.
            if (
                !socketRef.current ||
                socketRef.current.readyState !== WebSocket.OPEN
            ) {
                await loadMessages()
            }

        } catch (error) {
            console.error('TEAM CHAT SEND ERROR:', error)
        } finally {
            setLoading(false)
        }
    }

    // KEYBOARD
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSend()
        }
    }

    // CALL CUSTOMER
    const handleCall = () => {
        if (customerPhone) {
            window.location.href = `tel:${customerPhone}`
        }
    }

    // SELECT EMOJI
    const handleEmojiSelect = (emoji) => {
        setMessage(previous => previous + emoji)
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[9999] m-0 flex items-center justify-center bg-black/50 p-4">

            <div className="flex h-[680px] max-h-[calc(100vh-32px)] w-full max-w-[900px] flex-col overflow-hidden rounded-[20px] border border-base-300 bg-base-100 shadow-2xl">

                {/* HEADER */}
                <div className="flex shrink-0 items-center justify-between border-b border-base-300 px-4 py-3 sm:px-5">

                    <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#8BCF00]/40 bg-[#8BCF00]/10">
                            <UserGroupIcon className="h-5 w-5 text-[#398A2F]" />
                        </div>

                        <div className="min-w-0">
                            <h2 className="truncate text-lg font-semibold text-base-content">
                                Team Chat
                            </h2>

                            <p className="mt-0.5 truncate text-xs text-base-content/60">
                                {customerName}
                                {customerPhone && ` • ${customerPhone}`}
                            </p>
                        </div>

                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">

                        <div className="hidden items-center gap-2 sm:flex">

                            <span className={`h-2.5 w-2.5 rounded-full ${
                                wsConnected ? 'bg-green-500' : 'bg-red-400'
                            }`} />

                            <span className="rounded-full border border-[#8BCF00]/30 bg-[#8BCF00]/10 px-3 py-1 text-xs font-medium text-[#398A2F]">
                                {messages.length} messages
                            </span>

                        </div>

                        <button
                            type="button"
                            onClick={loadMessages}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-base-300 hover:bg-base-200"
                            title="Refresh chat"
                        >
                            <ArrowPathIcon className="h-4.5 w-4.5 text-base-content/70" />
                        </button>

                        <button
                            type="button"
                            onClick={handleCall}
                            disabled={!customerPhone}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-base-300 hover:bg-base-200 disabled:opacity-40"
                            title="Call"
                        >
                            <PhoneIcon className="h-4.5 w-4.5 text-base-content/70" />
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-base-300 hover:bg-base-200"
                            title="Close"
                        >
                            <XMarkIcon className="h-4.5 w-4.5 text-base-content/70" />
                        </button>

                    </div>
                </div>

                {/* MESSAGES */}
                <div className="min-h-0 flex-1 overflow-y-auto bg-base-100 px-4 py-3 sm:px-5 sm:py-4">

                    {messages.length === 0 ? (

                        <div className="flex h-full items-center justify-center">
                            <div className="text-center">
                                <UserGroupIcon className="mx-auto h-10 w-10 text-base-content/20" />

                                <p className="mt-3 text-sm font-medium text-base-content/60">
                                    No messages yet
                                </p>

                                <p className="mt-1 text-xs text-base-content/40">
                                    Start a conversation with the team.
                                </p>
                            </div>
                        </div>

                    ) : (

                        <div className="mx-auto flex max-w-5xl flex-col gap-3">

                            {messages.map((item, index) => {

                                const isCurrentUser =
                                    item.senderType === 'current_user'
                                const previousDateKey =
                                    messages[index - 1]?.dateKey
                                const showDateSeparator =
                                    item.dateKey &&
                                    item.dateKey !== previousDateKey

                                return (
                                    <Fragment key={item.id}>

                                        {showDateSeparator && (
                                            <div className="flex justify-center py-1">
                                                <span className="rounded-full bg-base-200 px-3 py-1 text-[11px] font-medium text-base-content/60">
                                                    {item.dateLabel}
                                                </span>
                                            </div>
                                        )}

                                    <div
                                        className={`flex w-full items-end gap-2.5 ${
                                            isCurrentUser
                                                ? 'justify-end'
                                                : 'justify-start'
                                        }`}
                                    >

                                        {/* OTHER EMPLOYEE AVATAR */}
                                        {!isCurrentUser && (
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#09B889] text-xs font-semibold text-white">
                                                {item.senderName.charAt(0).toUpperCase()}
                                            </div>
                                        )}

                                        {/* MESSAGE */}
                                        <div className={`flex max-w-[80%] flex-col sm:max-w-[65%] ${
                                            isCurrentUser
                                                ? 'items-end'
                                                : 'items-start'
                                        }`}>

                                            {/* SENDER NAME */}
                                            <p className="mb-1 px-1 text-xs font-semibold text-base-content/70">
                                                {item.senderName}
                                                {item.senderContextName &&
                                                    ` (${item.senderContextName})`}
                                            </p>

                                            {/* MESSAGE BUBBLE */}
                                            <div className={`rounded-[18px] border px-4 py-3 ${
                                                isCurrentUser
                                                    ? 'border-[#8BCF00]/20 bg-[#8BCF00]/10'
                                                    : 'border-base-300 bg-base-100'
                                            }`}>

                                                {item.message && (
                                                    <p className="whitespace-pre-wrap break-words text-sm leading-5 text-base-content">
                                                        {item.message}
                                                    </p>
                                                )}

                                                {item.attachment && (
                                                    <div className={`flex items-center gap-2.5 rounded-lg border border-base-300 bg-base-200/50 px-3 py-2 ${
                                                        item.message ? 'mt-2' : ''
                                                    }`}>

                                                        <PaperClipIcon className="h-4 w-4 shrink-0 text-base-content/60" />

                                                        <div className="min-w-0">
                                                            <p className="truncate text-xs font-medium">
                                                                {item.attachment.name}
                                                            </p>

                                                            <p className="text-[11px] text-base-content/45">
                                                                {formatFileSize(item.attachment.size)}
                                                            </p>
                                                        </div>

                                                    </div>
                                                )}

                                                <p className="mt-2 text-right text-[11px] text-base-content/45">
                                                    {item.createdAt}
                                                </p>

                                            </div>
                                        </div>

                                    </div>
                                    </Fragment>
                                )
                            })}

                            <div ref={messagesEndRef} />

                        </div>
                    )}

                </div>

                {/* INPUT AREA */}
                <div className="relative shrink-0 border-t border-base-300 bg-base-100 px-3 py-3 sm:px-4">

                    {/* EMOJI PICKER */}
                    {showEmojiPicker && (
                        <div
                            ref={emojiPickerRef}
                            className="absolute bottom-[68px] left-3 z-50 w-[300px] max-w-[calc(100vw-24px)] rounded-2xl border border-base-300 bg-base-100 p-3 shadow-2xl sm:left-4"
                        >

                            <div className="mb-2 flex items-center justify-between border-b border-base-300 pb-2">

                                <p className="text-sm font-semibold">
                                    Emojis
                                </p>

                                <button
                                    type="button"
                                    onClick={() => setShowEmojiPicker(false)}
                                    className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-base-200"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>

                            </div>

                            <div className="grid max-h-64 grid-cols-8 gap-1 overflow-y-auto pr-1">

                                {EMOJIS.map((emoji, index) => (
                                    <button
                                        key={`${emoji}-${index}`}
                                        type="button"
                                        onClick={() => handleEmojiSelect(emoji)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-xl hover:bg-base-200"
                                    >
                                        {emoji}
                                    </button>
                                ))}

                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2">

                        {/* EMOJI BUTTON */}
                        <div className="relative shrink-0">
                            <button
                                type="button"
                                onClick={() => setShowEmojiPicker(previous => !previous)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300 hover:bg-base-200"
                                title="Emoji"
                                aria-label="Open emoji picker"
                            >
                                <FaceSmileIcon className="h-5 w-5 text-base-content/60" />
                            </button>
                        </div>

                        {/* INPUT */}
                        <div className="flex min-w-0 flex-1 items-center rounded-full bg-base-200 px-4">
                            <input
                                type="text"
                                value={message}
                                onChange={event => setMessage(event.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Message team members..."
                                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-base-content/40"
                            />
                        </div>

                        {/* SEND */}
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={!message.trim() || loading}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E5E5E5] hover:bg-[#D9D9D9] disabled:cursor-not-allowed disabled:opacity-70"
                            title="Send message"
                        >
                            <PaperAirplaneIcon className="h-5 w-5 text-base-content/40" />
                        </button>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default GlobalChat
