import { fakerPT_BR as faker } from '@faker-js/faker';

/**
 * Factory de produtos no formato aceito pelo endpoint POST /produtos.
 * O nome recebe um sufixo único porque a API não aceita produtos com nome repetido.
 */
export const ProductFactory = {
  build(overrides = {}) {
    return {
      nome: `${faker.commerce.productName()} ${Date.now()}${faker.string.numeric(3)}`,
      preco: faker.number.int({ min: 10, max: 5000 }),
      descricao: faker.commerce.productDescription(),
      quantidade: faker.number.int({ min: 1, max: 500 }),
      ...overrides,
    };
  },
};
