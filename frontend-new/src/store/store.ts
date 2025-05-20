import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import endpointReducer from './slices/endpointSlice';
import applicationReducer from './slices/applicationSlice';
import dashboardReducer from './slices/dashboardSlice';
import firewallReducer from './slices/firewallSlice';
import anomalyReducer from './slices/anomalySlice';
import logReducer from './slices/logSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    endpoints: endpointReducer,
    applications: applicationReducer,
    dashboard: dashboardReducer,
    firewall: firewallReducer,
    anomalies: anomalyReducer,
    logs: logReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
