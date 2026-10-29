import { apiRequest } from '../api-client';
import { API_ENDPOINTS } from '../../constants/routes';

const { USERS } = API_ENDPOINTS;

/** Service Object do recurso /usuarios. */
export const UsersService = {
  create(user) {
    return apiRequest({ method: 'POST', path: USERS, body: user });
  },

  getById(id) {
    return apiRequest({ path: `${USERS}/${id}` });
  },

  list(filters = {}) {
    return apiRequest({ path: USERS, qs: filters });
  },

  update(id, user) {
    return apiRequest({ method: 'PUT', path: `${USERS}/${id}`, body: user });
  },

  remove(id) {
    return apiRequest({ method: 'DELETE', path: `${USERS}/${id}` });
  },
};
