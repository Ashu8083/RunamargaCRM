// admin-react/src/pages/crm/Banks&DSA/Banks/index.jsx

import { lazy, Suspense, useEffect, useState } from "react";

import BanksTable from "./components/BanksTable";

import {
  getBanks,
  createBank,
  updateBank,
  deleteBank,
} from "./Api";

const BankModal = lazy(() => import("./components/BankModal"));

const Banks = () => {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);

  // Fetch all banks
  const fetchBanks = async () => {
    try {
      const data = await getBanks();

      console.log("Banks fetched:", data);

      setBanks(data);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  // Open modal to add a new bank
  const handleAddBank = () => {
    setSelectedBank(null);
    setShowBankModal(true);
  };

  // Open modal to edit an existing bank
  const handleEditBank = (bank) => {
    setSelectedBank(bank);
    setShowBankModal(true);
  };

  // Close modal
  const handleCloseBankModal = () => {
    setShowBankModal(false);
    setSelectedBank(null);
  };

  // Create or update a bank
  const handleSaveBank = async (bankData) => {
    try {
      if (bankData.id) {
        await updateBank(bankData);
      } else {
        await createBank(bankData);
      }

      await fetchBanks();
      handleCloseBankModal();
    } catch (error) {
      console.error("Error saving bank:", error);
    }
  };

  // Delete a bank
  const handleDeleteBank = async (bank) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${bank.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBank(bank.id);
      await fetchBanks();
    } catch (error) {
      console.error("Error deleting bank:", error);
    }
  };

  return (
    <div className="space-y-6 p-2">
      {/* Banks Table handles its own filters and Add Bank button */}
      <BanksTable
        banks={banks}
        onEdit={handleEditBank}
        onDelete={handleDeleteBank}
        onAdd={handleAddBank}
      />

      {/* Bank Modal */}
      {showBankModal && (
        <Suspense fallback={null}>
          <BankModal
            bank={selectedBank}
            onClose={handleCloseBankModal}
            onSave={handleSaveBank}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Banks;