import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

/** Reaproveita o validador já compilado quando o schema possui $id. */
const getValidator = (schema) => (schema.$id && ajv.getSchema(schema.$id)) || ajv.compile(schema);

/**
 * Assertiva Chai para validação de contrato:
 *   expect(response.body).to.matchSchema(SCHEMAS.user)
 *
 * Em caso de falha, a mensagem lista todos os campos que violaram o contrato.
 */
chai.use((_chai) => {
  _chai.Assertion.addMethod('matchSchema', function (schema) {
    const validate = getValidator(schema);
    const isValid = validate(this._obj);
    const schemaName = schema.title || schema.$id;

    this.assert(
      isValid,
      `expected response body to match schema "${schemaName}", but: ${ajv.errorsText(validate.errors)}`,
      `expected response body not to match schema "${schemaName}"`,
    );
  });
});
