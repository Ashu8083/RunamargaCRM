// admin-react\src\app\store.js
import { configureStore } from '@reduxjs/toolkit'
import headerSlice from '../features/common/headerSlice'
import modalSlice from '../features/common/modalSlice'
import rightDrawerSlice from '../features/common/rightDrawerSlice'
import reminderDrawerSlice from '../features/common/reminders/reminderDrawerSlice'

const combinedReducer = {
  header: headerSlice,
  rightDrawer: rightDrawerSlice,
  reminderDrawer: reminderDrawerSlice,
  modal: modalSlice,
}

export default configureStore({
  reducer: combinedReducer
})