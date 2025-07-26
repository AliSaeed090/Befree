import axios from "./axios";
import { store } from "../index";
import { clearResults } from "../slices/Auth";

interface payload {
  data?: Object;
  url: string;
}

export const get = async (url: string, options?:any) => await axios.get(url,options);

// export const get = async (url: string, options?: any) => {
//   try {
//     let res = await axios.get(url, options);
//     //console.log({ res });
//     return res;
//   } catch (err: any) {
//     //console.log({ err });
//     return err
//     // if (err.response.status === 401) {
//     //   //console.log(
//     //     " store.dispatch(clearResults()); store.dispatch(clearResults()); store.dispatch(clearResults());"
//     //   );
//     //   store.dispatch(clearResults());
//     // } else {
//     //   throw err;
//     // }
//   }
// };

export const post = (payload: payload) => {
  try {
    return axios.post(`${payload.url}`, payload.data);
  } catch (err: any) {
    if (err.response.status === 401) {
    //   store.dispatch(clearResults());
    } else {
      throw err;
    }
  }
};
export const put = (payload: payload) => {
  try {
    return axios.put(`${payload.url}`, payload.data);
  } catch (err: any) {
    if (err.response.status === 401) {
    //   store.dispatch(clearResults());
    } else {
      throw err;
    }
  }
};
export const deleteAxios = async (url: string, options?:any) => await axios.delete(url,options);

 
