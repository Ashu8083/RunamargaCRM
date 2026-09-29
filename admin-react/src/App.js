// src/App.js

import React, { lazy, useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from 'react-router-dom';
import { themeChange } from 'theme-change';

import {
    isAuthenticated,
    getCurrentUser,
    clearAuthSession,
} from './app/auth';

import initializeApp from './app/init';


// =========================================================
// CRM
// =========================================================

const Layout = lazy(() => import('./containers/Layout'));

const Login = lazy(() => import('./pages/crm/Login'));


// =========================================================
// WEBSITE
// =========================================================

const WebsiteLayout = lazy(
    () => import('./components/website/Layout/WebsiteLayout')
);

const Home = lazy(() => import('./pages/website/Home'));
const ApplyNow = lazy(() => import('./pages/website/ApplyNow'));
const Blogs = lazy(() => import('./pages/website/Blogs'));
const About = lazy(() => import('./pages/website/About/About'));
const ContactUs = lazy(() => import('./pages/website/ContactUs'));
const FAQs = lazy(() => import('./pages/website/FAQs'));
const PrivacyPolicy = lazy(() => import('./pages/website/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/website/TermsConditions'));
const WebsiteLogin = lazy(() => import('./pages/website/Login'));
const WhatsappButton = lazy(
    () => import('./pages/website/WhatsappButton')
);


// =========================================================
// INITIALIZATION
// =========================================================

initializeApp();


// =========================================================
// APP
// =========================================================

function App() {

    const [authenticated, setAuthenticated] = useState(
        isAuthenticated()
    );

    useEffect(() => {

        themeChange(false);

        const syncAuthState = () => {
            setAuthenticated(isAuthenticated());
        };

        window.addEventListener(
            'auth:changed',
            syncAuthState
        );

        window.addEventListener(
            'storage',
            syncAuthState
        );

        const refreshUserSession = async () => {

            if (!isAuthenticated()) {
                return;
            }

            try {

                await getCurrentUser();

                setAuthenticated(true);

                window.dispatchEvent(
                    new Event('auth:changed')
                );

            } catch (error) {

                console.error(
                    'Failed to refresh user session:',
                    error
                );

                clearAuthSession();

                setAuthenticated(false);
            }
        };

        refreshUserSession();

        return () => {

            window.removeEventListener(
                'auth:changed',
                syncAuthState
            );

            window.removeEventListener(
                'storage',
                syncAuthState
            );
        };

    }, []);


    return (

        <Router>

            <Routes>

                {/* =================================================
                    WEBSITE
                ================================================= */}

                <Route element={<WebsiteLayout />}>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/about"
                        element={<About />}
                    />
                    <Route
                        path="/apply-now"
                        element={<ApplyNow />}
                    />

                    <Route
                        path="/blogs"
                        element={<Blogs />}
                    />

                    <Route
                        path="/contactus"
                        element={<ContactUs />}
                    />

                    <Route
                        path="/faqs"
                        element={<FAQs />}
                    />

                    <Route
                        path="/privacy-policy"
                        element={<PrivacyPolicy />}
                    />

                    <Route
                        path="/terms-conditions"
                        element={<TermsConditions />}
                    />

                    <Route
                        path="/website-login"
                        element={<WebsiteLogin />}
                    />

                </Route>


                {/* =================================================
                    CRM LOGIN
                ================================================= */}

                <Route
                    path="/login"
                    element={
                        authenticated
                            ? (
                                <Navigate
                                    to="/crm/dashboard"
                                    replace
                                />
                            )
                            : (
                                <Login
                                    onLogin={() =>
                                        setAuthenticated(true)
                                    }
                                />
                            )
                    }
                />


                {/* =================================================
                    CRM
                ================================================= */}

                <Route
                    path="/crm/*"
                    element={
                        authenticated
                            ? <Layout />
                            : (
                                <Navigate
                                    to="/login"
                                    replace
                                />
                            )
                    }
                />


                {/* =================================================
                    FALLBACK
                ================================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </Router>
    );
}

export default App;