import semafor from 'semafor';

export const log = semafor();
export const isObject = obj => obj && typeof obj === 'object';

export const mergeDeep = (...objects) =>
  objects.reduce((prev, next) => {
    Object.keys(next).forEach(key => {
      const pVal = prev[key];
      const nVal = next[key];

      if (Array.isArray(pVal) && Array.isArray(nVal)) {
        prev[key] = pVal.concat(...nVal);
      } else if (isObject(pVal) && isObject(nVal)) {
        prev[key] = mergeDeep(pVal, nVal);
      } else {
        prev[key] = nVal;
      }
    });

    return prev;
  }, {});
