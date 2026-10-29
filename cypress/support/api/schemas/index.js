import messageSchema from './message.schema.json';
import createdSchema from './created.schema.json';
import loginSchema from './login.schema.json';
import userSchema from './user.schema.json';
import productSchema from './product.schema.json';
import fieldErrorsSchema from './field-errors.schema.json';

/** Contratos (JSON Schema draft-07) das respostas da API ServeRest. */
export const SCHEMAS = Object.freeze({
  message: messageSchema,
  created: createdSchema,
  login: loginSchema,
  user: userSchema,
  product: productSchema,
  fieldErrors: fieldErrorsSchema,
});
