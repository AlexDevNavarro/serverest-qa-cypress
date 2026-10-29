/** Endpoints da API ServeRest (relativos à apiUrl). */
export const API_ENDPOINTS = Object.freeze({
  USERS: '/usuarios',
  LOGIN: '/login',
  PRODUCTS: '/produtos',
});

/** Rotas do frontend ServeRest (relativas à baseUrl). */
export const FRONT_ROUTES = Object.freeze({
  LOGIN: '/login',
  SIGNUP: '/cadastrarusuarios',
  HOME: '/home',
  ADMIN_HOME: '/admin/home',
  ADMIN_PRODUCT_REGISTER: '/admin/cadastrarprodutos',
  ADMIN_PRODUCT_LIST: '/admin/listarprodutos',
});

/** Chaves que o frontend utiliza no localStorage para manter a sessão. */
export const STORAGE_KEYS = Object.freeze({
  TOKEN: 'serverest/userToken',
  EMAIL: 'serverest/userEmail',
  NAME: 'serverest/userNome',
});
