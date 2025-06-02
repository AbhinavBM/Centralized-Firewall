import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firewallService } from '../../services/firewall.service';
import { FirewallRuleState, FirewallRuleFormData, FirewallStats } from '../../types/firewall.types';

const initialState: FirewallRuleState = {
  rules: [],
  selectedRule: null,
  loading: false,
  error: null,
};

export const fetchFirewallRules = createAsyncThunk(
  'firewall/fetchAll',
  async (filters?: { endpointId?: string; processName?: string }, { rejectWithValue }) => {
    try {
      const response = await firewallService.getAllRules(filters?.endpointId, filters?.processName);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch firewall rules');
    }
  }
);

export const fetchFirewallRulesByEndpoint = createAsyncThunk(
  'firewall/fetchByEndpoint',
  async (endpointId: string, { rejectWithValue }) => {
    try {
      const response = await firewallService.getRulesByEndpoint(endpointId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch firewall rules by endpoint');
    }
  }
);

export const fetchFirewallRulesByApplication = createAsyncThunk(
  'firewall/fetchByApplication',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await firewallService.getRulesByApplication(applicationId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch firewall rules by application');
    }
  }
);

export const fetchFirewallRuleById = createAsyncThunk(
  'firewall/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await firewallService.getRuleById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch firewall rule');
    }
  }
);

export const createFirewallRule = createAsyncThunk(
  'firewall/create',
  async (ruleData: FirewallRuleFormData, { rejectWithValue }) => {
    try {
      const response = await firewallService.createRule(ruleData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create firewall rule');
    }
  }
);

export const updateFirewallRule = createAsyncThunk(
  'firewall/update',
  async ({ id, ruleData }: { id: string; ruleData: Partial<FirewallRuleFormData> }, { rejectWithValue }) => {
    try {
      const response = await firewallService.updateRule(id, ruleData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update firewall rule');
    }
  }
);

export const fetchFirewallRulesByEndpoint = createAsyncThunk(
  'firewall/fetchByEndpoint',
  async (endpointId: string, { rejectWithValue }) => {
    try {
      const response = await firewallService.getRulesByEndpoint(endpointId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch firewall rules by endpoint');
    }
  }
);

export const deleteFirewallRule = createAsyncThunk(
  'firewall/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await firewallService.deleteRule(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete firewall rule');
    }
  }
);

const firewallSlice = createSlice({
  name: 'firewall',
  initialState,
  reducers: {
    clearFirewallError: (state) => {
      state.error = null;
    },
    clearSelectedRule: (state) => {
      state.selectedRule = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all firewall rules
    builder.addCase(fetchFirewallRules.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFirewallRules.fulfilled, (state, action) => {
      state.loading = false;
      state.rules = action.payload;
    });
    builder.addCase(fetchFirewallRules.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch firewall rules by endpoint
    builder.addCase(fetchFirewallRulesByEndpoint.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFirewallRulesByEndpoint.fulfilled, (state, action) => {
      state.loading = false;
      state.rules = action.payload;
    });
    builder.addCase(fetchFirewallRulesByEndpoint.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch firewall rules by application
    builder.addCase(fetchFirewallRulesByApplication.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFirewallRulesByApplication.fulfilled, (state, action) => {
      state.loading = false;
      state.rules = action.payload;
    });
    builder.addCase(fetchFirewallRulesByApplication.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch firewall rule by ID
    builder.addCase(fetchFirewallRuleById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFirewallRuleById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedRule = action.payload;
    });
    builder.addCase(fetchFirewallRuleById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create firewall rule
    builder.addCase(createFirewallRule.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createFirewallRule.fulfilled, (state, action) => {
      state.loading = false;
      state.rules.push(action.payload);
    });
    builder.addCase(createFirewallRule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update firewall rule
    builder.addCase(updateFirewallRule.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateFirewallRule.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.rules.findIndex((rule) => rule._id === action.payload._id);
      if (index !== -1) {
        state.rules[index] = action.payload;
      }
      state.selectedRule = action.payload;
    });
    builder.addCase(updateFirewallRule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete firewall rule
    builder.addCase(deleteFirewallRule.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteFirewallRule.fulfilled, (state, action) => {
      state.loading = false;
      state.rules = state.rules.filter((rule) => rule._id !== action.payload);
      if (state.selectedRule && state.selectedRule._id === action.payload) {
        state.selectedRule = null;
      }
    });
    builder.addCase(deleteFirewallRule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearFirewallError, clearSelectedRule } = firewallSlice.actions;
export default firewallSlice.reducer;
