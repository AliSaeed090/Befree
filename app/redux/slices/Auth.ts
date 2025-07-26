import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {post, get} from '../services/api';
// import { ProductInterface } from "../../utilities/Interface";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {showMessage, hideMessage} from 'react-native-flash-message';
import {rootUrl} from '../../utilities/constants';
import {AxiosError} from 'axios';
 
export const getProfile = createAsyncThunk(
  'auth/GetUserProfileWithDetails',
  async () => {
    try {
      let url = `${rootUrl}/v1/User/Settings/GetUserProfileWithDetails`;
      const response: any = await get(url);

      if (response.data.success) {
        return response.data.result;
      } else {
        throw response.data.errorMessage;
      }
    } catch (err: any) {
      if (err) {
        throw err;
      } else {
        throw err;
      }
    }
  },
);
export const GetLocationUsers = createAsyncThunk(
  'auth/GetLocationUsers',
  async (locationId: any) => {
    try {
      let url = `${rootUrl}/v1/User/Settings/GetLocationUsers/${locationId}`;
      const response: any = await get(url);

      if (response.data.success) {
        return response.data.result;
      } else {
        throw response.data.errorMessage;
      }
    } catch (err: any) {
      if (err) {
        throw err;
      } else {
        throw err;
      }
    }
  },
);

const initialState: any = {
  loading: false,
  isAuthenticated: false,
  email: '',
  firstName: '',
  fullName: '',
  userId: '',
  jwtToken: '',
  lastName: '',
  primaryPhone: '',
  refreshToken: '',
  rolePermission: '',
  tokenExpiry: '',
  type: '',
  userApplicationRoles: [],
  selectedLocation: null,
  LocationUsers: [],
};

const AuthSlice:any = createSlice({
  name: 'AuthSlice',
  initialState: initialState,
  reducers: {
    clearResults(state) {
      // state.isAuthenticated = false;
    },
    Authenticate(state, action){
      state.isAuthenticated = true;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.type = action.payload.type;
      state.userApplicationRoles = action.payload.userApplicationRoles;
    },
    updateselectedLocation(state, action) {
      state.selectedLocation = action.payload;
    },
  },
  extraReducers: builder => {
  

    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.firstName = action.payload.profile.firstName;
      state.lastName = action.payload.profile.lastName;
      state.primaryPhone = action.payload.profile.primaryPhone;
      state.rolePermission = action.payload.applicationRole;
      state.userLocation = action.payload.userLocation;
      state.selectedLocation = action.payload.userLocation[0].id ?? null;
    });
    builder.addCase(GetLocationUsers.fulfilled, (state, action) => {
      state.LocationUsers = action.payload;
    });
  },
});
export const {clearResults, updateselectedLocation,Authenticate} = AuthSlice.actions;
export default AuthSlice.reducer;
