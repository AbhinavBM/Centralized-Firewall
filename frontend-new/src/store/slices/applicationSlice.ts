import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationService } from '../../services/application.service';
import { ApplicationState, ApplicationFormData, ApplicationStats } from '../../types/application.types';

interface ExtendedApplicationState extends ApplicationState {
  stats: ApplicationStats | null;
  statsLoading: boolean;
}

const initialState: ExtendedApplicationState = {
  applications: [],
  selectedApplication: null,
  loading: false,
  error: null,
  stats: null,
  statsLoading: false,
};

export const fetchApplications = createAsyncThunk(
  'applications/fetchAll',
  async (endpointId?: string, { rejectWithValue }) => {
    try {
      const response = await applicationService.getAllApplications(endpointId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

export const fetchApplicationsByEndpoint = createAsyncThunk(
  'applications/fetchByEndpoint',
  async (endpointId: string, { rejectWithValue }) => {
    try {
      const response = await applicationService.getApplicationsByEndpoint(endpointId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications by endpoint');
    }
  }
);

export const fetchApplicationStats = createAsyncThunk(
  'applications/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await applicationService.getApplicationStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch application statistics');
    }
  }
);

export const fetchApplicationById = createAsyncThunk(
  'applications/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await applicationService.getApplicationById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch application');
    }
  }
);

export const createApplication = createAsyncThunk(
  'applications/create',
  async (applicationData: ApplicationFormData, { rejectWithValue }) => {
    try {
      const response = await applicationService.createApplication(applicationData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create application');
    }
  }
);

export const updateApplication = createAsyncThunk(
  'applications/update',
  async ({ id, applicationData }: { id: string; applicationData: Partial<ApplicationFormData> }, { rejectWithValue }) => {
    try {
      const response = await applicationService.updateApplication(id, applicationData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update application');
    }
  }
);

export const deleteApplication = createAsyncThunk(
  'applications/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await applicationService.deleteApplication(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete application');
    }
  }
);

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearApplicationError: (state) => {
      state.error = null;
    },
    clearSelectedApplication: (state) => {
      state.selectedApplication = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all applications
    builder.addCase(fetchApplications.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchApplications.fulfilled, (state, action) => {
      state.loading = false;
      state.applications = action.payload;
    });
    builder.addCase(fetchApplications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch application by ID
    builder.addCase(fetchApplicationById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchApplicationById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedApplication = action.payload;
    });
    builder.addCase(fetchApplicationById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create application
    builder.addCase(createApplication.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createApplication.fulfilled, (state, action) => {
      state.loading = false;
      state.applications.push(action.payload);
    });
    builder.addCase(createApplication.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update application
    builder.addCase(updateApplication.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateApplication.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.applications.findIndex((app) => app._id === action.payload._id);
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
      if (state.selectedApplication && state.selectedApplication._id === action.payload._id) {
        state.selectedApplication = action.payload;
      }
    });
    builder.addCase(updateApplication.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete application
    builder.addCase(deleteApplication.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteApplication.fulfilled, (state, action) => {
      state.loading = false;
      state.applications = state.applications.filter((app) => app._id !== action.payload);
      if (state.selectedApplication && state.selectedApplication._id === action.payload) {
        state.selectedApplication = null;
      }
    });
    builder.addCase(deleteApplication.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch applications by endpoint
    builder.addCase(fetchApplicationsByEndpoint.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchApplicationsByEndpoint.fulfilled, (state, action) => {
      state.loading = false;
      state.applications = action.payload;
    });
    builder.addCase(fetchApplicationsByEndpoint.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch application statistics
    builder.addCase(fetchApplicationStats.pending, (state) => {
      state.statsLoading = true;
      state.error = null;
    });
    builder.addCase(fetchApplicationStats.fulfilled, (state, action) => {
      state.statsLoading = false;
      state.stats = action.payload;
    });
    builder.addCase(fetchApplicationStats.rejected, (state, action) => {
      state.statsLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearApplicationError, clearSelectedApplication } = applicationSlice.actions;
export default applicationSlice.reducer;
