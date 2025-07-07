import { errorToast } from "../../common/error.js";
import WebNetwork from "../common/webNetwork.js";

// 로컬
// const BASE_URL = "http://192.168.150.60:8083/kwangdong/playground";

// 개발
// const BASE_URL = "https://dev-api.commsad.com";

// 운영
const BASE_URL = "https://api.commsad.com";

const clientCode = "kwangdong";

/** GateWay API 모델
 * api 통신 설정
 * method, path, query, body, token
 */
export const user = {
  request: {
    //회원 조회 및 회원 가입 통합 api (userKey가 있으면 update 없으면 insert)
    post: async (body) => {
      const webNetwork = new WebNetwork(BASE_URL);
      const request = webNetwork.createRequest({
        method: "POST",
        path: `/${clientCode}/user`,
        bodyParams: body,
        bearerToken: "namgoong.soo.yeong",
      });

      const data = await webNetwork.fetch(request);
      return data;
    },

    patch: async (body) => {
      const webNetwork = new WebNetwork(BASE_URL);
      const request = webNetwork.createRequest({
        method: "PATCH",
        path: `/${clientCode}/user`,
        bodyParams: body,
        bearerToken: "namgoong.soo.yeong",
      });
      const data = await webNetwork.fetch(request);
      return data;
    },
  },

  response: {
    post: (response) => {
      //status코드가 200인데 resultCode 가 0000(성공) 이 아닐경우 에러토스트 출력
      if (response.resultCode === "0000") {
        const baseResponse = {
          resultCode: response.resultCode,
          resultMessage: response.resultMessage,
          data: {
            userKey: response.data.userKey,
            adid: response.data.adid,
            os: response.data.os,
            newUserYn: response.data.newUserYn,
            termsAgreeYn: response.data.termsAgreeYn,
            lastLoginDate: response.data.lastLoginDate,
            termsAgreePossibleTime: response.data.termsAgreePossibleTime,
          },
        };
        return baseResponse;
      } else {
        console.error(
          `[Error kwangdongPacket] resultMessage : ${response.resultMessage}   /  resultCode : ${response.resultCode}`
        );
        errorToast(response.resultMessage, response.resultCode);
        return null;
      }
    },
    patch: (response) => {
      //status코드가 200인데 resultCode 가 0000(성공) 이 아닐경우 에러토스트 출력
      if (response.resultCode === "0000") {
        const baseResponse = {
          resultCode: response.resultCode,
          resultMessage: response.resultMessage,
          data: {
            userKey: response.data.userKey,
            adid: response.data.adid,
            os: response.data.os,
            lastLoginDate: response.data.lastLoginDate,
          },
        };
        return baseResponse;
      } else {
        console.error(
          `[Error kwangdongPacket] resultMessage : ${response.resultMessage}   /  resultCode : ${response.resultCode}`
        );
        errorToast(response.resultMessage, response.resultCode);
        return null;
      }
    },
  },
};

export const stats = {
  request: {
    //사용 통계 저장
    post: async (body) => {
      const webNetwork = new WebNetwork(BASE_URL);
      const request = webNetwork.createRequest({
        method: "POST",
        path: `/${clientCode}/stats/user-pv`,
        bodyParams: body,
        bearerToken: "namgoong.soo.yeong",
      });

      const data = await webNetwork.fetch(request);
      return data;
    },
  },
  response: {
    post: (response) => {
      //status코드가 200인데 resultCode 가 0000(성공) 이 아닐경우 에러토스트 출력
      if (response.resultCode === "0000") {
        const baseResponse = {
          resultCode: response.resultCode,
          resultMessage: response.resultMessage,
        };
        return baseResponse;
      } else {
        console.error(
          `[Error kwangdongPacket] resultMessage : ${response.resultMessage}   /  resultCode : ${response.resultCode}`
        );
        errorToast(response.resultMessage, response.resultCode);
        return null;
      }
    },
  },
};
