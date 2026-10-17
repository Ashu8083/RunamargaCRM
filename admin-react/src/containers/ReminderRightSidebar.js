// admin-react/src/containers/ReminderRightSidebar.js

import { useEffect } from "react";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import { useDispatch, useSelector } from "react-redux";

import ReminderBodyRightDrawer from "../features/common/components/ReminderBodyRightDrawer";
import { closeReminderDrawer } from "../features/common/reminders/reminderDrawerSlice";

function ReminderRightSidebar() {
  const dispatch = useDispatch();
  const { isOpen, header } = useSelector(
    (state) => state.reminderDrawer,
  );

  useEffect(() => {
    if (!isOpen) return;

    const body = document.body;
    const previousOverflow = body.style.overflow;

    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const close = () => dispatch(closeReminderDrawer());

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        isOpen
          ? "opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        tabIndex={isOpen ? 0 : -1}
        aria-label="Close reminder drawer"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-gray-900/25"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label={header || "Reminders"}
        className={`absolute right-0 top-0 z-10 flex h-full w-80 max-w-[90vw] flex-col bg-base-100 shadow-xl transition-transform duration-300 ease-in-out md:w-96 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="navbar flex shrink-0 justify-start gap-2 px-4 shadow-md">
          <button
            type="button"
            className="btn btn-circle btn-outline btn-sm"
            onClick={close}
            aria-label="Close reminders"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

          <span className="text-xl font-bold">
            {header || "Reminders"}
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4">
          <ReminderBodyRightDrawer />
        </div>
      </section>
    </div>
  );
}

export default ReminderRightSidebar;