import PageContent from "./PageContent"
import LeftSidebar from "./LeftSidebar"
import { useSelector, useDispatch } from 'react-redux'
import RightSidebar from './RightSidebar'
import { useEffect, useState } from "react"
import  {  removeNotificationMessage } from "../features/common/headerSlice"
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ModalLayout from "./ModalLayout"

function Layout(){
  const dispatch = useDispatch()
  const {newNotificationMessage, newNotificationStatus} = useSelector(state => state.header)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
      if (typeof window === 'undefined') return true
      return window.matchMedia('(min-width: 1024px)').matches
  })


  useEffect(() => {
      if(newNotificationMessage !== ""){
          if(newNotificationStatus === 1)NotificationManager.success(newNotificationMessage, 'Success')
          if(newNotificationStatus === 0)NotificationManager.error( newNotificationMessage, 'Error')
          dispatch(removeNotificationMessage())
      }
  }, [dispatch, newNotificationMessage, newNotificationStatus])

  useEffect(() => {
      const mediaQuery = window.matchMedia('(min-width: 1024px)')
      const syncSidebar = (event) => setSidebarOpen(event.matches)

      mediaQuery.addEventListener('change', syncSidebar)

      return () => {
          mediaQuery.removeEventListener('change', syncSidebar)
      }
  }, [])

  const toggleSidebar = () => {
      setSidebarOpen((previous) => !previous)
  }

  const closeSidebar = () => {
      setSidebarOpen(false)
  }

    return(
      <>
        { /* Left drawer - containing page content and sidebar */ }
        <div className={`drawer ${sidebarOpen ? 'drawer-open' : ''}`}>
            <input
                id="left-sidebar-drawer"
                type="checkbox"
                className="drawer-toggle"
                checked={sidebarOpen}
                onChange={(event) => setSidebarOpen(event.target.checked)}
            />
            <PageContent
                onToggleSidebar={toggleSidebar}
                sidebarOpen={sidebarOpen}
            />
            <LeftSidebar onClose={closeSidebar} />
        </div>

        { /* Right drawer - containing secondary content like notifications list etc.. */ }
        <RightSidebar />


        {/** Notification layout container */}
        <NotificationContainer />

      {/* Modal layout container */}
        <ModalLayout />

      </>
    )
}

export default Layout
