/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable camelcase */

import { KEY_HEADERS, KEY_BODY } from '@/constants/common';
import { isEmpty } from '@/utils/helper';
export const CONTENT_TYPE_URL_ENCODED = 'application/x-www-form-urlencoded;charset=UTF-8';
export const CONTENT_TYPE_APPLICATION = 'application/json';

/**
 * @param {object} data json object that contains key value for request to server
 * This will take data as JSON Object and return in Form of json Object and encode the url
 * @returns {object} This function will return object that hold url encoded data
 */
export const getFormDataObjForUrlEn = (data) => {
  const formData = Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
  return formData;
};

/**
 * @param {object} data json object that contains key value for get Form object
 * @returns {object} this will return Form object that will use for Muiltipart request
 * This will take data as JSON Object and return in Form Data Object or Multipart Object
 */
export const getFormDataFromObject = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === 'object') {
      let dataValue = data[key];
      if (dataValue != null) {
        dataValue = JSON.stringify(dataValue);
        dataValue = dataValue.replace(/\\/g, '');
      }
      if (dataValue !== undefined && dataValue !== null) {
        formData.append(key, dataValue);
      }
    } else if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });
  return formData;
};

/**
 *This function for get data from server without dispatch
 *
 * @param {string} apiUrl for fetching data
 * @param {object} reqObj is an json object that contains request for call Api
 * @returns {object} This will return an response object
 */
export const fetchDataFromServerWithoutDispatch = async (apiUrl, reqObj) => {
  try {
    if (!apiUrl || !reqObj) {
      return Promise.reject({
        failed: true,
        message: 'Invalid arguments: apiUrl and reqObj are required',
        apiUrl,
      });
    }
    if (apiUrl) {
           const response = await fetch(apiUrl, reqObj);
      console.log("response in other function: ",response);
      
      if (response.status === 200) {
       
        return response.json();
      }
      if (response.status === 204) {
        return response;
      }
      const errorResponse = {
        failed: true,
        statusText: response.statusText,
        status: response.status,
        apiUrl,
      };
      // Need to handle proper way after release
      if (response.status === 406) {
        return response
          .json()
          .then((res) => res)
          .catch(() => new Promise((res, rej) => rej(errorResponse)));
      }
      return new Promise((res, rej) => rej(errorResponse));
    }
  } catch (error) {
    return new Promise((res, rej) => rej(error));
  }
};

/**
 * @param {object} data json object that contains key value for request to server
 * @param {string} apiUrl Api url for request
 * @param {string} methodType Method type like post, get or delete etc.
 * @param {object} extraHeades Extra header that holds header information
 * @param {object} abortController This is an object that hold abort controller information
 * @returns {object} This will return response data that get from server
 */
export const fetchApi = async (data={}, apiUrl, methodType, extraHeades={}, abortController=null) => {
  const reqObj = {
    method: methodType,
    headers:{'Content-Type': CONTENT_TYPE_APPLICATION}
  };
  let timeoutId;
  if (abortController) {
    reqObj.signal = abortController.signal;
  }

  console.log("extraHeades: ",extraHeades);
  console.log("data: ",data);
  

 
  if (!isEmpty(extraHeades) && extraHeades && Object.keys(extraHeades).length > 0) {
    reqObj.headers = { ...reqObj.headers, ...extraHeades };
  }
  if (methodType == 'post' || methodType == 'put' || methodType == 'delete') {
    console.log("reqObj: ",reqObj);
    
    if (data !== undefined && data !== null) {
      let formData=data;
      if (
        reqObj[KEY_HEADERS] &&
        reqObj[KEY_HEADERS]['Content-Type'] &&
        reqObj[KEY_HEADERS]['Content-Type'] === CONTENT_TYPE_URL_ENCODED
      ) {
        formData = getFormDataObjForUrlEn(data);
      } else if (
        reqObj[KEY_HEADERS] &&
        reqObj[KEY_HEADERS]['Content-Type'] &&
        reqObj[KEY_HEADERS]['Content-Type'] === CONTENT_TYPE_APPLICATION
      ) {

        formData = JSON.stringify(data);
        console.log("formData: ",formData);
        
      } else {
        formData = getFormDataFromObject(data);
      }
      reqObj[KEY_BODY] = formData;
    }
  }

  try {
    const result = await fetchDataFromServerWithoutDispatch(apiUrl, reqObj);
    console.log("result: ",result);
    
    return result;
  } catch (error) {
    console.log("result: error: ",error);
    
    if (timeoutId) clearTimeout(timeoutId);
    return error;
  } finally {
    // Cleanup timeout
    if (timeoutId) clearTimeout(timeoutId);
  }
};

/**
 * This funciton return api response ( promise )
 *
 * @param {string} apiUrl for fetching data
 * @param {object} reqObj is an json object that contains request for call Api
 * @returns {object} This will return response data that get from server
 */
export const fetchDataFromServerWithoutDispatch_Promise = async (apiUrl, reqObj) =>
  fetch(apiUrl, reqObj)
    .then((response) => {
      if (response.status === 200) {
        return response;
      }
      if (response.status === 204) {
        return response;
      }
      if (response.status === 401) {
        return new Promise((res, rej) =>
          rej({
            ok: false,
            redirected: false,
            status: 401,
            statusText: 'Unauthorized',
          }),
        );
      }
      return new Promise((res, rej) => rej(response));
    })
    .catch(async (error) => new Promise((res, rej) => rej(error)));

/**
 * This function for call api without dispatch with promise
 *
 * @param {object} data json object that contains key value for request to server
 * @param {string} apiUrl Api url for request
 * @param {string} methodType Method type like post, get or delete etc.
 * @param {object} extraHeades Extra header that holds header information
 * @param {object} abortController This is an object that hold abort controller information
 * @returns {object} This will return response data that get from server
 */
export const callApiWithoutDispatch_Promise = async (
  data,
  apiUrl,
  methodType,
  extraHeades,
  abortController
) => {
  const reqObj = {
    method: methodType,
  };
  if (abortController) {
    reqObj.signal = abortController.signal;
  }
  if (apiUrl.includes(URL_USER_ACCEPT_CONDTION)) {
    reqObj.headers = {
      'Content-Type': CONTENT_TYPE_APPLICATION,
      Accept: CONTENT_TYPE_APPLICATION,
    };
  }  else {
    reqObj.headers = {
      'Content-Type': CONTENT_TYPE_APPLICATION,
      Accept: CONTENT_TYPE_APPLICATION,
    };
  }
  if (!isEmpty(extraHeades) && extraHeades && Object.keys(extraHeades).length > 0) {
    reqObj.headers = { ...reqObj.headers, ...extraHeades };
  }
  if (methodType === 'post') {
    if (data !== undefined && data !== null) {
      let formData;
      if (
        reqObj[KEY_HEADERS] &&
        reqObj[KEY_HEADERS]['Content-Type'] &&
        reqObj[KEY_HEADERS]['Content-Type'] === CONTENT_TYPE_URL_ENCODED
      ) {
        formData = getFormDataObjForUrlEn(data);
      } else if (
        reqObj[KEY_HEADERS] &&
        reqObj[KEY_HEADERS]['Content-Type'] &&
        reqObj[KEY_HEADERS]['Content-Type'] === CONTENT_TYPE_APPLICATION
      ) {
        formData = JSON.stringify(data);
      } else {
        formData = getFormDataFromObject(data);
      }
      reqObj[KEY_BODY] = formData;
    }
    return fetchDataFromServerWithoutDispatch_Promise(apiUrl, reqObj);
  }
  if (methodType === 'get') {
    return fetchDataFromServerWithoutDispatch_Promise(apiUrl, reqObj);
  }
  return null;
};
