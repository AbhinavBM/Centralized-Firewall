import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mappingService } from '../../services/mapping.service';
import { EndpointApplicationMapping, MappingState, CreateMappingData } from '../../types/mapping.types';

const initialState: MappingState = {
  mappings: [],
  mappingsWithDetails: [],
  loading: false,
  error: null,
};

export const fetchAllMappings = createAsyncThunk(
  'mappings/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mappingService.getAllMappings();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch mappings');
    }
  }
);

export const fetchMappingsByEndpoint = createAsyncThunk(
  'mappings/fetchByEndpoint',
  async (endpointId: string, { rejectWithValue }) => {
    try {
      const response = await mappingService.getMappingsByEndpoint(endpointId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch mappings for endpoint');
    }
  }
);

export const fetchMappingsByApplication = createAsyncThunk(
  'mappings/fetchByApplication',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await mappingService.getMappingsByApplication(applicationId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch mappings for application');
    }
  }
);

export const createMapping = createAsyncThunk(
  'mappings/create',
  async (mappingData: CreateMappingData, { rejectWithValue }) => {
    try {
      const response = await mappingService.createMapping(mappingData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create mapping');
    }
  }
);

export const updateMappingStatus = createAsyncThunk(
  'mappings/updateStatus',
  async ({ id, status }: { id: string; status: 'active' | 'inactive' | 'pending' | 'error' }, { rejectWithValue }) => {
    try {
      const response = await mappingService.updateMappingStatus(id, status);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update mapping status');
    }
  }
);

export const deleteMapping = createAsyncThunk(
  'mappings/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await mappingService.deleteMapping(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete mapping');
    }
  }
);

const mappingSlice = createSlice({
  name: 'mappings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all mappings
      .addCase(fetchAllMappings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMappings.fulfilled, (state, action) => {
        state.mappings = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllMappings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch mappings by endpoint
      .addCase(fetchMappingsByEndpoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMappingsByEndpoint.fulfilled, (state, action) => {
        state.mappings = action.payload;
        state.loading = false;
      })
      .addCase(fetchMappingsByEndpoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch mappings by application
      .addCase(fetchMappingsByApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMappingsByApplication.fulfilled, (state, action) => {
        state.mappings = action.payload;
        state.loading = false;
      })
      .addCase(fetchMappingsByApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create mapping
      .addCase(createMapping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMapping.fulfilled, (state, action) => {
        state.mappings.push(action.payload);
        state.loading = false;
      })
      .addCase(createMapping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update mapping status
      .addCase(updateMappingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMappingStatus.fulfilled, (state, action) => {
        const index = state.mappings.findIndex(mapping => mapping._id === action.payload._id);
        if (index !== -1) {
          state.mappings[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateMappingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete mapping
      .addCase(deleteMapping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMapping.fulfilled, (state, action) => {
        state.mappings = state.mappings.filter(mapping => mapping._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteMapping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default mappingSlice.reducer;
