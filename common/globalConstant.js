export function globalConstant(COMPANY_CODE) {
  let GLOBAL_CONSTANT = {
    COMPANY_CODE: "",
    TITLE: "",
    LOGO_SRC: "",
    USE_TITLE_TYPE: "", //제목 타입 (IMG  || TEXT)
    USE_TERMS: "", //약관 동의 사용 여부
    USE_RAISING: "", //키우기 사용  여부
    USE_MILEAGE: "", //마일리지 사용 여부
    USE_AD_SCRIPT: "", //광고 스크립트 사용 여부
    PLAY_ZONE_INFO: [],
  };

  return setGlobalConstant(GLOBAL_CONSTANT, COMPANY_CODE);
}

function setGlobalConstant(GLOBAL_CONSTANT, COMPANY_CODE) {
  switch (COMPANY_CODE) {
    case "kwangdong":
      GLOBAL_CONSTANT.COMPANY_CODE = "KwangDong";
      GLOBAL_CONSTANT.TITLE = "광동상회";
      GLOBAL_CONSTANT.LOGO_SRC = "";
      GLOBAL_CONSTANT.USE_TITLE_TYPE = "TEXT";
      GLOBAL_CONSTANT.USE_TERMS = "Y";
      GLOBAL_CONSTANT.USE_RAISING = "Y";
      GLOBAL_CONSTANT.USE_MILEAGE = "Y";
      GLOBAL_CONSTANT.USE_AD_SCRIPT = "N";
      GLOBAL_CONSTANT.CALL_INTERVALS = {
        DAILY: 24 * 60 * 60 * 1000, // 1일 (24시간)
        HOURLY: 60 * 60 * 1000, // 1시간
        EVERY_30_MIN: 30 * 60 * 1000, // 30분
        EVERY_5_SEC: 5 * 1000, //5초
      };
      GLOBAL_CONSTANT.CURRENT_INTERVAL = "DAILY"; // 여기서 간격 설정 가능: "DAILY", "HOURLY", "EVERY_30_MIN"
      GLOBAL_CONSTANT.PLAY_ZONE_INFO = [
        {
          NAME: "행운 룰렛",
          CONTENT: "행운룰렛을 돌리고 상품받아가세요.",
          TYPE: "roulette",
          // URL: "https://dev-web.commsad.com/playzone/roulette", // 개발
          URL: "https://web.commsad.com/playzone/roulette", // 운영
        },
        {
          NAME: "사다리 타기",
          CONTENT: "사다리타기를 해보세요.",
          TYPE: "ladder",
          // URL: "https://dev-web.commsad.com/playzone/ladder", // 개발
          URL: "https://web.commsad.com/playzone/ladder", // 운영
        },
        {
          NAME: "혜택상자", //머니박스
          CONTENT: "혜택상자를 열어보세요.",
          TYPE: "moneybox",
          // URL: "https://dev-web.commsad.com/moneybox/fullpage", // 개발 - 광동전용
          URL: `https://web.commsad.com/moneybox/fullpage`, //운영
        },
        {
          NAME: "내 포인트",
          CONTENT: "적립 내역을 확인하세요!",
          TYPE: "reward",
          // URL: "https://dev-web.commsad.com/rewardList", // 개발 - 광동전용
          URL: "https://web.commsad.com/rewardList", //운영
        },
      ];
      break;
  }

  return GLOBAL_CONSTANT;
}
