import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsService } from '../../services/analytics.service';
import { DashboardState } from '../../types/dashboard.types';

const initialState: DashboardState = {
  overview: null,
  loading: false,
  error: null,
};

export const fetchSystemOverview = createAsyncThunk(
  'dashboard/fetchSystemOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getSystemOverview();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch system overview');
    }
  }
);

export const fetchTrafficStats = createAsyncThunk(
  'dashboard/fetchTrafficStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getTrafficStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch traffic statistics');
    }
  }
);

export const fetchAnomalyStats = createAsyncThunk(
  'dashboard/fetchAnomalyStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getAnomalyStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch anomaly statistics');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch system overview
    builder.addCase(fetchSystemOverview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSystemOverview.fulfilled, (state, action) => {
      state.loading = false;
      state.overview = action.payload;
    });
    builder.addCase(fetchSystemOverview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch traffic stats
    builder.addCase(fetchTrafficStats.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTrafficStats.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(fetchTrafficStats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch anomaly stats
    builder.addCase(fetchAnomalyStats.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAnomalyStats.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(fetchAnomalyStats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
