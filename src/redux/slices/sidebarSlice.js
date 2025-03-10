import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebarOpen: true, // Sidebar is open by default
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
  },
});

// Export actions
export const { toggleSidebar, openSidebar, closeSidebar } = sidebarSlice.actions;

// Export selector
export const selectSidebarState = (state) => state.sidebar.isSidebarOpen;

// Export reducer
export default sidebarSlice.reducer;