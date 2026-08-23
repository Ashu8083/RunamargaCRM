// admin-react\src\containers\LeftSidebar.js
import routes from '../routes/sidebarmenu'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'

function LeftSidebar() {
    const location = useLocation()

    const close = () => {
        document.getElementById('left-sidebar-drawer').click()
    }

    return (
        <div className="drawer-side z-30">
            <label
                htmlFor="left-sidebar-drawer"
                className="drawer-overlay"
            ></label>

            <ul className="menu pt-2 w-60 bg-base-100 min-h-full text-base-content">

                {/* Mobile close button */}
                <button
                    className="btn btn-ghost bg-base-300 btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden"
                    onClick={close}
                >
                    <XMarkIcon className="h-5 inline-block w-5" />
                </button>


                {/* Logo */}
                <li className="mb-2 font-semibold text-xl">

                    <Link to="/crm/welcome">
                        <img
                            className="mask mask-squircle w-10"
                            src="/logo192.png"
                            alt="DashWind Logo"
                        />

                        Runamarga
                    </Link>

                </li>


                {/* Sidebar routes */}
                {routes.map((route, index) => {

                    // =====================================================
                    // SECTION
                    // =====================================================

                    if (route.type === 'section') {

                        return (
                            <div key={index}>

                                {/* Section heading */}
                                <li className="mt-5 mb-1 px-3 pointer-events-none">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                                        {route.name}
                                    </span>
                                </li>


                                {/* Section items */}
                                {route.submenu.map((item, itemIndex) => (

                                    <li key={itemIndex}>

                                        <NavLink
                                            end
                                            to={item.path}
                                            className={({ isActive }) =>
                                                `${isActive
                                                    ? 'font-semibold bg-base-200'
                                                    : 'font-normal'
                                                }`
                                            }
                                        >

                                            {item.icon}

                                            {item.name}

                                            {location.pathname === item.path && (
                                                <span
                                                    className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary"
                                                    aria-hidden="true"
                                                ></span>
                                            )}

                                        </NavLink>

                                    </li>

                                ))}

                            </div>
                        )
                    }


                    // =====================================================
                    // NORMAL SIDEBAR ITEM
                    // =====================================================

                    return (
                        <li key={index}>

                            <NavLink
                                end
                                to={route.path}
                                className={({ isActive }) =>
                                    `${isActive
                                        ? 'font-semibold bg-base-200'
                                        : 'font-normal'
                                    }`
                                }
                            >

                                {route.icon}

                                {route.name}

                                {location.pathname === route.path && (
                                    <span
                                        className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary"
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

export default LeftSidebar