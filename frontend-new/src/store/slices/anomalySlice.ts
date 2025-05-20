import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { anomalyService } from '../../services/anomaly.service';
import { AnomalyState, AnomalyFilters } from '../../types/anomaly.types';

const initialState: AnomalyState = {
  anomalies: [],
  selectedAnomaly: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

export const fetchAnomalies = createAsyncThunk(
  'anomalies/fetchAll',
  async (
    { page = 1, limit = 20, filters }: { page?: number; limit?: number; filters?: AnomalyFilters },
    { rejectWithValue }
  ) => {
    try {
      const response = await anomalyService.getAllAnomalies(page, limit, filters);
      return {
        anomalies: response.data,
        pagination: response.pagination,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch anomalies');
    }
  }
);

export const fetchAnomalyById = createAsyncThunk(
  'anomalies/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await anomalyService.getAnomalyById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch anomaly');
    }
  }
);

export const fetchAnomaliesByEndpoint = createAsyncThunk(
  'anomalies/fetchByEndpoint',
  async (
    { endpointId, page = 1, limit = 20 }: { endpointId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await anomalyService.getAnomaliesByEndpoint(endpointId, page, limit);
      return {
        anomalies: response.data,
        pagination: response.pagination,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch anomalies for endpoint'
      );
    }
  }
);

export const fetchAnomaliesByApplication = createAsyncThunk(
  'anomalies/fetchByApplication',
  async (
    { applicationId, page = 1, limit = 20 }: { applicationId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await anomalyService.getAnomaliesByApplication(applicationId, page, limit);
      return {
        anomalies: response.data,
        pagination: response.pagination,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch anomalies for application'
      );
    }
  }
);

export const resolveAnomaly = createAsyncThunk(
  'anomalies/resolve',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await anomalyService.resolveAnomaly(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to resolve anomaly');
    }
  }
);

export const deleteAnomaly = createAsyncThunk(
  'anomalies/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await anomalyService.deleteAnomaly(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete anomaly');
    }
  }
);

const anomalySlice = createSlice({
  name: 'anomalies',
  initialState,
  reducers: {
    clearAnomalyError: (state) => {
      state.error = null;
    },
    clearSelectedAnomaly: (state) => {
      state.selectedAnomaly = null;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all anomalies
    builder.addCase(fetchAnomalies.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAnomalies.fulfilled, (state, action) => {
      state.loading = false;
      state.anomalies = action.payload.anomalies;
      state.pagination = {
        ...state.pagination,
        ...action.payload.pagination,
        total: action.payload.pagination.total,
        totalPages: action.payload.pagination.pages,
      };
    });
    builder.addCase(fetchAnomalies.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch anomaly by ID
    builder.addCase(fetchAnomalyById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAnomalyById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedAnomaly = action.payload;
    });
    builder.addCase(fetchAnomalyById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch anomalies by endpoint
    builder.addCase(fetchAnomaliesByEndpoint.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAnomaliesByEndpoint.fulfilled, (state, action) => {
      state.loading = false;
      state.anomalies = action.payload.anomalies;
      state.pagination = {
        ...state.pagination,
        ...action.payload.pagination,
        total: action.payload.pagination.total,
        totalPages: action.payload.pagination.pages,
      };
    });
    builder.addCase(fetchAnomaliesByEndpoint.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch anomalies by application
    builder.addCase(fetchAnomaliesByApplication.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAnomaliesByApplication.fulfilled, (state, action) => {
      state.loading = false;
      state.anomalies = action.payload.anomalies;
      state.pagination = {
        ...state.pagination,
        ...action.payload.pagination,
        total: action.payload.pagination.total,
        totalPages: action.payload.pagination.pages,
      };
    });
    builder.addCase(fetchAnomaliesByApplication.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Resolve anomaly
    builder.addCase(resolveAnomaly.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resolveAnomaly.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.anomalies.findIndex((anomaly) => anomaly._id === action.payload._id);
      if (index !== -1) {
        state.anomalies[index] = action.payload;
      }
      if (state.selectedAnomaly && state.selectedAnomaly._id === action.payload._id) {
        state.selectedAnomaly = action.payload;
      }
    });
    builder.addCase(resolveAnomaly.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete anomaly
    builder.addCase(deleteAnomaly.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteAnomaly.fulfilled, (state, action) => {
      state.loading = false;
      state.anomalies = state.anomalies.filter((anomaly) => anomaly._id !== action.payload);
      if (state.selectedAnomaly && state.selectedAnomaly._id === action.payload) {
        state.selectedAnomaly = null;
      }
    });
    builder.addCase(deleteAnomaly.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearAnomalyError, clearSelectedAnomaly, setPage, setLimit } = anomalySlice.actions;
export default anomalySlice.reducer;
