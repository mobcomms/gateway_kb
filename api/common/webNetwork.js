import { errorToast } from "../../common/error.js";
import { baseResponse } from "./baseResponse.js";
/** 기본 api 통신모듈
 *  baseURL  정의
 */
class WebNetwork {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  createRequest({
    method,
    path,
    queryParams,
    bodyParams,
    headers,
    bearerToken,
  }) {
    const url = new URL(this.baseURL + path);

    if (queryParams) {
      Object.keys(queryParams).forEach((key) => {
        url.searchParams.append(key, queryParams[key]);
      });
    }

    const requestOptions = {
      method,
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        ...headers,
      }),
    };

    if (bearerToken) {
      requestOptions.headers.set("Authorization", `Bearer ${bearerToken}`);
    }

    if (
      bodyParams &&
      (method === "POST" || method === "PUT" || method === "PATCH")
    ) {
      requestOptions.body = JSON.stringify(bodyParams);
    }

    return new Request(url, requestOptions);
  }

  async fetch(request) {
    try {
      const response = await fetch(request);
      const data = await response.json();
      const defaultResponse = baseResponse(data);
      const isError = response.status !== 200;

      if (isError) {
        const error = new Error(`${defaultResponse.resultMessage}`);
        error.status = defaultResponse.resultCode;
        throw error;
      }

      return defaultResponse;
    } catch (error) {
      console.error(
        "에러 메세지 : ",
        error.message,
        "  상태코드 : ",
        error.status
      );
      errorToast(error.message, error.status);
      throw error;
    }
  }
}

export default WebNetwork;
