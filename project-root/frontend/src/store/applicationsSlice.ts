import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Application } from '../interfaces/application';
import { fetchApplications, createApplication, updateApplication, deleteApplication } from '../api/auth/applicationsService';

interface ApplicationsState {
  applications: Application[];
  loading: boolean;
  error: string | null;
}

const initialState: ApplicationsState = {
  applications: [],
  loading: false,
  error: null,
};

// Async actions
export const loadApplications = createAsyncThunk('applications/load', fetchApplications);

export const addApplication = createAsyncThunk('applications/add', createApplication);

export const editApplication = createAsyncThunk('applications/edit', async ({ id, application }: { id: string; application: Partial<Application> }) => {
  return updateApplication(id, application);
});

export const removeApplication = createAsyncThunk('applications/remove', deleteApplication);

// Slice
const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    // Optional: Can be used for immediate local updates without async calls
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(loadApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load applications';
      })
      .addCase(addApplication.fulfilled, (state, action) => {
        state.applications.push(action.payload);
      })
      .addCase(editApplication.fulfilled, (state, action) => {
        const index = state.applications.findIndex((app) => app.id === action.payload.id);
        if (index !== -1) {
          state.applications[index] = action.payload; // Update application in the array
        }
      })
      .addCase(removeApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter((app) => app.id !== action.payload.id);
      });
  },
});

export const { clearError } = applicationsSlice.actions; // Exporting the error clearing action

export default applicationsSlice.reducer;
