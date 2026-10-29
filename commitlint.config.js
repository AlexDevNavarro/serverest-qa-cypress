module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // As mensagens são escritas em português, então não exigimos caixa baixa no assunto.
    'subject-case': [0],
    'body-max-line-length': [2, 'always', 100],
  },
};
