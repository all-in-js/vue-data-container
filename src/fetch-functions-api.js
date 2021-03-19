
import fetchFunctionsApi from '@all-in-js/fetch-functions-api'
import dataContainer from './data-container'

export default async function(opts = {}) {
  const {
    url,
    headers = {},
    successCode = 1000
  } = opts;
  const $fetch = new fetchFunctionsApi(url);
  const container = await dataContainer.create({
    headers,
    async serviceHandler(method, url, params, options) {
      let error, data;
      try {
        const res = await $fetch[method](url, params, options);
        const {
          code,
          msg,
          ...rest
        } = res;
        if (code === successCode) {
          data = {
            msg,
            ...rest
          };
        } else {
          error = msg;
        }
      } catch(e) {
        error = e;
      }
      return {
        error,
        data
      };
    }
  });

  return container;
}