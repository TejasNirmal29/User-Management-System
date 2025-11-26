import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import PREFIXES from "../../prefixes";
import Services from "@services";
import Constants from "@constants/index";

const { NAME, ACTIONS } = PREFIXES.AUTH;

const initialState = {
  loading: false,
  token: null,
  refreshToken: null,
  user: {},
  error: null,
};

const authSlice = createSlice({
  name: NAME,
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = {};
      localStorage.removeItem(Constants.AUTH.ACCESS_TOKEN);
      localStorage.removeItem(Constants.AUTH.REFRESH_TOKEN);
    },
    setTokens: (state, action) => {
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem(
        Constants.AUTH.ACCESS_TOKEN,
        action.payload.accessToken
      );
      localStorage.setItem(
        Constants.AUTH.REFRESH_TOKEN,
        action.payload.refreshToken
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.token = null;
      state.refreshToken = null;
      state.user = {};
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.data.accessToken;
      state.refreshToken = action.payload.data.refreshToken;
      state.user = action.payload.data.user;
      state.error = null;
      localStorage.setItem(
        Constants.AUTH.ACCESS_TOKEN,
        action.payload.data.accessToken
      );
      localStorage.setItem(
        Constants.AUTH.REFRESH_TOKEN,
        action.payload.data.refreshToken
      );
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.token = null;
      state.refreshToken = null;
      state.user = {};
      state.error = action.error;
    });
    builder.addCase(refreshAccessToken.fulfilled, (state, action) => {
      state.token = action.payload.data.accessToken;
      localStorage.setItem(
        Constants.AUTH.ACCESS_TOKEN,
        action.payload.data.accessToken
      );
    });
    builder.addCase(refreshAccessToken.rejected, (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = {};
      localStorage.removeItem(Constants.AUTH.ACCESS_TOKEN);
      localStorage.removeItem(Constants.AUTH.REFRESH_TOKEN);
    });
  },
});

export const { logout, setTokens } = authSlice.actions;
export default authSlice.reducer;

export const login = createAsyncThunk(ACTIONS.LOGIN, async (payload, thunk) => {
  try {
    const response = await Services.login(payload);
    return response;
  } catch (error) {
    return thunk.rejectWithValue(error);
  }
});

export const refreshAccessToken = createAsyncThunk(
  ACTIONS.REFRESH_TOKEN,
  async (_, thunk) => {
    try {
      const refreshToken = localStorage.getItem(Constants.AUTH.REFRESH_TOKEN);
      if (!refreshToken) {
        return thunk.rejectWithValue("No refresh token");
      }
      const response = await Services.refreshToken({ refreshToken });
      return response;
    } catch (error) {
      return thunk.rejectWithValue(error);
    }
  }
);
