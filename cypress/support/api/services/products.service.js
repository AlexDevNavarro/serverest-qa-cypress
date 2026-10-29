import { apiRequest } from '../api-client';
import { API_ENDPOINTS } from '../../constants/routes';

const { PRODUCTS } = API_ENDPOINTS;

/**
 * Service Object do recurso /produtos.
 * Operações de escrita exigem o token de um usuário administrador.
 */
export const ProductsService = {
  create(product, token) {
    return apiRequest({ method: 'POST', path: PRODUCTS, body: product, token });
  },

  getById(id) {
    return apiRequest({ path: `${PRODUCTS}/${id}` });
  },

  list(filters = {}) {
    return apiRequest({ path: PRODUCTS, qs: filters });
  },

  update(id, product, token) {
    return apiRequest({ method: 'PUT', path: `${PRODUCTS}/${id}`, body: product, token });
  },

  remove(id, token) {
    return apiRequest({ method: 'DELETE', path: `${PRODUCTS}/${id}`, token });
  },
};
