import { UsersService } from '../../support/api';
import { SCHEMAS } from '../../support/api/schemas';
import { HTTP_STATUS } from '../../support/constants/http-status';
import { MESSAGES, VALIDATION_MESSAGES } from '../../support/constants/messages';
import { UserFactory } from '../../support/factories/user.factory';

describe('API | Cadastro de usuários', { tags: ['@api', '@usuarios'] }, () => {
  it(
    'deve cadastrar um usuário administrador e persistir os dados informados',
    { tags: '@smoke' },
    () => {
      const user = UserFactory.admin();

      UsersService.create(user).then((createResponse) => {
        expect(createResponse.status).to.eq(HTTP_STATUS.CREATED);
        expect(createResponse.body).to.matchSchema(SCHEMAS.created);
        expect(createResponse.body.message).to.eq(MESSAGES.REGISTER_SUCCESS);

        const { _id } = createResponse.body;
        cy.trackUserForCleanup(_id);

        UsersService.getById(_id).then((getResponse) => {
          expect(getResponse.status).to.eq(HTTP_STATUS.OK);
          expect(getResponse.body).to.matchSchema(SCHEMAS.user);
          expect(getResponse.body).to.deep.eq({ ...user, _id });
        });
      });
    },
  );

  it('não deve cadastrar usuário com e-mail já utilizado por outro cadastro', () => {
    cy.createUser().then((existingUser) => {
      const userWithSameEmail = UserFactory.build({ email: existingUser.email });

      UsersService.create(userWithSameEmail).then((response) => {
        expect(response.status).to.eq(HTTP_STATUS.BAD_REQUEST);
        expect(response.body).to.matchSchema(SCHEMAS.message);
        expect(response.body.message).to.eq(MESSAGES.EMAIL_ALREADY_IN_USE);
      });

      UsersService.list({ email: existingUser.email })
        .its('body.quantidade')
        .should('eq', 1, 'o e-mail continua associado a um único usuário');
    });
  });

  it('não deve cadastrar usuário com dados inválidos e deve informar o erro de cada campo', () => {
    const invalidUser = { nome: '', email: 'email-invalido', password: '', administrador: 'sim' };

    UsersService.create(invalidUser).then((response) => {
      expect(response.status).to.eq(HTTP_STATUS.BAD_REQUEST);
      expect(response.body).to.matchSchema(SCHEMAS.fieldErrors);
      expect(response.body).to.deep.eq({
        nome: VALIDATION_MESSAGES.required('nome'),
        email: VALIDATION_MESSAGES.invalidEmail,
        password: VALIDATION_MESSAGES.required('password'),
        administrador: VALIDATION_MESSAGES.invalidAdminFlag,
      });
    });
  });
});
