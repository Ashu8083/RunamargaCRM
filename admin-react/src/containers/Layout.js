// admin-react/src/containers/Layout.js

import PageContent from "./PageContent";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import ReminderRightSidebar from "./ReminderRightSidebar";
import ModalLayout from "./ModalLayout";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { removeNotificationMessage } from "../features/common/headerSlice";
import useReminderAlarm from "../features/common/reminders/useReminderAlarm";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import "react-notifications/lib/notifications.css";

function Layout() {
  const dispatch = useDispatch();

  // Check reminder due times, even when the reminder drawer is closed.
  useReminderAlarm();

  const { newNotificationMessage, newNotificationStatus } = useSelector(
    (state) => state.header,
  );

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 1024px)").matches;
  });

  // Preserve existing application notifications.
  useEffect(() => {
    if (newNotificationMessage !== "") {
      if (newNotificationStatus === 1) {
        NotificationManager.success(newNotificationMessage, "Success");
      }

      if (newNotificationStatus === 0) {
        NotificationManager.error(newNotificationMessage, "Error");
      }

      dispatch(removeNotificationMessage());
    }
  }, [dispatch, newNotificationMessage, newNotificationStatus]);

  // Preserve responsive sidebar behavior.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const syncSidebar = (event) => {
      setSidebarOpen(event.matches);
    };

    mediaQuery.addEventListener("change", syncSidebar);

    return () => {
      mediaQuery.removeEventListener("change", syncSidebar);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Left drawer - page content and sidebar */}
      <div className={`drawer ${sidebarOpen ? "drawer-open" : ""}`}>
        <input
          id="left-sidebar-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={sidebarOpen}
          onChange={(event) => setSidebarOpen(event.target.checked)}
        />

        <PageContent
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />

        <LeftSidebar onClose={closeSidebar} />
      </div>

      {/* Existing notification drawer - unchanged */}
      <RightSidebar />

      {/* Independent reminder drawer */}
      <ReminderRightSidebar />

      {/* Existing notification and modal containers */}
      <NotificationContainer />
      <ModalLayout />
    </>
  );
}

export default Layout;