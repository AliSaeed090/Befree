// import usersReducer from './users';
import applicationReducer from './slices/application';
import authReducer from './slices/Auth';
import {combineReducers} from 'redux';
import AsyncStorage from "@react-native-async-storage/async-storage";

const combineRed: any = combineReducers({
  application: applicationReducer,
  Auth: authReducer,
});


const rootReducer = (state:any, action:any) => {
  
  if (action.type === 'AuthSlice/clearResults') { // check for action type 
     
    state = undefined;
    AsyncStorage.clear()
  }
  return combineRed(state, action);
};
export default  rootReducer
 
