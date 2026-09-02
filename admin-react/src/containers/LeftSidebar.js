// admin-react/src/containers/LeftSidebar.js

import { useState } from 'react'
import routes from '../routes/sidebarmenu'
import { NavLink, Link, useLocation } from 'react-router-dom'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'

import { APP_LOGO } from '../constants/assets'
import { getCurrentUser } from '../app/auth'
import { hasPermission } from '../app/permissions'


function LeftSidebar({ onClose }) {

    const location = useLocation()
    const currentUser = getCurrentUser()


    // =========================================================
    // CLOSE SIDEBAR
    // =========================================================

    const close = () => {
        onClose?.()
    }


    const closeOnMobile = () => {

        if (
            window.matchMedia(
                '(max-width: 1023px)'
            ).matches
        ) {
            close()
        }
    }


    // =========================================================
    // PERMISSION CHECK
    // =========================================================

    const canSeeRoute = (route) => {

        return hasPermission(
            route.permission,
            currentUser
        )
    }


    // =========================================================
    // CHECK WHETHER A NESTED SUBMENU CONTAINS
    // THE CURRENT ACTIVE ROUTE
    // =========================================================

    const hasActiveChild = (submenu = []) => {

        return submenu.some((item) => {

            // -------------------------------------------------
            // Direct route
            // -------------------------------------------------

            if (
                item.path &&
                location.pathname === item.path
            ) {
                return true
            }


            // -------------------------------------------------
            // Nested submenu
            // -------------------------------------------------

            if (item.submenu) {

                return hasActiveChild(
                    item.submenu
                )
            }


            return false
        })
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="drawer-side z-30">

            {/* =================================================
                Drawer overlay
            ================================================= */}

            <label
                htmlFor="left-sidebar-drawer"
                className="drawer-overlay"
                onClick={close}
            ></label>


            {/* =================================================
                Sidebar
            ================================================= */}

            <ul
                className="
                    menu
                    pt-2
                    pb-10
                    w-72
                    lg:w-64
                    bg-base-100
                    min-h-full
                    text-base-content
                    overflow-y-auto

                    [&::-webkit-scrollbar]:w-1.5
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-base-content/10
                    hover:[&::-webkit-scrollbar-thumb]:bg-base-content/20
                "
            >

                {/* =================================================
                    Mobile close button
                ================================================= */}

                <button
                    className="
                        btn
                        btn-ghost
                        btn-circle
                        z-50
                        top-0
                        right-0
                        mt-4
                        mr-2
                        absolute
                        lg:hidden
                    "
                    onClick={close}
                    type="button"
                    aria-label="Close sidebar"
                >

                    <XMarkIcon
                        className="h-5 w-5"
                    />

                </button>


                {/* =================================================
                    Logo
                ================================================= */}

                <li className="mb-3 font-semibold text-xl">

                    <Link
                        to="/crm/dashboard"
                        onClick={closeOnMobile}
                        className="
                            flex
                            items-center
                            gap-3
                            px-3
                            py-2
                            rounded-lg
                            hover:bg-base-200
                            transition-colors
                        "
                    >

                        <img
                            className="
                                h-10
                                w-8
                                object-contain
                                shrink-0
                            "
                            src={APP_LOGO}
                            alt="Runamarga Logo"
                        />

                        <span>
                            Runamarga
                        </span>

                    </Link>

                </li>


                {/* =================================================
                    Sidebar routes
                ================================================= */}

                {routes.map((route, index) => {


                    // =================================================
                    // SECTION
                    // =================================================

                    if (route.type === 'section') {

                        const visibleSubmenu =
                            route.submenu.filter((item) => {

                                // -------------------------------------
                                // Normal section item
                                // -------------------------------------

                                if (!item.submenu) {
                                    return canSeeRoute(item)
                                }


                                // -------------------------------------
                                // Nested submenu
                                // -------------------------------------

                                return item.submenu.some((child) =>
                                    canSeeRoute(child)
                                )
                            })


                        // -----------------------------------------
                        // Nothing visible
                        // -----------------------------------------

                        if (
                            visibleSubmenu.length === 0
                        ) {
                            return null
                        }


                        return (
                            <div
                                key={index}
                                className="mt-5"
                            >

                                {/* =================================================
                                    Section heading
                                ================================================= */}

                                <li
                                    className="
                                        mb-1
                                        px-3
                                        pointer-events-none
                                    "
                                >

                                    <span
                                        className="
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-base-content/50
                                        "
                                    >
                                        {route.name}
                                    </span>

                                </li>


                                {/* =================================================
                                    Section items
                                ================================================= */}

                                {visibleSubmenu.map(
                                    (item, itemIndex) => {


                                        // =================================================
                                        // NESTED SUBMENU
                                        // =================================================

                                        if (
                                            item.type === 'submenu'
                                        ) {

                                            return (
                                                <NestedSubmenu
                                                    key={itemIndex}
                                                    item={item}
                                                    location={location}
                                                    currentUser={currentUser}
                                                    canSeeRoute={canSeeRoute}
                                                    closeOnMobile={closeOnMobile}
                                                    hasActiveChild={hasActiveChild}
                                                />
                                            )
                                        }


                                        // =================================================
                                        // NORMAL SECTION ITEM
                                        // =================================================

                                        return (
                                            <li
                                                key={itemIndex}
                                            >

                                                <NavLink
                                                    end
                                                    to={item.path}
                                                    onClick={closeOnMobile}
                                                    className={({ isActive }) => `
                                                        relative
                                                        flex
                                                        items-center
                                                        gap-3
                                                        rounded-lg
                                                        mx-2
                                                        px-3
                                                        py-2.5
                                                        transition-colors
                                                        duration-150

                                                        ${
                                                            isActive
                                                                ? `
                                                                    font-semibold
                                                                    !bg-base-200
                                                                    !text-base-content
                                                                `
                                                                : `
                                                                    font-normal
                                                                    text-base-content/75
                                                                    hover:bg-base-200/70
                                                                    hover:text-base-content
                                                                `
                                                        }
                                                    `}
                                                >

                                                    {item.icon}

                                                    <span className="truncate">
                                                        {item.name}
                                                    </span>


                                                    {/* =====================================
                                                        Active indicator
                                                    ===================================== */}

                                                    {location.pathname === item.path && (

                                                        <span
                                                            className="
                                                                absolute
                                                                inset-y-2
                                                                left-0
                                                                w-1
                                                                rounded-r-full
                                                                bg-primary
                                                            "
                                                            aria-hidden="true"
                                                        ></span>

                                                    )}

                                                </NavLink>

                                            </li>
                                        )
                                    }
                                )}

                            </div>
                        )
                    }


                    // =================================================
                    // NORMAL SIDEBAR ITEM
                    // =================================================

                    if (!canSeeRoute(route)) {
                        return null
                    }


                    return (
                        <li
                            key={index}
                        >

                            <NavLink
                                end
                                to={route.path}
                                onClick={closeOnMobile}
                                className={({ isActive }) => `
                                    relative
                                    flex
                                    items-center
                                    gap-3
                                    rounded-lg
                                    mx-2
                                    px-3
                                    py-2.5
                                    transition-colors
                                    duration-150

                                    ${
                                        isActive
                                            ? `
                                                font-semibold
                                                !bg-base-200
                                                !text-base-content
                                            `
                                            : `
                                                font-normal
                                                text-base-content/75
                                                hover:bg-base-200/70
                                                hover:text-base-content
                                            `
                                    }
                                `}
                            >

                                {route.icon}

                                <span className="truncate">
                                    {route.name}
                                </span>


                                {/* =============================================
                                    Active indicator
                                ============================================= */}

                                {location.pathname === route.path && (

                                    <span
                                        className="
                                            absolute
                                            inset-y-2
                                            left-0
                                            w-1
                                            rounded-r-full
                                            bg-primary
                                        "
                                        aria-hidden="true"
                                    ></span>

                                )}

                            </NavLink>

                        </li>
                    )
                })}


                {/* =================================================
                    SIDEBAR END
                ================================================= */}

                <li
                    className="
                        mt-10
                        mb-4
                        pointer-events-none
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            px-5
                        "
                    >

                        <div
                            className="
                                h-px
                                flex-1
                                bg-base-content/10
                            "
                        />

                        <span
                            className="
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-widest
                                text-base-content/30
                            "
                        >
                            End
                        </span>

                        <div
                            className="
                                h-px
                                flex-1
                                bg-base-content/10
                            "
                        />

                    </div>

                </li>


                {/* =================================================
                    EXTRA BOTTOM SPACE

                    Allows the user to scroll past the last
                    menu item instead of having it stuck to
                    the bottom edge.
                ================================================= */}

                <li
                    className="
                        h-8
                        pointer-events-none
                    "
                    aria-hidden="true"
                />

            </ul>

        </div>
    )
}


// =========================================================
// NESTED SUBMENU COMPONENT
// =========================================================

function NestedSubmenu({
    item,
    location,
    canSeeRoute,
    closeOnMobile,
    hasActiveChild,
}) {

    // =========================================================
    // Check if one of the children is active
    // =========================================================

    const containsActiveRoute =
        hasActiveChild(item.submenu)


    // =========================================================
    // Automatically open submenu if current page
    // belongs to it
    // =========================================================

    const [isOpen, setIsOpen] = useState(
        containsActiveRoute
    )


    // =========================================================
    // Visible children based on permissions
    // =========================================================

    const visibleChildren =
        item.submenu.filter(canSeeRoute)


    // =========================================================
    // Don't render if user has no permission
    // =========================================================

    if (visibleChildren.length === 0) {
        return null
    }


    // =========================================================
    // Toggle submenu
    // =========================================================

    const toggleSubmenu = () => {

        setIsOpen((previous) => !previous)

    }


    return (
        <li>

            {/* =====================================================
                Nested submenu button
            ===================================================== */}

            <button
                type="button"
                onClick={toggleSubmenu}
                className={`
                    relative
                    flex
                    items-center
                    gap-3
                    w-full
                    rounded-lg
                    mx-2
                    px-3
                    py-2.5
                    transition-colors
                    duration-150

                    ${
                        containsActiveRoute
                            ? `
                                !bg-base-200
                                !text-base-content
                                font-semibold
                            `
                            : `
                                font-normal
                                text-base-content/75
                                hover:bg-base-200/70
                                hover:text-base-content
                            `
                    }
                `}
                style={{
                    width: 'calc(100% - 1rem)'
                }}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >

                {item.icon}

                <span className="flex-1 text-left truncate">
                    {item.name}
                </span>


                {/* =================================================
                    Dropdown arrow
                ================================================= */}

                <ChevronDownIcon
                    className={`
                        h-4
                        w-4
                        shrink-0
                        opacity-60
                        transition-transform
                        duration-200

                        ${
                            isOpen
                                ? 'rotate-180'
                                : ''
                        }
                    `}
                />


                {/* =================================================
                    Active indicator
                ================================================= */}

                {containsActiveRoute && (

                    <span
                        className="
                            absolute
                            inset-y-2
                            left-0
                            w-1
                            rounded-r-full
                            bg-primary
                        "
                        aria-hidden="true"
                    ></span>

                )}

            </button>


            {/* =====================================================
                Nested submenu children
            ===================================================== */}

            {isOpen && (

                <ul
                    className="
                        ml-5
                        mt-1
                        border-l
                        border-base-content/10
                        pl-1
                    "
                >

                    {visibleChildren.map(
                        (child, childIndex) => {


                            // =================================================
                            // Support another nested submenu
                            // =================================================

                            if (
                                child.type === 'submenu'
                            ) {

                                return (
                                    <NestedSubmenu
                                        key={childIndex}
                                        item={child}
                                        location={location}
                                        canSeeRoute={canSeeRoute}
                                        closeOnMobile={closeOnMobile}
                                        hasActiveChild={hasActiveChild}
                                    />
                                )
                            }


                            // =================================================
                            // Check active child
                            // =================================================

                            const isActive =
                                location.pathname === child.path


                            // =================================================
                            // Normal nested route
                            // =================================================

                            return (
                                <li
                                    key={childIndex}
                                >

                                    <NavLink
                                        end
                                        to={child.path}
                                        onClick={closeOnMobile}
                                        className={`
                                            relative
                                            flex
                                            items-center
                                            gap-3
                                            rounded-lg
                                            mx-1
                                            px-3
                                            py-2
                                            transition-colors
                                            duration-150

                                            ${
                                                isActive
                                                    ? `
                                                        font-semibold
                                                        !bg-base-200
                                                        !text-base-content
                                                    `
                                                    : `
                                                        font-normal
                                                        text-base-content/70
                                                        hover:bg-base-200/70
                                                        hover:text-base-content
                                                    `
                                            }
                                        `}
                                    >

                                        {child.icon}

                                        <span className="truncate">
                                            {child.name}
                                        </span>


                                        {/* =====================================
                                            Active indicator
                                        ===================================== */}

                                        {isActive && (

                                            <span
                                                className="
                                                    absolute
                                                    inset-y-1.5
                                                    left-0
                                                    w-1
                                                    rounded-r-full
                                                    bg-primary
                                                "
                                                aria-hidden="true"
                                            ></span>

                                        )}

                                    </NavLink>

                                </li>
                            )
                        }
                    )}

                </ul>

            )}

        </li>
    )
}


export default LeftSidebar