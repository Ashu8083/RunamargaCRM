// admin-react/src/containers/Header.js

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import BellIcon from "@heroicons/react/24/outline/BellIcon";
import BellAlertIcon from "@heroicons/react/24/outline/BellAlertIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";

import { openRightDrawer } from "../features/common/rightDrawerSlice";
import { openReminderDrawer } from "../features/common/reminders/reminderDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";

import {
  getStoredUser,
  logout,
  getActiveContext,
  setActiveContext,
} from "../app/auth";

import { getDefaultProfileImage } from "../constants/assets";

import { useLocation } from "react-router-dom";
import routes from "../routes/sidebarmenu";

function Header({ onToggleSidebar, sidebarOpen }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const { noOfNotifications } = useSelector((state) => state.header);

  // Live reminder count from the shared Redux store.
  const reminders = useSelector(
    (state) => state.reminderDrawer?.reminders ?? [],
  );

  const reminderCount = reminders.filter((reminder) =>
    ["scheduled", "ringing"].includes(reminder.status),
  ).length;

  const currentUser = getStoredUser();

  const profileFallback = getDefaultProfileImage(currentUser?.gender);

  const profileImage =
    currentUser?.profileImage ||
    currentUser?.profile_image ||
    currentUser?.avatar ||
    profileFallback;

  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme"),
  );

  const [currentTime, setCurrentTime] = useState(new Date());

  const [profileSrc, setProfileSrc] = useState(profileImage);

  const contexts = Array.isArray(currentUser?.contexts)
    ? currentUser.contexts
    : [];

  const [activeContext, setActiveContextState] = useState(() =>
    getActiveContext(currentUser),
  );

  // =========================================================
  // CONTEXT SWITCHING
  // =========================================================

  const handleContextChange = (context) => {
    setActiveContext(context);
    setActiveContextState(context);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth:changed"));
    }
  };

  // =========================================================
  // THEME
  // =========================================================

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    const preferredTheme =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    const nextTheme = storedTheme || preferredTheme;

    setCurrentTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  }, []);

  const updateTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  };

  // =========================================================
  // PROFILE IMAGE
  // =========================================================

  useEffect(() => {
    setProfileSrc(profileImage);
  }, [profileImage]);

  const handleProfileImageError = () => {
    if (profileSrc !== profileFallback) {
      setProfileSrc(profileFallback);
    }
  };

  // =========================================================
  // DIGITAL CLOCK
  // =========================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // =========================================================
  // FIND CURRENT PAGE
  // =========================================================

  const findCurrentPage = (items, parentPath = []) => {
    for (const item of items) {
      if (item.path && item.path === location.pathname) {
        return {
          parentPath,
          name: item.name,
        };
      }

      if (item.submenu && item.submenu.length > 0) {
        const currentPath =
          item.type === "section"
            ? [...parentPath]
            : [...parentPath, item.name];

        const result = findCurrentPage(item.submenu, currentPath);

        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  const currentPage = findCurrentPage(routes) || {
    parentPath: [],
    name: "Dashboard",
  };

  // =========================================================
  // NOTIFICATIONS - EXISTING FUNCTIONALITY
  // =========================================================

  const openNotification = () => {
    dispatch(
      openRightDrawer({
        header: "Notifications",
        bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION,
      }),
    );
  };

  // =========================================================
  // REMINDERS - LIVE COUNT AND DRAWER
  // =========================================================

  const openReminders = () => {
    dispatch(
      openReminderDrawer({
        header: "Reminders",
      }),
    );
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  function logoutUser() {
    logout();
  }

  // =========================================================
  // HEADER TITLE
  // =========================================================

  const renderPageTitle = () => {
    if (currentPage.parentPath.length === 0) {
      return (
        <h1 className="truncate text-lg sm:text-2xl font-semibold ml-2">
          {currentPage.name}
        </h1>
      );
    }

    return (
      <div className="flex items-center ml-2 min-w-0">
        {currentPage.parentPath.map((parent, index) => (
          <React.Fragment key={`${parent}-${index}`}>
            <span
              className="
                hidden
                sm:inline
                truncate
                text-sm
                font-medium
                text-base-content/60
              "
            >
              {parent}
            </span>

            <span className="hidden sm:inline mx-2 text-base-content/40">
              /
            </span>
          </React.Fragment>
        ))}

        <span className="truncate text-lg sm:text-2xl font-semibold">
          {currentPage.name}
        </span>
      </div>
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="navbar sticky top-0 bg-base-100 z-10 border-b border-base-300 shadow-sm px-2 sm:px-4">
      {/* LEFT SIDE */}

      <div className="flex-1 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="btn btn-ghost btn-circle mr-1 sm:mr-2"
          aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          <Bars3Icon className="h-5 inline-block w-5" />
        </button>

        {renderPageTitle()}
      </div>

      {/* RIGHT SIDE */}

      <div className="flex-none flex items-center gap-1 sm:gap-2">
        {/* CONTEXT SWITCHER */}

        {contexts.length > 1 && (
          <div className="dropdown dropdown-end">
            <button
              type="button"
              tabIndex={0}
              className="btn btn-ghost btn-sm gap-2"
              title="Switch context"
            >
              <span className="hidden sm:inline text-xs text-base-content/60">
                Context:
              </span>

              <span className="font-semibold">
                {activeContext?.name || "Select Context"}
              </span>

              <span className="text-xs">▼</span>
            </button>

            <ul
              tabIndex={0}
              className="
                menu
                menu-sm
                dropdown-content
                mt-3
                p-2
                shadow
                bg-base-100
                rounded-box
                w-56
                border
                border-base-300
              "
            >
              <li className="menu-title">
                <span>Switch Context</span>
              </li>

              {contexts.map((context) => (
                <li key={context.id}>
                  <button
                    type="button"
                    onClick={() => handleContextChange(context)}
                    className="flex items-center justify-between"
                  >
                    <span>{context.name}</span>

                    {activeContext?.id === context.id && (
                      <span className="text-success font-bold">✓</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* DATE AND TIME */}

        <div className="hidden lg:flex flex-col items-end mr-5 leading-tight">
          <span className="text-xs font-medium text-base-content/60">
            {formattedDate}
          </span>

          <span className="text-sm font-semibold text-base-content tabular-nums">
            {formattedTime}
          </span>
        </div>

        {/* THEME TOGGLE */}

        <label className="btn btn-ghost btn-circle swap swap-rotate">
          <input
            type="checkbox"
            checked={currentTheme === "dark"}
            onChange={(event) =>
              updateTheme(event.target.checked ? "dark" : "light")
            }
            aria-label="Toggle theme"
          />

          <SunIcon className="swap-off fill-current w-5 h-5" />
          <MoonIcon className="swap-on fill-current w-5 h-5" />
        </label>

        {/* EXISTING NOTIFICATIONS */}

        <button
          className="btn btn-ghost btn-circle"
          onClick={openNotification}
          type="button"
          aria-label="Open notifications"
          title="Notifications"
        >
          <div className="indicator">
            <BellIcon className="h-6 w-6" />

            {noOfNotifications > 0 && (
              <span className="indicator-item badge badge-secondary badge-sm">
                {noOfNotifications}
              </span>
            )}
          </div>
        </button>

        {/* REMINDERS - LIVE BADGE */}

        <button
          className="btn btn-ghost btn-circle"
          onClick={openReminders}
          type="button"
          aria-label={
            reminderCount > 0
              ? `Open reminders, ${reminderCount} pending`
              : "Open reminders"
          }
          title={
            reminderCount > 0
              ? `${reminderCount} pending reminder(s)`
              : "Reminders"
          }
        >
          <div className="indicator">
            <BellAlertIcon className="h-6 w-6" />

            {reminderCount > 0 && (
              <span className="indicator-item badge badge-primary badge-sm">
                {reminderCount > 99 ? "99+" : reminderCount}
              </span>
            )}
          </div>
        </button>

        {/* PROFILE */}

        <div className="dropdown dropdown-end">
          <button
            type="button"
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar"
            aria-label="Open profile menu"
          >
            <div className="w-10 rounded-full bg-base-200">
              <img
                src={profileSrc}
                alt={currentUser?.name || "Profile"}
                className="object-cover"
                onError={handleProfileImageError}
              />
            </div>
          </button>

          <ul
            tabIndex={0}
            className="
              menu
              menu-compact
              dropdown-content
              mt-3
              p-2
              shadow
              bg-base-100
              rounded-box
              w-52
            "
          >
            <li className="menu-title px-3 py-2">
              <span className="truncate text-sm normal-case">
                {currentUser?.name || "Runamarga User"}
              </span>
            </li>

            <li>
              <button type="button" onClick={logoutUser}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;