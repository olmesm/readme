export const uid = () => {
  //   from https://levelup.gitconnected.com/generate-unique-id-in-the-browser-without-a-library-50618cdc3cb1
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return uint32.toString(16);
};
