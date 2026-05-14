export const secureRandomInt = (max) => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  const limit = Math.floor(0xFFFFFFFF / max) * max;
  let value = array[0];
  while (value >= limit) {
    window.crypto.getRandomValues(array);
    value = array[0];
  }
  return value % max;
};
