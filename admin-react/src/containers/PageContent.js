import Header from "./Header"
import { Navigate, Route, Routes } from 'react-router-dom'
import routes from '../routes'
import { Suspense } from 'react'
import SuspenseContent from "./SuspenseContent"
import { useSelector } from 'react-redux'
import { useEffect, useRef } from "react"
import PermissionGate from "../components/Auth/PermissionGate"

function AccessDenied(){
    return(
        <div className="rounded-box bg-base-100 p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold">Access restricted</h2>
            <p className="mt-2 text-sm text-base-content/60">
                Your account does not have permission to view this page.
            </p>
        </div>
    )
}

function PageContent({ onToggleSidebar, sidebarOpen }){
    const mainContentRef = useRef(null);
    const {pageTitle} = useSelector(state => state.header)


    // Scroll back to top on new page load
    useEffect(() => {
        mainContentRef.current.scroll({
            top: 0,
            behavior: "smooth"
          });
      }, [pageTitle])

    return(
        <div className="drawer-content flex flex-col ">
            <Header
                onToggleSidebar={onToggleSidebar}
                sidebarOpen={sidebarOpen}
            />
            <main className="flex-1 overflow-y-auto bg-base-200" ref={mainContentRef}>
            {/* <main className="flex-1 overflow-y-auto pt-4 px-3 sm:px-6 bg-base-200" ref={mainContentRef}> */}
                <Suspense fallback={<SuspenseContent />}>
                        <Routes>
                            {
                                routes.map((route, key) => {
                                    return(
                                        <Route
                                            key={key}
                                            exact={true}
                                            path={`${route.path}`}
                                            element={
                                                <PermissionGate
                                                    permission={route.permission}
                                                    fallback={<AccessDenied />}
                                                >
                                                    <route.component />
                                                </PermissionGate>
                                            }
                                        />
                                    )
                                })
                            }

                            <Route path="*" element={<Navigate to="/crm/dashboard" replace />} />
                        </Routes>
                </Suspense>
                <div className="h-16"></div>
            </main>
        </div> 
    )
}


export default PageContent
