import axios from "axios";
import auth from '@react-native-firebase/auth';
import { serverUrl } from './constants';
// import { getJwtToken } from "utilities";

async function getValidToken() {
  if (!auth().currentUser) {
    // throw new Error("No user logged in");
    return "";
  }else{
    return auth().currentUser?.getIdToken();
  }


}
const instance = axios.create({
  baseURL: serverUrl,  // Add the baseURL here
  headers: {
    platform:'mobile',
    appVersion:'0' 
  },
});

 instance.interceptors.request.use(async(config: any) => {
  const token = await getValidToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    //console.log({error:error})
    if (!error.response) {
      //console.log("401 401 401 401");
      // handle error: inform user, go to login, etc
    } else {
      return Promise.reject(error);
    }
  }
);
export default instance;
