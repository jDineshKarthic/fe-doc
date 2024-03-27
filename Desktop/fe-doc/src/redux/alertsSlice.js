import { createSlice } from '@reduxjs/toolkit';

export const alertsSlice = createSlice({
  name: 'alerts',
  initialState: {
    loading: false,
  },
  reducers: {
    showLoading: (state, action) => {
      state.loading = true;
    },
    hideLoading: (state, action) => {
      state.loading = false;
    },
  },
});

export const { showLoading, hideLoading } = alertsSlice.actions;
