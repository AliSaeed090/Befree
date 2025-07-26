import axios from "axios";
import { rootUrl } from "../../utilities/constants";
import { getJwtToken } from "../../utilities";
const instance = axios.create({
  headers: {
    'X-ApplicationIDHeader': "2"
  },
});

instance.interceptors.request.use((config: any) => {
  let token = getJwtToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    //console.log(error)
    if (!error.response) {
      //console.log("401 401 401 401");
      // handle error: inform user, go to login, etc
    } else {
      return Promise.reject(error);
    }
  }
);
export default instance;
