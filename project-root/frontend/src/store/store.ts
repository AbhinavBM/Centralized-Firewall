import { configureStore } from '@reduxjs/toolkit';
import applicationsReducer from './applicationsSlice';

const store = configureStore({
  reducer: {
    applications: applicationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
