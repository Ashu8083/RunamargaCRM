// admin-react/src/containers/LeftSidebar.js

import { useEffect, useState } from 'react'
import routes from '../routes/sidebarmenu'
import { NavLink, Link, useLocation } from 'react-router-dom'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'

import { APP_LOGO } from '../constants/assets'
import { getCurrentUser } from '../app/auth'
import { hasPermission } from '../app/permissions'


function LeftSidebar({ onClose }) {

    const location = useLocation()

    const [currentUser, setCurrentUser] = useState(() =>
        getCurrentUser()
    )
    useEffect(() => {
        const handleAuthChanged = () => {
            setCurrentUser(getCurrentUser())
        }

        window.addEventListener(
            'auth:changed',
            handleAuthChanged
        )

        return () => {
            window.removeEventListener(
                'auth:changed',
                handleAuthChanged
            )
        }
    }, [])
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
                    w-72
                    lg:w-64
                    bg-base-100
                    min-h-full
                    text-base-content
                    overflow-y-auto
                "
            >


                {/* =================================================
                    Mobile close button
                ================================================= */}

                <button
                    className="
                        btn
                        btn-ghost
                        bg-base-300
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
                        className="h-5 inline-block w-5"
                    />

                </button>


                {/* =================================================
                    Logo
                ================================================= */}

                <li className="mb-2 font-semibold text-xl">

                    <Link to="/crm/dashboard">

                        <img
                            className="h-10 w-8 object-contain"
                            src={APP_LOGO}
                            alt="Runamarga Logo"
                        />

                        Runamarga

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
                            <div key={index}>

                                {/* =================================================
                                    Section heading
                                ================================================= */}

                                <li
                                    className="
                                        mt-5
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
                                            text-base-content/60
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
                                            <li key={itemIndex}>

                                                <NavLink
                                                    end
                                                    to={item.path}
                                                    onClick={closeOnMobile}
                                                    className={({ isActive }) => `
                                                        relative
                                                        flex
                                                        items-center
                                                        gap-3
                                                        ${isActive
                                                            ? 'font-semibold !bg-base-200 !text-base-content'
                                                            : 'font-normal'
                                                        }
                                                    `}
                                                >

                                                    {item.icon}

                                                    {item.name}


                                                    {/* =====================================
                                                        Active indicator
                                                    ===================================== */}

                                                    {location.pathname === item.path && (
                                                        <span
                                                            className="
                                                                absolute
                                                                inset-y-0
                                                                left-0
                                                                w-1
                                                                rounded-tr-md
                                                                rounded-br-md
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
                        <li key={index}>

                            <NavLink
                                end
                                to={route.path}
                                onClick={closeOnMobile}
                                className={({ isActive }) => `
                                    relative
                                    flex
                                    items-center
                                    gap-3
                                    ${isActive
                                        ? 'font-semibold !bg-base-200 !text-base-content'
                                        : 'font-normal'
                                    }
                                `}
                            >

                                {route.icon}

                                {route.name}


                                {/* =============================================
                                    Active indicator
                                ============================================= */}

                                {location.pathname === route.path && (
                                    <span
                                        className="
                                            absolute
                                            inset-y-0
                                            left-0
                                            w-1
                                            rounded-tr-md
                                            rounded-br-md
                                            bg-primary
                                        "
                                        aria-hidden="true"
                                    ></span>
                                )}

                            </NavLink>

                        </li>
                    )
                })}

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
                    w-full
                    flex
                    items-center
                    gap-3
                    font-normal
                    ${containsActiveRoute
                        ? '!bg-base-200 !text-base-content font-semibold'
                        : ''
                    }
                `}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >

                {item.icon}


                <span className="flex-1 text-left">
                    {item.name}
                </span>


                {/* =================================================
                    Dropdown arrow
                ================================================= */}

                <ChevronDownIcon
                    className={`
                        h-4
                        w-4
                        transition-transform
                        duration-200
                        ${isOpen
                            ? 'rotate-180'
                            : ''
                        }
                    `}
                />

            </button>


            {/* =====================================================
                Nested submenu children
            ===================================================== */}

            {isOpen && (

                <ul
                    className="
                        ml-4
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
                                <li key={childIndex}>

                                    <NavLink
                                        end
                                        to={child.path}
                                        onClick={closeOnMobile}
                                        className={`
                                            relative
                                            flex
                                            items-center
                                            gap-3

                                            ${
                                                isActive
                                                    ? `
                                                        font-semibold
                                                        !bg-base-200
                                                        !text-base-content
                                                    `
                                                    : `
                                                        font-normal
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
                                                    inset-y-0
                                                    left-0
                                                    w-1
                                                    rounded-tr-md
                                                    rounded-br-md
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