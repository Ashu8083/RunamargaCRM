// admin-react/src/pages/BanksAndDSA/Banks/index.jsx

import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'

import BanksTable from './components/BanksTable'
import BankModal from './components/BankModal'
import {
    getBanks,
    createBank,
    updateBank,
    deleteBank,
} from './Api'


function Banks() {

    // =========================================================
    // BANK DATA
    // =========================================================

    // const [banks, setBanks] = useState([
    //     {
    //         id: 1,
    //         name: 'HDFC Bank',
    //         status: 'active',
    //     },
    //     {
    //         id: 2,
    //         name: 'ICICI Bank',
    //         status: 'active',
    //     },
    //     {
    //         id: 3,
    //         name: 'Axis Bank',
    //         status: 'active',
    //     },
    //     {
    //         id: 4,
    //         name: 'State Bank of India',
    //         status: 'active',
    //     },
    //     {
    //         id: 5,
    //         name: 'Kotak Mahindra Bank',
    //         status: 'inactive',
    //     },
    // ])


    // =========================================================
    // FILTER STATE
    // =========================================================

    // const [search, setSearch] = useState('')
    //
    // const [selectedStatus, setSelectedStatus] =
    //     useState('')

    const [banks, setBanks] = useState([])
    const [search, setSearch] =
        useState('')
    const [selectedStatus, setSelectedStatus] =
        useState('')

    const [selectedBank, setSelectedBank] =
        useState(null)
    const [showBankModal, setShowBankModal] =
        useState(false)

    // =========================================================
    // MODAL STAT
    // ========================================================
    const fetchBanks = async () => {
    try {
        const data = await getBanks()

        console.log(
            'BANK API DATA:',
            data
        )

        setBanks(data)

    } catch (error) {
        console.error(
            'Failed to fetch banks:',
            error
        )
    }
}
     useEffect(() => {
        fetchBanks()
    }, [])


    // =========================================================
    // FILTERED BANKS
    // =========================================================

    const filteredBanks = useMemo(() => {

        const searchValue =

            search

                .trim()

                .toLowerCase()

        return banks.filter((bank) => {

            // -----------------------------------------------------

            // SEARCH BY BANK NAME

            // -----------------------------------------------------

            if (searchValue) {

                const bankName =

                    String(

                        bank.name || ''

                    ).toLowerCase()

                if (

                    !bankName.includes(

                        searchValue

                    )

                ) {

                    return false

                }

            }

            // -----------------------------------------------------

            // STATUS FILTER

            // -----------------------------------------------------

            if (selectedStatus) {

                const status =

                    bank.is_active

                        ? 'active'

                        : 'inactive'

                if (

                    status !== selectedStatus

                ) {

                    return false

                }

            }

            return true

        })

    }, [

        banks,

        search,

        selectedStatus,

    ])



    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const handleClearFilters = () => {

        setSearch('')
        setSelectedStatus('')

    }


    // =========================================================
    // OPEN ADD BANK MODAL
    // =========================================================

   const handleAddBank = () => {
        setSelectedBank(null)
        setShowBankModal(true)
    }


    // =========================================================
    // OPEN EDIT BANK MODAL
    // =========================================================

    const handleEditBank = (bank) => {

        setSelectedBank(bank)

        setShowBankModal(true)

    }


    // =========================================================
    // CLOSE BANK MODAL
    // =========================================================

    const handleCloseModal = () => {

        setShowBankModal(false)

        setSelectedBank(null)

    }


    // =========================================================
    // SAVE BANK
    // ADD / EDIT
    // =========================================================

    const handleSaveBank = async (bankData) => {

    try {

        if (bankData.id) {

            await updateBank(bankData)

        } else {

            await createBank(bankData)

        }

        await fetchBanks()

        handleCloseModal()

    } catch (error) {

        console.error(

            'Failed to save bank:',

            error

        )

    }

}


    // =========================================================
    // DELETE BANK
    // =========================================================

    const handleDeleteBank = async (bank) => {

    const confirmed = window.confirm(
        `Are you sure you want to delete ${bank.name}?`
    )

    if (!confirmed) {
        return
    }

    try {
        await deleteBank(bank.id)

        await fetchBanks()

    } catch (error) {
        console.error(
            'Failed to delete bank:',
            error
        )
    }
}


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            space-y-5
            p-4
            sm:p-6
        ">

            {/* =====================================================
                FILTER SECTION
            ===================================================== */}

            <div className="
                rounded-xl
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    flex
                    flex-col
                    gap-3
                    px-4
                    py-4
                    lg:flex-row
                    lg:items-center
                    lg:gap-3
                    lg:px-5
                ">

                    {/* =================================================
                        FILTER LABEL
                    ================================================= */}

                    <p className="
                        shrink-0
                        text-sm
                        font-medium
                        text-base-content/70
                    ">
                        Filter Options
                    </p>


                    {/* =================================================
                        SEARCH
                    ================================================= */}

                    <div className="
                        relative
                        w-full
                        lg:w-[320px]
                    ">

                        <MagnifyingGlassIcon className="
                            pointer-events-none
                            absolute
                            left-3
                            top-1/2
                            h-5
                            w-5
                            -translate-y-1/2
                            text-base-content/40
                        " />


                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search bank..."
                            className="
                                input
                                input-bordered
                                h-10
                                w-full
                                pl-10
                            "
                        />

                    </div>


                    {/* =================================================
                        STATUS FILTER
                    ================================================= */}

                    <select
                        value={selectedStatus}
                        onChange={(event) =>
                            setSelectedStatus(
                                event.target.value
                            )
                        }
                        className="
                            select
                            select-bordered
                            h-10
                            min-h-10
                            w-full
                            lg:w-[170px]
                        "
                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>

                    </select>


                    {/* =================================================
                        RESULT COUNT
                    ================================================= */}

                    <p className="
                        shrink-0
                        text-xs
                        font-medium
                        text-base-content/55
                    ">

                        {filteredBanks.length}{' '}

                        {filteredBanks.length === 1
                            ? 'bank'
                            : 'banks'}{' '}

                        found

                    </p>


                    {/* =================================================
                        SPACER
                    ================================================= */}

                    <div className="
                        hidden
                        flex-1
                        lg:block
                    " />


                    {/* =================================================
                        CLEAR FILTERS
                    ================================================= */}

                    {(search || selectedStatus) && (

                        <button
                            type="button"
                            onClick={
                                handleClearFilters
                            }
                            className="
                                flex
                                h-10
                                shrink-0
                                items-center
                                justify-center
                                gap-1.5
                                rounded-lg
                                px-3
                                text-xs
                                font-medium
                                text-[#78B300]
                                transition
                                hover:bg-[#8BCF00]/10
                                hover:text-[#5f9000]
                            "
                        >

                            <XMarkIcon className="
                                h-4
                                w-4
                            " />

                            Clear

                        </button>

                    )}


                    {/* =================================================
                        ADD BANK
                    ================================================= */}

                    <button
                        type="button"
                        onClick={
                            handleAddBank
                        }
                        className="
                            flex
                            h-10
                            shrink-0
                            items-center
                            justify-center
                            gap-1.5
                            rounded-lg
                            bg-[#8BCF00]
                            px-4
                            text-sm
                            font-medium
                            text-white
                            shadow-none
                            transition
                            hover:bg-[#6FA800]
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#8BCF00]/30
                        "
                    >

                        <PlusIcon className="
                            h-4
                            w-4
                        " />

                        Add Bank

                    </button>

                </div>

            </div>


            {/* =====================================================
                BANK TABLE
            ===================================================== */}

            <BanksTable
                banks={filteredBanks}
                onEdit={handleEditBank}
                onDelete={handleDeleteBank}
            />


            {/* =====================================================
                ADD / EDIT BANK MODAL
            ===================================================== */}

            <BankModal
                open={showBankModal}
                bank={selectedBank}
                onClose={handleCloseModal}
                onSubmit={handleSaveBank}
            />

        </div>

    )
}


export default Banks