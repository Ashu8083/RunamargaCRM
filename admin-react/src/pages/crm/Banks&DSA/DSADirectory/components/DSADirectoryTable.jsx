// admin-react/src/pages/Banks&DSA/DSADirectory/components/DSADirectoryTable.jsx
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon';
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';

import {
    PERMISSIONS,
    hasPermission,
} from '../../../../../app/permissions';

const DSADirectoryTable = ({
    entries = [],
    loading = false,

    // Dropdown options
    banks = [],
    loanTypes = [],

    // Filter values
    search = '',
    selectedStatus = '',
    selectedDefault = '',
    selectedBankId = '',
    selectedLoanTypeId = '',

    // Filter handlers
    onSearchChange,
    onStatusChange,
    onDefaultChange,
    onBankChange,
    onLoanTypeChange,
    onReset,

    // Action handlers
    onRefresh,
    onAdd,
    onEdit,
    onDelete,
}) => {
    // Permissions
    const canAdd = hasPermission(PERMISSIONS.DSA_CREATE);
    const canEdit = hasPermission(PERMISSIONS.DSA_EDIT);
    const canDelete = hasPermission(PERMISSIONS.DSA_DELETE);

    const showActions =
        (canEdit && Boolean(onEdit)) ||
        (canDelete && Boolean(onDelete));

    const labelClass =
        'mb-1.5 block whitespace-nowrap text-xs font-medium text-gray-600';

    const selectClass =
        'h-10 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#8BCF00] focus:ring-2 focus:ring-[#8BCF00]/20';

    const buttonClass =
        'inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50';

    const handleSearchChange = (event) => {
        onSearchChange?.(event.target.value);
    };

    const handleStatusChange = (event) => {
        onStatusChange?.(event.target.value);
    };

    const handleDefaultChange = (event) => {
        onDefaultChange?.(event.target.value);
    };

    const handleBankChange = (event) => {
        onBankChange?.(event.target.value);
    };

    const handleLoanTypeChange = (event) => {
        onLoanTypeChange?.(event.target.value);
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                {/*
                    Desktop: one horizontal row.
                    Smaller screens: wrap controls without horizontal overflow.
                */}
                <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-12">
                    {/* Search */}
                    <div className="min-w-0 sm:col-span-2 lg:col-span-3">
                        <label className={labelClass}>
                            Search
                        </label>

                        <div className="relative">
                            <MagnifyingGlassIcon
                                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                aria-hidden="true"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={handleSearchChange}
                                placeholder="Search DSA name or code..."
                                className="h-10 w-full min-w-0 rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#8BCF00] focus:ring-2 focus:ring-[#8BCF00]/20"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="min-w-0 lg:col-span-1">
                        <label className={labelClass}>
                            Status
                        </label>

                        <select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            className={selectClass}
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Default */}
                    <div className="min-w-0 lg:col-span-1">
                        <label className={labelClass}>
                            Default
                        </label>

                        <select
                            value={selectedDefault}
                            onChange={handleDefaultChange}
                            className={selectClass}
                        >
                            <option value="">All</option>
                            <option value="true">Default</option>
                            <option value="false">Not Default</option>
                        </select>
                    </div>

                    {/* Bank */}
                    <div className="min-w-0 lg:col-span-2">
                        <label className={labelClass}>
                            Bank
                        </label>

                        <select
                            value={selectedBankId}
                            onChange={handleBankChange}
                            className={selectClass}
                        >
                            <option value="">All Banks</option>

                            {banks.map((bank) => (
                                <option
                                    key={bank.id}
                                    value={bank.id}
                                >
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Loan Type */}
                    <div className="min-w-0 lg:col-span-2">
                        <label className={labelClass}>
                            Loan Type
                        </label>

                        <select
                            value={selectedLoanTypeId}
                            onChange={handleLoanTypeChange}
                            className={selectClass}
                        >
                            <option value="">All Loan Types</option>

                            {loanTypes.map((loanType) => (
                                <option
                                    key={loanType.id}
                                    value={loanType.id}
                                >
                                    {loanType.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex min-w-0 flex-wrap items-end gap-2 sm:col-span-2 lg:col-span-3">
                        <button
                            type="button"
                            onClick={onReset}
                            className={`${buttonClass} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`}
                        >
                            Reset
                        </button>

                        <button
                            type="button"
                            onClick={onRefresh}
                            disabled={loading}
                            title="Refresh DSA directory"
                            aria-label="Refresh DSA directory"
                            className={`${buttonClass} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`}
                        >
                            <ArrowPathIcon
                                className={`h-4 w-4 ${
                                    loading ? 'animate-spin' : ''
                                }`}
                                aria-hidden="true"
                            />
                            Refresh
                        </button>

                        {canAdd && onAdd && (
                            <button
                                type="button"
                                onClick={onAdd}
                                className={`${buttonClass} bg-[#8BCF00] text-white hover:bg-[#79b600]`}
                            >
                                <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                                Add DSA
                            </button>
                        )}
                    </div>
                </div>

                {/* Result count */}
                <div className="mt-3 border-t border-gray-100 pt-3 text-sm text-gray-500">
                    {loading
                        ? 'Loading DSA entries...'
                        : `${entries.length} ${
                              entries.length === 1 ? 'DSA' : 'DSAs'
                          } found`}
                </div>
            </div>

            {/* Loading state */}
            {loading ? (
                <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-10 text-center">
                    <ArrowPathIcon
                        className="mb-3 h-8 w-8 animate-spin text-[#8BCF00]"
                        aria-hidden="true"
                    />

                    <p className="text-sm font-medium text-gray-700">
                        Loading DSA entries...
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Please wait while the directory is refreshed.
                    </p>
                </div>
            ) : entries.length === 0 ? (
                <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-10 text-center">
                    <MagnifyingGlassIcon
                        className="mb-3 h-8 w-8 text-gray-300"
                        aria-hidden="true"
                    />

                    <p className="text-sm font-medium text-gray-700">
                        No DSA entries found
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or filter criteria.
                    </p>
                </div>
            ) : (
                /* DSA table */
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-5 py-3.5 text-left font-semibold text-gray-600">
                                        DSA Name
                                    </th>

                                    <th className="px-5 py-3.5 text-left font-semibold text-gray-600">
                                        DSA Code
                                    </th>

                                    <th className="px-5 py-3.5 text-left font-semibold text-gray-600">
                                        Bank
                                    </th>

                                    <th className="px-5 py-3.5 text-left font-semibold text-gray-600">
                                        Loan Type
                                    </th>

                                    <th className="px-5 py-3.5 text-left font-semibold text-gray-600">
                                        Status
                                    </th>

                                    {showActions && (
                                        <th className="px-5 py-3.5 text-right font-semibold text-gray-600">
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {entries.map((entry) => {
                                    const isActive =
                                        entry.status === 'active';

                                    const isDefault =
                                        entry.isDefault === true ||
                                        entry.is_default === true;

                                    const dsaName =
                                        entry.dsaName ||
                                        entry.dsa_name ||
                                        'DSA';

                                    return (
                                        <tr
                                            key={entry.id}
                                            className="transition hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4 font-medium text-gray-900">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span>
                                                        {entry.dsaName ||
                                                            entry.dsa_name ||
                                                            '-'}
                                                    </span>

                                                    {isDefault && (
                                                        <span className="inline-flex rounded-full bg-[#8BCF00]/15 px-2 py-0.5 text-xs font-medium text-[#527c00]">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                                                {entry.dsaCode ||
                                                    entry.dsa_code ||
                                                    '-'}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {entry.bank || '-'}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {entry.loanType ||
                                                    entry.loan_type ||
                                                    '-'}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                                        isActive
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}
                                                >
                                                    <span
                                                        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                                                            isActive
                                                                ? 'bg-green-500'
                                                                : 'bg-red-500'
                                                        }`}
                                                    />

                                                    {isActive
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>

                                            {showActions && (
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {canEdit && onEdit && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    onEdit(entry)
                                                                }
                                                                title="Edit DSA"
                                                                aria-label={`Edit ${dsaName}`}
                                                                className="rounded-lg p-2 text-gray-500 transition hover:bg-[#8BCF00]/15 hover:text-[#527c00]"
                                                            >
                                                                <PencilSquareIcon
                                                                    className="h-5 w-5"
                                                                    aria-hidden="true"
                                                                />
                                                            </button>
                                                        )}

                                                        {canDelete &&
                                                            onDelete && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        onDelete(entry)
                                                                    }
                                                                    title="Delete DSA"
                                                                    aria-label={`Delete ${dsaName}`}
                                                                    className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                                                >
                                                                    <TrashIcon
                                                                        className="h-5 w-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                </button>
                                                            )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DSADirectoryTable;