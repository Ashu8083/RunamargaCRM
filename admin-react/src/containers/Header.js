import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import BellIcon from "@heroicons/react/24/outline/BellIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";

import { openRightDrawer } from "../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";
import { getCurrentUser, logout } from "../app/auth";
import { getDefaultProfileImage } from "../constants/assets";

import { useLocation } from "react-router-dom";

import routes from "../routes/sidebarmenu";

function Header({ onToggleSidebar, sidebarOpen }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const { noOfNotifications } = useSelector((state) => state.header);
  const currentUser = getCurrentUser();
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

  const getCurrentPage = () => {
    const currentPath = location.pathname;

    // -----------------------------------------------------
    // Check normal routes
    // -----------------------------------------------------

    const normalRoute = routes.find(
      (route) => route.type !== "section" && route.path === currentPath,
    );

    if (normalRoute) {
      return {
        parent: null,
        name: normalRoute.name,
      };
    }

    // -----------------------------------------------------
    // Check section submenu routes
    // -----------------------------------------------------

    for (const route of routes) {
      if (route.type === "section") {
        const submenuItem = route.submenu?.find(
          (item) => item.path === currentPath,
        );

        if (submenuItem) {
          return {
            parent: submenuItem.parent || route.name,
            name: submenuItem.name,
          };
        }
      }
    }

    // -----------------------------------------------------
    // Fallback
    // -----------------------------------------------------

    return {
      parent: null,
      name: "Dashboard",
    };
  };

  const currentPage = getCurrentPage();

  // =========================================================
  // NOTIFICATIONS
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
  // LOGOUT
  // =========================================================

  function logoutUser() {
    logout();
  }

  // =========================================================
  // HEADER TITLE
  // =========================================================

  const renderPageTitle = () => {
    if (currentPage.parent) {
      return (
        <div className="flex items-center ml-2">
          <span className="hidden sm:inline truncate text-sm font-medium text-base-content/60">
            {currentPage.parent}
          </span>

          <span className="hidden sm:inline mx-2 text-base-content/40">/</span>

          <span className="truncate text-lg sm:text-2xl font-semibold">
            {currentPage.name}
          </span>
        </div>
      );
    }

    return (
      <h1 className="truncate text-lg sm:text-2xl font-semibold ml-2">
        {currentPage.name}
      </h1>
    );
  };

  return (
    <div className="navbar sticky top-0 bg-base-100 z-10 border-b border-base-300 shadow-sm px-2 sm:px-4">
      {/* =====================================================
                LEFT SIDE
            ===================================================== */}

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

        {/* Page title */}

        {renderPageTitle()}
      </div>

      {/* =====================================================
                RIGHT SIDE
            ===================================================== */}

      <div className="flex-none flex items-center gap-1 sm:gap-2">
        {/* =================================================
                    DATE & TIME
                ================================================= */}

        <div className="hidden lg:flex flex-col items-end mr-5 leading-tight">
          <span className="text-xs font-medium text-base-content/60">
            {formattedDate}
          </span>

          <span className="text-sm font-semibold text-base-content tabular-nums">
            {formattedTime}
          </span>
        </div>

        {/* =================================================
                    THEME TOGGLE
                ================================================= */}

        <label className="btn btn-ghost btn-circle swap swap-rotate">
          <input
            type="checkbox"
            checked={currentTheme === "dark"}
            onChange={(event) =>
              updateTheme(event.target.checked ? "dark" : "light")
            }
            aria-label="Toggle theme"
          />

          <SunIcon
            className="swap-off fill-current w-5 h-5"
          />

          <MoonIcon
            className="swap-on fill-current w-5 h-5"
          />
        </label>

        {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

        <button
          className="btn btn-ghost btn-circle"
          onClick={openNotification}
          type="button"
          aria-label="Open notifications"
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

        {/* =================================================
                    PROFILE
                ================================================= */}

        <div className="dropdown dropdown-end">
          <button type="button" tabIndex={0} className="btn btn-ghost btn-circle avatar">
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
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
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
