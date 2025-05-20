import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { logService } from '../../services/log.service';
import { LogState, LogFilters } from '../../types/log.types';

const initialState: LogState = {
  trafficLogs: [],
  systemLogs: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

export const fetchTrafficLogs = createAsyncThunk(
  'logs/fetchTraffic',
  async (
    { page = 1, limit = 20, filters }: { page?: number; limit?: number; filters?: LogFilters },
    { rejectWithValue }
  ) => {
    try {
      const response = await logService.getTrafficLogs(page, limit, filters);
      return {
        logs: response.data,
        pagination: response.pagination,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch traffic logs');
    }
  }
);

export const fetchSystemLogs = createAsyncThunk(
  'logs/fetchSystem',
  async (
    { page = 1, limit = 20, filters }: { page?: number; limit?: number; filters?: LogFilters },
    { rejectWithValue }
  ) => {
    try {
      const response = await logService.getSystemLogs(page, limit, filters);
      return {
        logs: response.data,
        pagination: response.pagination,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch system logs');
    }
  }
);

export const fetchTrafficLogsByEndpoint = createAsyncThunk(
  'logs/fetchTrafficByEndpoint',
  async (
    { endpointId, page = 1, limit = 20 }: { endpointId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await logService.getTrafficLogsByEndpoint(endpointId, page, limit);
      return {
        logs: response.data,
        pagination: response.pagination,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch traffic logs for endpoint'
      );
    }
  }
);

export const fetchTrafficLogsByApplication = createAsyncThunk(
  'logs/fetchTrafficByApplication',
  async (
    { applicationId, page = 1, limit = 20 }: { applicationId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await logService.getTrafficLogsByApplication(applicationId, page, limit);
      return {
        logs: response.data,
        pagination: response.pagination,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch traffic logs for application'
      );
    }
  }
);

const logSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    clearLogError: (state) => {
      state.error = null;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch traffic logs
    builder.addCase(fetchTrafficLogs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTrafficLogs.fulfilled, (state, action) => {
      state.loading = false;
      state.trafficLogs = action.payload.logs;
      state.pagination = {
        ...state.pagination,
        ...action.payload.pagination,
        total: action.payload.pagination.total,
        totalPages: action.payload.pagination.pages,
      };
    });
    builder.addCase(fetchTrafficLogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch system logs
    builder.addCase(fetchSystemLogs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSystemLogs.fulfilled, (state, action) => {
      state.loading = false;
      state.systemLogs = action.payload.logs;
      state.pagination = {
        ...state.pagination,
        ...action.payload.pagination,
        total: action.payload.pagination.total,
        totalPages: action.payload.pagination.pages,
      };
    });
    builder.addCase(fetchSystemLogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch traffic logs by endpoint
    builder.addCase(fetchTrafficLogsByEndpoint.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTrafficLogsByEndpoint.fulfilled, (state, action) => {
      state.loading = false;
      state.trafficLogs = action.payload.logs;
      state.pagination = {
        ...state.pagination,
        ...action.payload.pagination,
        total: action.payload.pagination.total,
        totalPages: action.payload.pagination.pages,
      };
    });
    builder.addCase(fetchTrafficLogsByEndpoint.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch traffic logs by application
    builder.addCase(fetchTrafficLogsByApplication.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTrafficLogsByApplication.fulfilled, (state, action) => {
      state.loading = false;
      state.trafficLogs = action.payload.logs;
      state.pagination = {
        ...state.pagination,
        ...action.payload.pagination,
        total: action.payload.pagination.total,
        totalPages: action.payload.pagination.pages,
      };
    });
    builder.addCase(fetchTrafficLogsByApplication.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearLogError, setPage, setLimit } = logSlice.actions;
export default logSlice.reducer;
