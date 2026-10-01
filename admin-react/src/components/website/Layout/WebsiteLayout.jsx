import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";

export default function WebsiteLayout() {
    const navigate = useNavigate();

    const go = (path) => {
        navigate(path);
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header navigate={go} />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer navigate={go} />
        </div>
    );
}