// 환경 설정 (local(로컬), dev, prod)
const ENV = "prod"; // 필요한 환경으로 변경: "local", "dev", "prod"

// 환경별 URL 설정
const URLS = {
  local: {
    QNA: "http://192.168.150.38:18088/qna.html",
    MILEAGE: "http://192.168.150.38:18087/mypoint.html",
    RAISING: "http://gs25.gsretail.com/gscvs/ko/store-services/woodongs",
    GATEWAY: "http://192.168.150.38:18086/index.html",
  },
  dev: {
    QNA: "https://dev-web.commsad.com/qna",
    MILEAGE: "https://dev-web.commsad.com/mileage",
    RAISING: "https://dev-web.commsad.com/raising",
    GATEWAY: "https://dev-web.commsad.com/gateway",
  },
  prod: {
    QNA: "https://web.commsad.com/qna",
    MILEAGE: "https://web.commsad.com/mileage",
    RAISING: "https://web.commsad.com/raising",
    GATEWAY: "https://web.commsad.com/gateway",
  },
};

// 환경에 맞는 CONTENT_INFO 생성 함수
function getContentInfo(env) {
  const urls = URLS[env];

  return {
    QNA: {
      TYPE: "qna",
      TITLE: "문의하기",
      URL: urls.QNA,
    },
    MILEAGE: {
      TYPE: "mileage",
      TITLE: "마일리지",
      URL: urls.MILEAGE,
    },
    RAISING: {
      TYPE: "raising",
      TITLE: "키우기",
      URL: urls.RAISING,
    },
    GATEWAY: {
      TYPE: "gateway",
      TITLE: "놀이터",
      URL: urls.GATEWAY,
    },
  };
}

// 현재 환경에 맞는 CONTENT_INFO 불러오기
let CONTENT_INFO = getContentInfo(ENV);

const PRODUCT = {
  GS: {
    CONTENT_INFO,
  },
};
