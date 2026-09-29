import React, { useEffect, useState } from 'react'

import { XMarkIcon } from '@heroicons/react/24/outline'

import { COLORS } from '../../../../../constants/colors'

import { getDefaultDSA, getBanks } from '../components/BankProcessingSection/Api'



function AssignBankModal({
    isOpen,
    onClose,
    onSubmit,
    applicationId,
}) {

    const [banks, setBanks] = useState([])
    const [loadingBanks, setLoadingBanks] = useState(false)
    const [selectedBank, setSelectedBank] = useState(null)
    const [bankSearch, setBankSearch] = useState('')
    const [isSaving, setIsSaving] =
        useState(false)
    const [dsa, setDsa] = useState(null)
    const [checkingDsa, setCheckingDsa] = useState(false)

    const [manualDsaCode, setManualDsaCode] = useState('')
    const [manualDsaName, setManualDsaName] = useState('')

    /* -------------------------------------------------
        RESET
    -------------------------------------------------- */

    useEffect(() => {
        if (!isOpen) return

        setSelectedBank(null)
        setDsa(null)
        setManualDsaCode('')
        setManualDsaName('')

        const fetchBanks = async () => {
            try {
                setLoadingBanks(true)

                const response = await getBanks()

                setBanks(response || [])
            } catch (error) {
                console.error('BANKS ERROR:', error)
            } finally {
                setLoadingBanks(false)
            }
        }

        fetchBanks()
    }, [isOpen])

    /* -------------------------------------------------
        SUBMIT
    -------------------------------------------------- */

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!selectedBank) {
            return
        }

        try {
            setIsSaving(true)

            if (onSubmit) {
                await onSubmit({
                    ...selectedBank,
                    dsa_id: dsa?.dsa_id || null,
                    dsa_code: dsa?.found
                        ? dsa.dsa_code
                        : manualDsaCode.trim() || null,
                    dsa_name: dsa?.found
                        ? dsa.dsa_name
                        : manualDsaName.trim() || null,
                })
            }
        } catch (error) {
            console.error(
                'Failed to assign bank:',
                error
            )
        } finally {
            setIsSaving(false)
        }
    }


    /* -------------------------------------------------
        CLOSE
    -------------------------------------------------- */

    const handleClose = () => {

        if (isSaving) {
            return
        }

        onClose()

    }


    if (!isOpen) {
        return null
    }

    const filteredBanks = banks.filter((bank) =>
        bank.name
            ?.toLowerCase()
            .includes(bankSearch.toLowerCase())
    )
    return (
        <div
            className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            p-4
        "
        >
            {/* BACKDROP */}
            <div
                className="
                absolute
                inset-0
                bg-black/40
                backdrop-blur-[1px]
            "
                onClick={handleClose}
            />

            {/* MODAL */}
            <div
                className="
                relative
                w-full
                max-w-lg
                bg-base-100
                rounded-2xl
                shadow-2xl
                border
                border-base-300
            "
            >
                {/* =================================================
                HEADER
            ================================================== */}
                <div
                    className="
                    flex
                    items-center
                    justify-between
                    px-6
                    py-4
                    border-b
                    border-base-300
                "
                >
                    <div>
                        <h2 className="text-lg font-semibold">
                            Assign Bank
                        </h2>

                        <p className="text-xs text-base-content/50 mt-1">
                            Select a bank for this application.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSaving}
                        className="
                        btn
                        btn-sm
                        btn-circle
                        btn-ghost
                    "
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* =================================================
                FORM
            ================================================== */}
                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-5 space-y-5">

                        {/* =================================================
                        BANK
                    ================================================== */}
                        <div>
                            <label className="label px-0 pt-0">
                                <span className="label-text font-medium">
                                    Select Bank
                                </span>
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    className="
                                    input
                                    input-bordered
                                    w-full
                                "
                                    placeholder="Search bank..."
                                    value={
                                        selectedBank
                                            ? selectedBank.name
                                            : bankSearch
                                    }
                                    onChange={(e) => {
                                        setSelectedBank(null)
                                        setDsa(null)
                                        setBankSearch(e.target.value)
                                    }}
                                    onFocus={() => {
                                        if (selectedBank) {
                                            setSelectedBank(null)
                                        }
                                    }}
                                    autoComplete="off"
                                />

                                {/* Loading */}
                                {loadingBanks && (
                                    <span
                                        className="
                                        loading
                                        loading-spinner
                                        loading-sm
                                        absolute
                                        right-3
                                        top-3
                                    "
                                    />
                                )}

                                {/* Dropdown */}
                                {!selectedBank &&
                                    !loadingBanks && (
                                        <div
                                            className="
                                            absolute
                                            z-50
                                            mt-1
                                            w-full
                                            rounded-lg
                                            border
                                            border-base-300
                                            bg-base-100
                                            shadow-xl
                                            max-h-52
                                            overflow-y-auto
                                        "
                                        >
                                            {filteredBanks.length > 0 ? (
                                                filteredBanks.map((bank) => (
                                                    <button
                                                        key={bank.id}
                                                        type="button"
                                                        className="
                                                        w-full
                                                        text-left
                                                        px-4
                                                        py-2.5
                                                        text-sm
                                                        hover:bg-base-200
                                                        transition-colors
                                                    "
                                                        onClick={async () => {
                                                            setSelectedBank(bank)
                                                            setBankSearch(bank.name)
                                                            setDsa(null)
                                                            setManualDsaCode('')
                                                            setManualDsaName('')

                                                            try {
                                                                setCheckingDsa(true)

                                                                const response =
                                                                    await getDefaultDSA(
                                                                        applicationId,
                                                                        bank.id
                                                                    )

                                                                setDsa(
                                                                    response?.data ||
                                                                    null
                                                                )
                                                            } catch (error) {
                                                                console.error(
                                                                    'DEFAULT DSA ERROR:',
                                                                    error
                                                                )
                                                            } finally {
                                                                setCheckingDsa(false)
                                                            }
                                                        }}
                                                    >
                                                        {bank.name}
                                                    </button>
                                                ))
                                            ) : (
                                                <p
                                                    className="
                                                    px-4
                                                    py-3
                                                    text-sm
                                                    text-base-content/50
                                                "
                                                >
                                                    {bankSearch
                                                        ? 'No banks found'
                                                        : 'No banks available'}
                                                </p>
                                            )}
                                        </div>
                                    )}
                            </div>
                        </div>

                        {/* =================================================
                        DSA
                    ================================================== */}
                        {selectedBank && (
                            <div>
                                <label className="label px-0 pt-0">
                                    <span className="label-text font-medium">
                                        DSA Details
                                    </span>
                                </label>

                                {checkingDsa && (
                                    <div
                                        className="
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        text-base-content/60
                                        py-2
                                    "
                                    >
                                        <span className="loading loading-spinner loading-xs" />
                                        Checking default DSA...
                                    </div>
                                )}

                                {!checkingDsa && dsa?.found && (
                                    <div
                                        className="
                                        rounded-lg
                                        border
                                        border-base-300
                                        bg-base-200/40
                                        px-4
                                        py-3
                                    "
                                    >
                                        <p className="text-sm font-medium">
                                            {dsa.dsa_name || '-'}
                                        </p>

                                        {dsa.dsa_code && (
                                            <p
                                                className="
                                                text-xs
                                                text-base-content/50
                                                mt-1
                                            "
                                            >
                                                Code: {dsa.dsa_code}
                                            </p>
                                        )}

                                        <p
                                            className="
                                            text-[11px]
                                            text-success
                                            mt-2
                                        "
                                        >
                                            Default DSA selected automatically
                                        </p>
                                    </div>
                                )}

                                {!checkingDsa &&
                                    !dsa?.found && (
                                        <div className="space-y-3">
                                            <p
                                                className="
                                                text-xs
                                                text-base-content/50
                                            "
                                            >
                                                No default DSA found. Enter DSA
                                                details manually.
                                            </p>

                                            <div>
                                                <label className="label px-0">
                                                    <span className="label-text text-xs">
                                                        DSA Code
                                                    </span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className="
                                                    input
                                                    input-bordered
                                                    input-sm
                                                    w-full
                                                "
                                                    value={manualDsaCode}
                                                    onChange={(e) =>
                                                        setManualDsaCode(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter DSA code"
                                                />
                                            </div>

                                            <div>
                                                <label className="label px-0">
                                                    <span className="label-text text-xs">
                                                        DSA Name
                                                    </span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className="
                                                    input
                                                    input-bordered
                                                    input-sm
                                                    w-full
                                                "
                                                    value={manualDsaName}
                                                    onChange={(e) =>
                                                        setManualDsaName(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter DSA name"
                                                />
                                            </div>
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>

                    {/* =================================================
                    FOOTER
                ================================================== */}
                    <div
                        className="
                        flex
                        items-center
                        justify-end
                        gap-3
                        px-6
                        py-4
                        border-t
                        border-base-300
                    "
                    >
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSaving}
                            className="
                            btn
                            btn-sm
                            btn-outline
                        "
                        >
                            CANCEL
                        </button>

                        <button
                            type="submit"
                            disabled={
                                isSaving ||
                                !selectedBank ||
                                checkingDsa
                            }
                            className="
                            btn
                            btn-sm
                            text-black
                            border-none
                        "
                            style={{
                                backgroundColor: COLORS.GREEN,
                            }}
                        >
                            {isSaving && (
                                <span
                                    className="
                                    loading
                                    loading-spinner
                                    loading-xs
                                "
                                />
                            )}

                            {isSaving
                                ? 'ASSIGNING...'
                                : 'ASSIGN BANK'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default AssignBankModal