/* eslint-disable no-undef */
const { add } = require('./permiss');

test('add function adds two numbers', () => {
  expect(add(1, 2)).toBe(3);
});
