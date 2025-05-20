import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { endpointService } from '../../services/endpoint.service';
import { EndpointState, EndpointFormData } from '../../types/endpoint.types';

const initialState: EndpointState = {
  endpoints: [],
  selectedEndpoint: null,
  loading: false,
  error: null,
};

export const fetchEndpoints = createAsyncThunk(
  'endpoints/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await endpointService.getAllEndpoints();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch endpoints');
    }
  }
);

export const fetchEndpointById = createAsyncThunk(
  'endpoints/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await endpointService.getEndpointById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch endpoint');
    }
  }
);

export const createEndpoint = createAsyncThunk(
  'endpoints/create',
  async (endpointData: EndpointFormData, { rejectWithValue }) => {
    try {
      const response = await endpointService.createEndpoint(endpointData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create endpoint');
    }
  }
);

export const updateEndpoint = createAsyncThunk(
  'endpoints/update',
  async ({ id, endpointData }: { id: string; endpointData: Partial<EndpointFormData> }, { rejectWithValue }) => {
    try {
      const response = await endpointService.updateEndpoint(id, endpointData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update endpoint');
    }
  }
);

export const updateEndpointStatus = createAsyncThunk(
  'endpoints/updateStatus',
  async ({ id, status }: { id: string; status: 'online' | 'offline' | 'pending' | 'error' }, { rejectWithValue }) => {
    try {
      const response = await endpointService.updateEndpointStatus(id, status);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update endpoint status');
    }
  }
);

export const deleteEndpoint = createAsyncThunk(
  'endpoints/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await endpointService.deleteEndpoint(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete endpoint');
    }
  }
);

const endpointSlice = createSlice({
  name: 'endpoints',
  initialState,
  reducers: {
    clearEndpointError: (state) => {
      state.error = null;
    },
    clearSelectedEndpoint: (state) => {
      state.selectedEndpoint = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all endpoints
    builder.addCase(fetchEndpoints.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchEndpoints.fulfilled, (state, action) => {
      state.loading = false;
      state.endpoints = action.payload;
    });
    builder.addCase(fetchEndpoints.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch endpoint by ID
    builder.addCase(fetchEndpointById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchEndpointById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedEndpoint = action.payload;
    });
    builder.addCase(fetchEndpointById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create endpoint
    builder.addCase(createEndpoint.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createEndpoint.fulfilled, (state, action) => {
      state.loading = false;
      state.endpoints.push(action.payload);
    });
    builder.addCase(createEndpoint.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update endpoint
    builder.addCase(updateEndpoint.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateEndpoint.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.endpoints.findIndex((endpoint) => endpoint._id === action.payload._id);
      if (index !== -1) {
        state.endpoints[index] = action.payload;
      }
      if (state.selectedEndpoint && state.selectedEndpoint._id === action.payload._id) {
        state.selectedEndpoint = action.payload;
      }
    });
    builder.addCase(updateEndpoint.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update endpoint status
    builder.addCase(updateEndpointStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateEndpointStatus.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.endpoints.findIndex((endpoint) => endpoint._id === action.payload._id);
      if (index !== -1) {
        state.endpoints[index] = action.payload;
      }
      if (state.selectedEndpoint && state.selectedEndpoint._id === action.payload._id) {
        state.selectedEndpoint = action.payload;
      }
    });
    builder.addCase(updateEndpointStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete endpoint
    builder.addCase(deleteEndpoint.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteEndpoint.fulfilled, (state, action) => {
      state.loading = false;
      state.endpoints = state.endpoints.filter((endpoint) => endpoint._id !== action.payload);
      if (state.selectedEndpoint && state.selectedEndpoint._id === action.payload) {
        state.selectedEndpoint = null;
      }
    });
    builder.addCase(deleteEndpoint.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearEndpointError, clearSelectedEndpoint } = endpointSlice.actions;
export default endpointSlice.reducer;
