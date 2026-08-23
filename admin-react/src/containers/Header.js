// admin-react/src/containers/Header.js
import { themeChange } from "theme-change";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import BellIcon from "@heroicons/react/24/outline/BellIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";

import { openRightDrawer } from "../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";

import { Link, useLocation } from "react-router-dom";

import routes from "../routes/sidebarmenu";

function Header() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { noOfNotifications } = useSelector((state) => state.header);

  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme"),
  );

  const [currentTime, setCurrentTime] = useState(new Date());

  // =========================================================
  // THEME
  // =========================================================

  useEffect(() => {
    themeChange(false);

    if (currentTheme === null) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setCurrentTheme("dark");
      } else {
        setCurrentTheme("light");
      }
    }
  }, []);

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
    localStorage.clear();
    window.location.href = "/";
  }

  // =========================================================
  // HEADER TITLE
  // =========================================================

  const renderPageTitle = () => {
    if (currentPage.parent) {
      return (
        <div className="flex items-center ml-2">
          <span className="text-sm font-medium text-base-content/60">
            {currentPage.parent}
          </span>

          <span className="mx-2 text-base-content/40">/</span>

          <span className="text-2xl font-semibold">
            {currentPage.name}
          </span>
        </div>
      );
    }

    return (
      <h1 className="text-2xl font-semibold ml-2">
        {currentPage.name}
      </h1>
    );
  };

  return (
    <div className="navbar sticky top-0 bg-base-100 z-10 shadow-md">
      {/* =====================================================
                LEFT SIDE
            ===================================================== */}

      <div className="flex-1">
        {/* Mobile sidebar button */}

        <label
          htmlFor="left-sidebar-drawer"
          className="btn btn-primary drawer-button lg:hidden"
        >
          <Bars3Icon className="h-5 inline-block w-5" />
        </label>

        {/* Page title */}

        {renderPageTitle()}
      </div>

      {/* =====================================================
                RIGHT SIDE
            ===================================================== */}

      <div className="flex-none flex items-center">
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

        <label className="swap">
          <input type="checkbox" />

          <SunIcon
            data-set-theme="light"
            data-act-class="ACTIVECLASS"
            className={
              "fill-current w-6 h-6 " +
              (currentTheme === "dark" ? "swap-on" : "swap-off")
            }
          />

          <MoonIcon
            data-set-theme="dark"
            data-act-class="ACTIVECLASS"
            className={
              "fill-current w-6 h-6 " +
              (currentTheme === "light" ? "swap-on" : "swap-off")
            }
          />
        </label>

        {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

        <button
          className="btn btn-ghost ml-4 btn-circle"
          onClick={openNotification}
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

        <div className="dropdown dropdown-end ml-4">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                src="https://placeimg.com/80/80/people"
                alt="profile"
              />
            </div>
          </label>

          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li className="justify-between">
              <Link to="/app/settings-profile">
                Profile Settings
              </Link>
            </li>

            <div className="divider mt-0 mb-0"></div>

            <li>
              <a onClick={logoutUser}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;