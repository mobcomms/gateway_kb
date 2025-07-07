/** API 응답값 정의
 *  공통 파라미터 정의 및 기타 파라미터
 *
 * @param {object} response
 * @returns
 */
export function baseResponse(response) {
  const defaultResponse = {
    result_message: response.result_message,
    result_code: response.result_code,
    resultMessage: response.resultMessage,
    resultCode: response.resultCode,
    data: response.data,
    datas: response.datas,
    errcode: response.errcode,
    errstr: response.errstr,
  };

  //defaultResponse에 정의 되지 않은 응답 파라미터가 있다면 추가
  for (const key in response) {
    if (!defaultResponse.hasOwnProperty(key)) {
      defaultResponse[key] = response[key];
    }
  }
  //기본 키에 값이 없을 경우 삭제
  for (const key in defaultResponse) {
    if (defaultResponse[key] === undefined) {
      delete defaultResponse[key];
    }
  }
  return defaultResponse;
}
