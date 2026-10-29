import { apiRequest } from '../api-client';
import { API_ENDPOINTS } from '../../constants/routes';

/** Service Object do recurso /login. */
export const AuthService = {
  login({ email, password }) {
    return apiRequest({ method: 'POST', path: API_ENDPOINTS.LOGIN, body: { email, password } });
  },
};
