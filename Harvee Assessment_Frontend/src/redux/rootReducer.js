import { combineReducers } from "redux";
import authSlice from "./features/auth/slice";

const reducers = combineReducers({
  auth: authSlice,
});

export default reducers;
