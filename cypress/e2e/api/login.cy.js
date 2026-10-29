import { AuthService } from '../../support/api';
import { SCHEMAS } from '../../support/api/schemas';
import { HTTP_STATUS } from '../../support/constants/http-status';
import { MESSAGES, VALIDATION_MESSAGES } from '../../support/constants/messages';
import { UserFactory, WRONG_PASSWORD } from '../../support/factories/user.factory';
import { decodeJwtPayload } from '../../support/utils/jwt';

describe('API | Autenticação', { tags: ['@api', '@login'] }, () => {
  let registeredUser;

  before(() => {
    cy.createUser().then((user) => {
      registeredUser = user;
    });
  });

  it(
    'deve autenticar com credenciais válidas e retornar um token JWT do próprio usuário',
    { tags: '@smoke' },
    () => {
      AuthService.login(registeredUser).then((response) => {
        expect(response.status).to.eq(HTTP_STATUS.OK);
        expect(response.body).to.matchSchema(SCHEMAS.login);
        expect(response.body.message).to.eq(MESSAGES.LOGIN_SUCCESS);

        const tokenPayload = decodeJwtPayload(response.body.authorization);
        expect(tokenPayload.email, 'e-mail no token').to.eq(registeredUser.email);
        expect(tokenPayload.exp, 'expiração do token').to.be.greaterThan(tokenPayload.iat);
      });
    },
  );

  // Mesma resposta para senha errada e e-mail inexistente: a API não revela quais e-mails existem.
  [
    {
      description: 'senha incorreta',
      credentials: () => ({ email: registeredUser.email, password: WRONG_PASSWORD }),
    },
    {
      description: 'e-mail não cadastrado',
      credentials: () => ({ email: UserFactory.build().email, password: registeredUser.password }),
    },
  ].forEach(({ description, credentials }) => {
    it(`não deve autenticar com ${description}`, () => {
      AuthService.login(credentials()).then((response) => {
        expect(response.status).to.eq(HTTP_STATUS.UNAUTHORIZED);
        expect(response.body).to.matchSchema(SCHEMAS.message);
        expect(response.body.message).to.eq(MESSAGES.INVALID_CREDENTIALS);
      });
    });
  });

  it('não deve autenticar sem informar e-mail e senha', () => {
    AuthService.login({ email: '', password: '' }).then((response) => {
      expect(response.status).to.eq(HTTP_STATUS.BAD_REQUEST);
      expect(response.body).to.matchSchema(SCHEMAS.fieldErrors);
      expect(response.body).to.deep.eq({
        email: VALIDATION_MESSAGES.required('email'),
        password: VALIDATION_MESSAGES.required('password'),
      });
    });
  });
});
