// admin-react/src/components/GlobalChat.jsx

import { useEffect, useRef, useState } from 'react'
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
} from '../../../pages/Loans/ViewApplication/components/Teamchat/Api'

const EMOJIS = [
    '😀', '😃', '😄', '😁', '😆', '😅',
    '😂', '🤣', '😊', '😇', '🙂', '🙃',
    '😉', '😌', '😍', '🥰', '😘', '😗',
    '😙', '😚', '😋', '😛', '😝', '😜',
    '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟',
    '😕', '🙁', '☹️', '😣', '😖', '😫',
    '😩', '🥺', '😢', '😭', '😤', '😠',
    '😡', '🤬', '🤯', '😳', '🥵', '🥶',
    '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🫡', '🤭', '🤫', '🤥', '😶',
    '😐', '😑', '😬', '🙄', '😯', '😦',
    '😧', '😮', '😲', '🥱', '😴', '🤤',
    '😪', '😵', '🤐', '🥴', '🤢', '🤮',
    '🤧', '😷', '🤒', '🤕', '👍', '👎',
    '👏', '🙌', '🙏', '❤️', '💚', '💙',
    '💯', '🔥', '✨', '🎉', '✅', '❌',
    '⭐', '💰', '📞', '📌', '💡', '🚀',
]


function GlobalChat({
    open,
    onClose,
    loanId,
    agentId,
    customerName = 'Customer',
    customerPhone = '',
}) {

    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)

    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const messagesEndRef = useRef(null)
    const emojiPickerRef = useRef(null)


    // =========================================================
    // LOAD CHAT
    // =========================================================

    useEffect(() => {
        if (!open || !loanId) {
            return
        }

        const loadChat = async () => {
            try {
                setLoading(true)

                const response = await getTeamChat(
                    loanId
                )

                console.log(
                    'TEAM CHAT RESPONSE:',
                    response
                )
                const chatMessages = response?.data || []

                const formattedMessages = chatMessages.map(
                    (item) => ({
                        id: item.id,

                        senderName:
                            item.sender_name || 'Team Member',

                        senderType: 'team_member',

                        message:
                            item.message_text || '',

                        attachment: item.file_name
                            ? {
                                name: item.file_name,
                                type:
                                    item.file_mime_type || '',
                                size:
                                    item.file_size || 0,
                            }
                            : null,

                        createdAt: item.created_at
                            ? new Date(
                                item.created_at
                            ).toLocaleTimeString(
                                'en-IN',
                                {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }
                            )
                            : '',

                        dateLabel: item.created_at
                            ? new Date(
                                item.created_at
                            ).toLocaleDateString(
                                'en-IN',
                                {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                }
                            )
                            : '',
                    })
                )

                setMessages(formattedMessages)

            } catch (error) {
                console.error(
                    'TEAM CHAT LOAD ERROR:',
                    error
                )

                setMessages([])
            } finally {
                setLoading(false)
            }
        }

        loadChat()

        setMessage('')
        setShowEmojiPicker(false)

    }, [open, loanId])
    // =========================================================
    // CLOSE EMOJI PICKER WHEN CLICKING OUTSIDE
    // =========================================================

    useEffect(() => {

        const handleOutsideClick = (event) => {

            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(
                    event.target
                )
            ) {

                setShowEmojiPicker(false)

            }

        }


        if (showEmojiPicker) {

            document.addEventListener(
                'mousedown',
                handleOutsideClick
            )

        }


        return () => {

            document.removeEventListener(
                'mousedown',
                handleOutsideClick
            )

        }

    }, [showEmojiPicker])


    // =========================================================
    // SCROLL TO BOTTOM
    // =========================================================

    useEffect(() => {

        if (!open) {
            return
        }


        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
        })

    }, [messages, open])


    // =========================================================
    // SELECT EMOJI
    // =========================================================

    const handleEmojiSelect = (emoji) => {

        setMessage((previous) =>
            `${previous}${emoji}`
        )

    }



    // =========================================================
    // SEND MESSAGE
    // =========================================================

    const handleSend = async () => {
        const value = message.trim()

        if (
            !value ||
            loading ||
            !loanId
        ) {
            return
        }

        try {
            setLoading(true)

            await sendTeamChat(
                loanId,
                {
                    message_text: value,
                    message_type: 'text',
                }
            )

            const response = await getTeamChat(
                loanId
            )

            const chatMessages =
                response?.data || []

            const formattedMessages =
                chatMessages.map(
                    (item) => ({
                        id: item.id,

                        senderName:
                            item.sender_name ||
                            'User',

                        senderType:
                            item.sender_admin_id
                                ? 'team_member'
                                : 'team_member',

                        message:
                            item.message_text ||
                            '',

                        attachment: null,

                        createdAt:
                            item.created_at
                                ? new Date(
                                    item.created_at
                                ).toLocaleTimeString(
                                    'en-IN',
                                    {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }
                                )
                                : '',

                        dateLabel:
                            item.created_at
                                ? new Date(
                                    item.created_at
                                ).toLocaleDateString(
                                    'en-IN',
                                    {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    }
                                )
                                : '',
                    })
                )

            setMessages(
                formattedMessages
            )

            setMessage('')
            setShowEmojiPicker(false)

        } catch (error) {
            console.error(
                'TEAM CHAT SEND ERROR:',
                error
            )
        } finally {
            setLoading(false)
        }
    }
    // =========================================================
    // KEYBOARD
    // =========================================================

    const handleKeyDown = (event) => {

        if (
            event.key === 'Enter' &&
            !event.shiftKey
        ) {

            event.preventDefault()

            handleSend()

        }

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        console.log(
            'Refresh chat',
            {
                loanId,
                agentId,
            }
        )

    }


    // =========================================================
    // CALL
    // =========================================================

    const handleCall = () => {

        if (!customerPhone) {
            return
        }


        window.location.href =
            `tel:${customerPhone}`

    }


    // =========================================================
    // FILE SIZE
    // =========================================================

    const formatFileSize = (bytes) => {

        if (!bytes) {
            return '0 KB'
        }


        if (bytes < 1024) {
            return `${bytes} B`
        }


        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`
        }


        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`

    }


    // =========================================================
    // CLOSE
    // =========================================================

    if (!open) {
        return null
    }


    return (

        <div className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/50
            p-4 m-0
        ">
            {/* =====================================================
                CHAT CONTAINER
            ===================================================== */}

            <div className="
                flex
                h-[680px]
                w-full
                max-w-[900px]
                max-h-[calc(100vh-32px)]
                flex-col
                overflow-hidden
                rounded-[20px]
                border
                border-base-300
                bg-base-100
                shadow-2xl
            ">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    flex
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-base-300
                    bg-base-100
                    px-4
                    py-3
                    sm:px-5
                ">

                    <div className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-[#8BCF00]/40
                            bg-[#8BCF00]/10
                        ">

                            <UserGroupIcon
                                className="
                                    h-5
                                    w-5
                                    text-[#398A2F]
                                "
                            />

                        </div>


                        <div className="min-w-0">

                            <h2 className="
                                truncate
                                text-lg
                                font-semibold
                                leading-5
                                text-base-content
                            ">
                                Team Chat
                            </h2>


                            <p className="
                                mt-0.5
                                truncate
                                text-xs
                                text-base-content/60
                            ">

                                {customerName}

                                {customerPhone && (
                                    <>
                                        {' • '}
                                        {customerPhone}
                                    </>
                                )}

                            </p>

                        </div>

                    </div>


                    <div className="
                        flex
                        shrink-0
                        items-center
                        gap-1.5
                        sm:gap-2
                    ">

                        <div className="
                            hidden
                            items-center
                            gap-2
                            sm:flex
                        ">

                            <span className="
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-[#A8D5A2]
                            " />


                            <span className="
                                rounded-full
                                border
                                border-[#8BCF00]/30
                                bg-[#8BCF00]/10
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-[#398A2F]
                            ">

                                {messages.length} messages

                            </span>

                        </div>


                        {/* Refresh */}

                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-base-300
                                bg-base-100
                                transition
                                hover:bg-base-200
                            "
                            title="Refresh chat"
                        >

                            <ArrowPathIcon className="
                                h-4.5
                                w-4.5
                                text-base-content/70
                            " />

                        </button>


                        {/* Call */}

                        <button
                            type="button"
                            onClick={handleCall}
                            disabled={!customerPhone}
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-base-300
                                bg-base-100
                                transition
                                hover:bg-base-200
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                            title="Call"
                        >

                            <PhoneIcon className="
                                h-4.5
                                w-4.5
                                text-base-content/70
                            " />

                        </button>


                        {/* Close */}

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-base-300
                                bg-base-100
                                transition
                                hover:bg-base-200
                            "
                            title="Close"
                        >

                            <XMarkIcon className="
                                h-4.5
                                w-4.5
                                text-base-content/70
                            " />

                        </button>

                    </div>

                </div>


                {/* =================================================
                    MESSAGES
                ================================================= */}

                <div className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    bg-base-100
                    px-4
                    py-3
                    sm:px-5
                    sm:py-4
                ">

                    {messages.length === 0 ? (

                        <div className="
                            flex
                            h-full
                            items-center
                            justify-center
                        ">

                            <div className="text-center">

                                <UserGroupIcon className="
                                    mx-auto
                                    h-10
                                    w-10
                                    text-base-content/20
                                " />

                                <p className="
                                    mt-3
                                    text-sm
                                    font-medium
                                    text-base-content/60
                                ">
                                    No messages yet
                                </p>

                                <p className="
                                    mt-1
                                    text-xs
                                    text-base-content/40
                                ">
                                    Start a conversation with the team.
                                </p>

                            </div>

                        </div>

                    ) : (

                        <div className="
                            mx-auto
                            flex
                            max-w-5xl
                            flex-col
                            gap-3
                        ">

                            {/* DATE DIVIDER */}

                            <div className="
                                flex
                                items-center
                                gap-3
                                py-1
                            ">

                                <div className="
                                    h-px
                                    flex-1
                                    bg-base-300
                                " />


                                <span className="
                                    rounded-full
                                    border
                                    border-base-300
                                    bg-base-200
                                    px-4
                                    py-1
                                    text-[11px]
                                    font-semibold
                                    text-base-content/60
                                ">
                                    Yesterday
                                </span>


                                <div className="
                                    h-px
                                    flex-1
                                    bg-base-300
                                " />

                            </div>


                            {messages.map((item) => {

                                const isCurrentUser =
                                    item.senderType === 'current_user'


                                return (

                                    <div
                                        key={item.id}
                                        className={`
                                            flex
                                            gap-2.5
                                            ${isCurrentUser
                                                ? 'justify-end'
                                                : 'justify-start'
                                            }
                                        `}
                                    >

                                        {!isCurrentUser && (

                                            <div className="
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-[#09B889]
                                                text-xs
                                                font-semibold
                                                text-white
                                            ">

                                                {item.senderName
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || 'U'}

                                            </div>

                                        )}


                                        <div className={`
                                            max-w-[80%]
                                            sm:max-w-[65%]
                                            ${isCurrentUser
                                                ? 'items-end'
                                                : 'items-start'
                                            }
                                        `}>

                                            <p className="
                                                mb-1
                                                px-1
                                                text-xs
                                                font-semibold
                                                text-base-content/70
                                            ">
                                                {item.senderName}
                                            </p>


                                            <div className={`
                                                rounded-[18px]
                                                border
                                                px-4
                                                py-3
                                                ${isCurrentUser
                                                    ? 'border-[#8BCF00]/20 bg-[#8BCF00]/10'
                                                    : 'border-base-300 bg-base-100'
                                                }
                                            `}>

                                                {item.message && (

                                                    <p className="
                                                        whitespace-pre-wrap
                                                        break-words
                                                        text-sm
                                                        leading-5
                                                        text-base-content
                                                    ">
                                                        {item.message}
                                                    </p>

                                                )}


                                                {/* Sent attachment */}

                                                {item.attachment && (

                                                    <div className={`
                                                        flex
                                                        items-center
                                                        gap-2.5
                                                        rounded-lg
                                                        border
                                                        px-3
                                                        py-2
                                                        ${item.message
                                                            ? 'mt-2'
                                                            : ''
                                                        }
                                                        border-base-300
                                                        bg-base-200/50
                                                    `}>

                                                        <PaperClipIcon className="
                                                            h-4
                                                            w-4
                                                            shrink-0
                                                            text-base-content/60
                                                        " />


                                                        <div className="
                                                            min-w-0
                                                        ">

                                                            <p className="
                                                                truncate
                                                                text-xs
                                                                font-medium
                                                            ">
                                                                {item.attachment.name}
                                                            </p>


                                                            <p className="
                                                                text-[11px]
                                                                text-base-content/45
                                                            ">
                                                                {formatFileSize(
                                                                    item.attachment.size
                                                                )}
                                                            </p>

                                                        </div>

                                                    </div>

                                                )}


                                                <p className="
                                                    mt-2
                                                    text-[11px]
                                                    text-base-content/45
                                                ">
                                                    {item.createdAt}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                )

                            })}


                            <div ref={messagesEndRef} />

                        </div>

                    )}

                </div>


                {/* =================================================
                    INPUT AREA
                ================================================= */}

                <div className="
                    relative
                    shrink-0
                    border-t
                    border-base-300
                    bg-base-100
                    px-3
                    py-3
                    sm:px-4
                ">

                    {/* =================================================
                        EMOJI PICKER
                    ================================================= */}

                    {showEmojiPicker && (

                        <div
                            ref={emojiPickerRef}
                            className="
                                absolute
                                bottom-[68px]
                                left-3
                                z-50
                                w-[300px]
                                max-w-[calc(100vw-24px)]
                                rounded-2xl
                                border
                                border-base-300
                                bg-base-100
                                p-3
                                shadow-2xl
                                sm:left-4
                            "
                        >

                            <div className="
                                mb-2
                                flex
                                items-center
                                justify-between
                                border-b
                                border-base-300
                                pb-2
                            ">

                                <p className="
                                    text-sm
                                    font-semibold
                                ">
                                    Emojis
                                </p>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowEmojiPicker(false)
                                    }
                                    className="
                                        flex
                                        h-7
                                        w-7
                                        items-center
                                        justify-center
                                        rounded-full
                                        hover:bg-base-200
                                    "
                                >

                                    <XMarkIcon className="
                                        h-4
                                        w-4
                                    " />

                                </button>

                            </div>


                            <div className="
                                grid
                                max-h-64
                                grid-cols-8
                                gap-1
                                overflow-y-auto
                                pr-1
                            ">

                                {EMOJIS.map((emoji, index) => (

                                    <button
                                        key={`${emoji}-${index}`}
                                        type="button"
                                        onClick={() =>
                                            handleEmojiSelect(
                                                emoji
                                            )
                                        }
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            items-center
                                            justify-center
                                            rounded-lg
                                            text-xl
                                            transition
                                            hover:bg-base-200
                                        "
                                    >
                                        {emoji}
                                    </button>

                                ))}

                            </div>

                        </div>

                    )}


                    <div className="
                        flex
                        items-center
                        gap-2
                    ">




                        {/* Emoji */}

                        <div
                            ref={emojiPickerRef}
                            className="
                                relative
                                shrink-0
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    setShowEmojiPicker(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                className={`
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-base-300
                                    bg-base-100
                                    transition
                                    hover:bg-base-200
                                    ${showEmojiPicker
                                        ? 'bg-base-200 text-[#78B300]'
                                        : ''
                                    }
                                `}
                                title="Emoji"
                                aria-label="Open emoji picker"
                            >

                                <FaceSmileIcon className="
                                    h-5
                                    w-5
                                    text-base-content/60
                                " />

                            </button>

                        </div>


                        {/* Input */}

                        <div className="
                            flex
                            min-w-0
                            flex-1
                            items-center
                            rounded-full
                            bg-base-200
                            px-4
                        ">

                            <input
                                type="text"
                                value={message}
                                onChange={(event) =>
                                    setMessage(
                                        event.target.value
                                    )
                                }
                                onKeyDown={handleKeyDown}
                                placeholder="Message team members..."
                                className="
                                    w-full
                                    bg-transparent
                                    py-3
                                    text-sm
                                    outline-none
                                    placeholder:text-base-content/40
                                "
                            />

                        </div>


                        {/* Send */}

                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={
                                (
                                    !message.trim()
                                ) ||
                                loading
                            }
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-[#E5E5E5]
                                transition
                                hover:bg-[#D9D9D9]
                                disabled:cursor-not-allowed
                                disabled:opacity-70
                            "
                            title="Send message"
                        >

                            <PaperAirplaneIcon className="
                                h-5
                                w-5
                                text-base-content/40
                            " />

                        </button>

                    </div>

                </div>

            </div>

        </div>

    )

}


export default GlobalChat
