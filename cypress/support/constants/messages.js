/**
 * Mensagens retornadas pela API ServeRest e exibidas pelo frontend.
 * Centralizadas para que uma mudança de texto exija ajuste em um único lugar.
 */
export const MESSAGES = Object.freeze({
  REGISTER_SUCCESS: 'Cadastro realizado com sucesso',
  UPDATE_SUCCESS: 'Registro alterado com sucesso',
  DELETE_SUCCESS: 'Registro excluído com sucesso',

  LOGIN_SUCCESS: 'Login realizado com sucesso',
  INVALID_CREDENTIALS: 'Email e/ou senha inválidos',
  INVALID_TOKEN: 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais',
  ADMIN_ONLY_ROUTE: 'Rota exclusiva para administradores',

  EMAIL_ALREADY_IN_USE: 'Este email já está sendo usado',

  PRODUCT_NAME_ALREADY_IN_USE: 'Já existe produto com esse nome',
  PRODUCT_NOT_FOUND: 'Produto não encontrado',
});

/** Textos fixos das telas usados nas assertivas. */
export const UI_TEXTS = Object.freeze({
  ADMIN_WELCOME: 'Bem Vindo',
  STORE_TITLE: 'Serverest Store',
  PRODUCT_LIST_TITLE: 'Lista dos Produtos',
});

/** Mensagens de validação de campos, geradas pela API a partir do nome do campo. */
export const VALIDATION_MESSAGES = Object.freeze({
  required: (field) => `${field} não pode ficar em branco`,
  invalidEmail: 'email deve ser um email válido',
  invalidAdminFlag: "administrador deve ser 'true' ou 'false'",
});
