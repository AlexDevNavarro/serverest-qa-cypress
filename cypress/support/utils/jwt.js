/**
 * Decodifica o payload de um token JWT (sem validar a assinatura).
 * Aceita o token puro ou no formato do header Authorization ("Bearer <jwt>").
 *
 * @param {string} authorization
 * @returns {Record<string, any>}
 */
export const decodeJwtPayload = (authorization) => {
  const [, payload] = authorization.replace(/^Bearer /, '').split('.');
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

  return JSON.parse(atob(base64));
};
