import {store} from '../redux/index';

export const getJwtToken = () => {
  const state: any = store ? store.getState() : {};
  const {jwtToken} = state.Auth;
  return jwtToken;
};
