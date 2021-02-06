export default function apiRequest(url, requestOptions, requestName) {
  // eslint-disable-next-line no-undef
  const controller = new AbortController();

  const onSuccess = (response) => {
    // log each request response
    console.log(`${requestName} success response -`, response);
    return response;
  };
  const onError = function (error) {
    if (error.name === 'AbortError') { // handle abort()
      console.log('Aborted!');
    } else if (error.response) {
      // some error happened with the server side
      console.log(`${requestName} error response -`, error.response);
    } else {
      // some error happened while processing the request
      console.error(`${requestName} error processing request -`, error.message);
    }
    // return Promise.reject(error.response || error.message);
  };

  const timeoutId = setTimeout(() => controller.abort(), 7000);

  return fetch(url, { ...requestOptions, signal: controller.signal })
    .then((response) => {
      clearTimeout(timeoutId);
      return response.json();
    })
    .then(onSuccess)
    .catch(onError);
}
