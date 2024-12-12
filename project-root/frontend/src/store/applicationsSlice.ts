import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Application } from '../interfaces/application';
import { fetchApplications, createApplication, updateApplication, deleteApplication } from '../api/auth/applicationsService';
import { AxiosError } from 'axios';  // Import AxiosError

interface ApplicationsState {
  applications: Application[];
  loading: boolean;
  error: string | null;
  addLoading: boolean;
  editLoading: boolean;
  deleteLoading: boolean;
  addError: string | null;
  editError: string | null;
  deleteError: string | null;
}

const initialState: ApplicationsState = {
  applications: [],
  loading: false,
  error: null,
  addLoading: false,
  editLoading: false,
  deleteLoading: false,
  addError: null,
  editError: null,
  deleteError: null,
};

// Async actions
export const loadApplications = createAsyncThunk('applications/load', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchApplications();
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(axiosError.response?.data || 'Failed to load applications');
  }
});

export const addApplication = createAsyncThunk('applications/add', async (application: Partial<Application>, { rejectWithValue }) => {
  try {
    const response = await createApplication(application);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(axiosError.response?.data || 'Failed to add application');
  }
});

export const editApplication = createAsyncThunk('applications/edit', async ({ id, application }: { id: string; application: Partial<Application> }, { rejectWithValue }) => {
  try {
    console.log(`this id Slice ${application}`)
    const response = await updateApplication(id, application);  // PUT request
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(axiosError.response?.data || 'Failed to update application');
  }
});

export const removeApplication = createAsyncThunk('applications/remove', async (id: string, { rejectWithValue }) => {
  try {
    await deleteApplication(id);
    return id;
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(axiosError.response?.data || 'Failed to delete application');
  }
});

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load Applications
      .addCase(loadApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(loadApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add Application
      .addCase(addApplication.pending, (state) => {
        state.addLoading = true;
        state.addError = null;
      })
      .addCase(addApplication.fulfilled, (state, action) => {
        state.addLoading = false;
        state.applications.push(action.payload);
      })
      .addCase(addApplication.rejected, (state, action) => {
        state.addLoading = false;
        state.addError = action.payload as string;
      })
      
      // Edit Application
      .addCase(editApplication.pending, (state) => {
        state.editLoading = true;
        state.editError = null;
      })
      .addCase(editApplication.fulfilled, (state, action) => {
        state.editLoading = false;
        const index = state.applications.findIndex(app => app.id === action.payload.id);
        if (index >= 0) {
          state.applications[index] = action.payload; // Replace the updated application in the array
        }
      })
      .addCase(editApplication.rejected, (state, action) => {
        state.editLoading = false;
        state.editError = action.payload as string;
      })
      
      // Remove Application
      .addCase(removeApplication.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(removeApplication.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.applications = state.applications.filter(app => app.id !== action.payload);
      })
      .addCase(removeApplication.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const selectApplications = (state: { applications: ApplicationsState }) => state.applications.applications;
export const selectApplicationsLoading = (state: { applications: ApplicationsState }) => state.applications.loading;
export const selectApplicationsError = (state: { applications: ApplicationsState }) => state.applications.error;

export default applicationsSlice.reducer;
