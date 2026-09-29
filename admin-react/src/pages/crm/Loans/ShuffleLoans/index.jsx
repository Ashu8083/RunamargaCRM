// admin-react/src/pages/Loans/ShuffleLoans/index.jsx

import {
    useState,
} from 'react'

import FeedbackModal from '../../../../components/GlobalModels/FeedbackModal'

import ShuffleLoansTable from './components/ShuffleLoansTable'
import AssignShuffleLoansModal from './components/AssignShuffleLoansModal'

import {
    assignShuffleLoans,
    getApiErrorMessage,
} from './API'


function ShuffleLoans() {

    // =========================================================
    // APPLICATION DATA
    // =========================================================

    const [
        applications,
        setApplications,
    ] = useState([])


    // =========================================================
    // LOADING
    // =========================================================

    const [
        loading,
        setLoading,
    ] = useState(true)


    // =========================================================
    // ASSIGNING
    // =========================================================

    const [
        assigning,
        setAssigning,
    ] = useState(false)


    // =========================================================
    // PAGINATION DATA
    // =========================================================
    //
    // These values come from the backend.
    //
    // The table controls:
    //
    //     page
    //     limit
    //     filters
    //
    // and reports the loaded page back here.
    //
    // =========================================================

    const [
        pagination,
        setPagination,
    ] = useState({
        total: 0,
        page: 1,
        limit: 30,
        totalPages: 0,
    })


    // =========================================================
    // SELECTED APPLICATIONS
    // =========================================================

    const [
        selectedApplicationIds,
        setSelectedApplicationIds,
    ] = useState([])


    // =========================================================
    // ASSIGN MODAL
    // =========================================================

    const [
        showAssignModal,
        setShowAssignModal,
    ] = useState(false)


    // =========================================================
    // ASSIGN MODAL DATA
    // =========================================================
    //
    // We keep the currently selected applications here so the
    // assign modal can continue to work with the rows currently
    // selected by the user.
    //
    // The table will provide the selected rows through
    // handleSelectionChange.
    //
    // =========================================================

    const [
        selectedApplications,
        setSelectedApplications,
    ] = useState([])


    // =========================================================
    // FEEDBACK
    // =========================================================

    const [
        feedback,
        setFeedback,
    ] = useState({
        open: false,
        type: 'info',
        title: '',
        message: '',
    })


    const showFeedback = (
        type,
        title,
        message
    ) => {

        setFeedback({
            open: true,
            type,
            title,
            message,
        })
    }


    const closeFeedback = () => {

        setFeedback((previous) => ({
            ...previous,
            open: false,
        }))
    }


    // =========================================================
    // TABLE DATA LOADED
    // =========================================================
    //
    // ShuffleLoansTable performs the actual backend request.
    //
    // This callback receives:
    //
    //     items
    //     total
    //     page
    //     limit
    //     totalPages
    //
    // =========================================================

    const handleDataLoaded = (
        data
    ) => {

        const items =
            Array.isArray(
                data?.items
            )
                ? data.items
                : []


        setApplications(
            items
        )


        setPagination({
            total:
                Number(
                    data?.total ??
                    0
                ),

            page:
                Number(
                    data?.page ??
                    1
                ),

            limit:
                Number(
                    data?.limit ??
                    30
                ),

            totalPages:
                Number(
                    data?.totalPages ??
                    0
                ),
        })


        setLoading(false)


        // -----------------------------------------------------
        // Remove selections that no longer exist in the
        // currently loaded dataset.
        //
        // IMPORTANT:
        //
        // We do NOT automatically clear selections here.
        // Existing selections are preserved where possible.
        //
        // -----------------------------------------------------

        setSelectedApplications(
            (previous) =>
                previous.filter(
                    (application) =>
                        items.some(
                            (item) =>
                                item.id ===
                                application.id
                        )
                )
        )
    }


    // =========================================================
    // TABLE LOADING STATE
    // =========================================================

    const handleLoadingChange = (
        value
    ) => {

        setLoading(
            Boolean(value)
        )
    }


    // =========================================================
    // SELECT APPLICATION
    // =========================================================

    const handleSelectApplication = (
        application
    ) => {

        if (
            !application?.id
        ) {
            return
        }


        setSelectedApplicationIds(
            (previous) => {

                if (
                    previous.includes(
                        application.id
                    )
                ) {

                    return previous.filter(
                        (id) =>
                            id !==
                            application.id
                    )
                }


                return [
                    ...previous,
                    application.id,
                ]
            }
        )


        setSelectedApplications(
            (previous) => {

                const exists =
                    previous.some(
                        (item) =>
                            item.id ===
                            application.id
                    )


                if (exists) {

                    return previous.filter(
                        (item) =>
                            item.id !==
                            application.id
                    )
                }


                return [
                    ...previous,
                    application,
                ]
            }
        )
    }


    // =========================================================
    // SELECT ALL
    // =========================================================
    //
    // Select all applies to the currently displayed page.
    //
    // Backend pagination means the frontend only has the
    // current page available.
    //
    // =========================================================

    const handleSelectAll = (
        pageApplications
    ) => {

        const currentApplications =
            Array.isArray(
                pageApplications
            )
                ? pageApplications
                : []


        const currentIds =
            currentApplications.map(
                (application) =>
                    application.id
            )


        if (
            currentIds.length === 0
        ) {
            return
        }


        const allSelected =
            currentIds.every(
                (id) =>
                    selectedApplicationIds.includes(
                        id
                    )
            )


        if (allSelected) {

            setSelectedApplicationIds(
                (previous) =>
                    previous.filter(
                        (id) =>
                            !currentIds.includes(
                                id
                            )
                    )
            )


            setSelectedApplications(
                (previous) =>
                    previous.filter(
                        (application) =>
                            !currentIds.includes(
                                application.id
                            )
                    )
            )

            return
        }


        setSelectedApplicationIds(
            (previous) => [
                ...new Set([
                    ...previous,
                    ...currentIds,
                ]),
            ]
        )


        setSelectedApplications(
            (previous) => {

                const existingIds =
                    new Set(
                        previous.map(
                            (application) =>
                                application.id
                        )
                    )


                const newApplications =
                    currentApplications.filter(
                        (application) =>
                            !existingIds.has(
                                application.id
                            )
                    )


                return [
                    ...previous,
                    ...newApplications,
                ]
            }
        )
    }


    // =========================================================
    // OPEN ASSIGN MODAL
    // =========================================================

    const handleOpenAssignModal = () => {

        if (
            selectedApplicationIds.length === 0
        ) {

            showFeedback(
                'warning',
                'No Applications Selected',
                'Select at least one application before assigning.'
            )

            return
        }


        setShowAssignModal(
            true
        )
    }


    // =========================================================
    // CLOSE ASSIGN MODAL
    // =========================================================

    const handleCloseAssignModal = () => {

        if (
            assigning
        ) {
            return
        }


        setShowAssignModal(
            false
        )
    }


    // =========================================================
    // ASSIGN / SHUFFLE
    // =========================================================

    const handleAssignSubmit = async (
        data
    ) => {

        if (
            !selectedApplicationIds.length
        ) {
            return
        }


        try {

            setAssigning(
                true
            )


            const updatedApplications =
                await assignShuffleLoans({
                    applicationIds:
                        selectedApplicationIds,

                    agentId:
                        data.agentId,

                    rmId:
                        data.rmId,

                    loanTypeId:
                        data.loanTypeId,
                })


            // -------------------------------------------------
            // Update applications currently loaded on the page.
            // -------------------------------------------------

            if (
                Array.isArray(
                    updatedApplications
                ) &&
                updatedApplications.length
            ) {

                const updatedMap =
                    new Map(
                        updatedApplications.map(
                            (application) => [
                                application.id,
                                application,
                            ]
                        )
                    )


                setApplications(
                    (previous) =>
                        previous.map(
                            (application) =>
                                updatedMap.get(
                                    application.id
                                ) ||
                                application
                        )
                )


                setSelectedApplications(
                    (previous) =>
                        previous.map(
                            (application) =>
                                updatedMap.get(
                                    application.id
                                ) ||
                                application
                        )
                )

            }


            setSelectedApplicationIds(
                []
            )


            setSelectedApplications(
                []
            )


            setShowAssignModal(
                false
            )


            showFeedback(
                'success',
                'Applications Updated',
                `${selectedApplicationIds.length} application${
                    selectedApplicationIds.length !== 1
                        ? 's'
                        : ''
                } updated successfully.`
            )

        } catch (
            error
        ) {

            showFeedback(
                'error',
                'Assignment Failed',
                getApiErrorMessage(
                    error,
                    'Unable to update selected applications.'
                )
            )

        } finally {

            setAssigning(
                false
            )
        }
    }


    // =========================================================
    // REFRESH
    // =========================================================
    //
    // The actual refresh request is handled by the table.
    //
    // This callback is kept for the existing table structure
    // and can be triggered from the refresh button.
    //
    // =========================================================

    const handleRefresh = () => {

        setSelectedApplicationIds(
            []
        )

        setSelectedApplications(
            []
        )
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className="
                space-y-5
                p-4
                sm:p-6
            "
        >

            {/* =================================================
                TABLE
            ================================================= */}

            <ShuffleLoansTable
                applications={
                    applications
                }

                loading={
                    loading
                }

                pagination={
                    pagination
                }

                selectedApplicationIds={
                    selectedApplicationIds
                }

                onSelectApplication={
                    handleSelectApplication
                }

                onSelectAll={
                    handleSelectAll
                }

                onDataLoaded={
                    handleDataLoaded
                }

                onLoadingChange={
                    handleLoadingChange
                }

                onRefresh={
                    handleRefresh
                }

                onOpenAssignModal={
                    handleOpenAssignModal
                }

                assigning={
                    assigning
                }
            />


            {/* =================================================
                ASSIGN MODAL
            ================================================= */}

            <AssignShuffleLoansModal
                open={
                    showAssignModal
                }

                applications={
                    selectedApplications
                }

                onClose={
                    handleCloseAssignModal
                }

                onSubmit={
                    handleAssignSubmit
                }
            />


            {/* =================================================
                FEEDBACK
            ================================================= */}

            <FeedbackModal
                open={
                    feedback.open
                }

                type={
                    feedback.type
                }

                title={
                    feedback.title
                }

                message={
                    feedback.message
                }

                onClose={
                    closeFeedback
                }
            />

        </div>
    )
}


export default ShuffleLoans