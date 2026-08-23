// admin-react/src/App.js

import React, { lazy, useEffect } from 'react'
import './App.css'
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from 'react-router-dom'
import { themeChange } from 'theme-change'

import checkAuth from './app/auth'
import initializeApp from './app/init'


// =========================================================
// PAGES
// =========================================================

const Layout = lazy(() => import('./containers/Layout'))

const Login = lazy(() => import('./pages/Login'))

const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))

const Register = lazy(() => import('./pages/Register'))

const Documentation = lazy(() => import('./pages/Documentation'))

const Dashboard = lazy(() => import('./pages/Dashboard'))


// =========================================================
// INITIALIZATION
// =========================================================

initializeApp()

const token = checkAuth()


// =========================================================
// APP
// =========================================================

function App() {

    useEffect(() => {

        // DaisyUI theme initialization
        themeChange(false)

    }, [])


    return (

        <Router>

            <Routes>

                {/* =================================================
                    PUBLIC ROUTES
                ================================================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/documentation"
                    element={<Documentation />}
                />


                {/* =================================================
                    PROTECTED APPLICATION
                ================================================= */}

                <Route
                    path="/crm/*"
                    element={<Layout />}
                />


                {/* =================================================
                    ROOT
                ================================================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to={
                                token
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
                                token
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