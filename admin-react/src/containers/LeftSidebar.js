// admin-react\src\containers\LeftSidebar.js
import routes from '../routes/sidebarmenu'
import { NavLink, Link, useLocation } from 'react-router-dom'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import { APP_LOGO } from '../constants/assets'
import { getCurrentUser } from '../app/auth'
import { hasPermission } from '../app/permissions'

function LeftSidebar({ onClose }) {
    const location = useLocation()
    const currentUser = getCurrentUser()

    const close = () => {
        onClose?.()
    }

    const closeOnMobile = () => {
        if (window.matchMedia('(max-width: 1023px)').matches) {
            close()
        }
    }

    const canSeeRoute = (route) => {
        return hasPermission(route.permission, currentUser)
    }

    return (
        <div className="drawer-side z-30">
            <label
                htmlFor="left-sidebar-drawer"
                className="drawer-overlay"
                onClick={close}
            ></label>

            <ul className="menu pt-2 w-72 lg:w-64 bg-base-100 min-h-full text-base-content overflow-y-auto">

                {/* Mobile close button */}
                <button
                    className="btn btn-ghost bg-base-300 btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden"
                    onClick={close}
                    type="button"
                    aria-label="Close sidebar"
                >
                    <XMarkIcon className="h-5 inline-block w-5" />
                </button>


                {/* Logo */}
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


                {/* Sidebar routes */}
                {routes.map((route, index) => {

                    // =====================================================
                    // SECTION
                    // =====================================================

                    if (route.type === 'section') {
                        const visibleSubmenu =
                            route.submenu.filter(canSeeRoute)

                        if (visibleSubmenu.length === 0) {
                            return null
                        }

                        return (
                            <div key={index}>

                                {/* Section heading */}
                                <li className="mt-5 mb-1 px-3 pointer-events-none">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                                        {route.name}
                                    </span>
                                </li>


                                {/* Section items */}
                                {visibleSubmenu.map((item, itemIndex) => (

                                    <li key={itemIndex}>

                                        <NavLink
                                            end
                                            to={item.path}
                                            onClick={closeOnMobile}
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

                    if (!canSeeRoute(route)) {
                        return null
                    }

                    return (
                        <li key={index}>

                            <NavLink
                                end
                                to={route.path}
                                onClick={closeOnMobile}
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
