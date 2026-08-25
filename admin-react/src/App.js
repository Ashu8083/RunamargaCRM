// admin-react/src/App.js

import React, { lazy, useEffect, useState } from 'react'
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from 'react-router-dom'
import { themeChange } from 'theme-change'

import { isAuthenticated } from './app/auth'
import initializeApp from './app/init'


// =========================================================
// PAGES
// =========================================================

const Layout = lazy(() => import('./containers/Layout'))

const Login = lazy(() => import('./pages/Login'))


// =========================================================
// INITIALIZATION
// =========================================================

initializeApp()

// =========================================================
// APP
// =========================================================

function App() {
    const [authenticated, setAuthenticated] = useState(isAuthenticated())

    useEffect(() => {

        // DaisyUI theme initialization
        themeChange(false)

        const syncAuthState = () => {
            setAuthenticated(isAuthenticated())
        }

        window.addEventListener('auth:changed', syncAuthState)
        window.addEventListener('storage', syncAuthState)

        return () => {
            window.removeEventListener('auth:changed', syncAuthState)
            window.removeEventListener('storage', syncAuthState)
        }

    }, [])


    return (

        <Router>

            <Routes>

                {/* =================================================
                    PUBLIC ROUTES
                ================================================= */}

                <Route
                    path="/login"
                    element={
                        authenticated
                            ? <Navigate to="/crm/dashboard" replace />
                            : <Login onLogin={() => setAuthenticated(true)} />
                    }
                />


                {/* =================================================
                    PROTECTED APPLICATION
                ================================================= */}

                <Route
                    path="/crm/*"
                    element={
                        authenticated
                            ? <Layout />
                            : <Navigate to="/login" replace />
                    }
                />


                {/* =================================================
                    ROOT
                ================================================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to={
                                authenticated
                                    ? "/crm/dashboard"
                                    : "/login"
                            }
                            replace
                        />
                    }
                />


                {/* =================================================
                    FALLBACK
                ================================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to={
                                authenticated
                                    ? "/crm/dashboard"
                                    : "/login"
                            }
                            replace
                        />
                    }
                />

            </Routes>

        </Router>

    )
}


export default App
