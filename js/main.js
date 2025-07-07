//TEST
//http://127.0.0.1:18086/index.html?userKey=test1&clientCode=gs
//http://192.168.150.38:18086/index.html?userKey=yRTQVAShFbGRSxTn2x32%2BA%3D%3D&clientCode=gs&adid=1234
// yRTQVAShFbGRSxTn2x32%2BA%3D%3D
import { fetchStats, fetchUser } from "../api/modules/kwangdongModules.js";
import {
  getOS,
  getUUID,
  fullyEncodeURIComponent,
  _replace,
  // nativeBackKey,
  webViewCheck,
  userPvIntervalCheck,
} from "../common/commonUtil.js";
import { errorToast } from "../common/error.js";
import { globalConstant } from "../common/globalConstant.js";
// import * as FlutterNativeUtil from "../js/gs/flutter_native_util.js";  // 광동 전용이라 필요없음.

//모달(약관)
const confirmTermsAgreeBtn = document.getElementById(
  "confirm_termsAgree_modal"
);
const termsAgreeModal = document.getElementById("agreePop");
const closeBtn = document.getElementById("close_btn");
const wrap = document.querySelector(".wrap");
const mainCloseBtn = document.getElementById("mainClose");

let loadGameId;
// TODO : 쿼리파라미터에서 OS 가져와야함 없을경우 getOS()
let os = getOS();
let userKey;
let clientCode; //고객사 코드
let productCode = "GATEWAY";
let prevPage;
let adid; //광고 식별자(광고 타겟팅용도)
let GLOBAL_CONSTANT; //설정(GlobalConstant)별 UI 요소
let encodeUserKey;
// window.nativeBackKey = nativeBackKey;
let isLoad = false; // 중복 호출 방지 플래그 값
let toastTimeout; // 타이머를 관리하기 위한 변수

(async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.has("userKey") || !urlParams.get("userKey")) {
    console.error("useKey 값이 없습니다.");
    errorToast("초기 설정 값 오류입니다.", "4000");
    return;
  }

  if (!urlParams.has("clientCode") || !urlParams.get("clientCode")) {
    console.error("clientCode 값이 없습니다.");
    errorToast("초기 설정 값 오류입니다.", "4000");
    return;
  }

  //첫 방문 구분
  // const isFirst = localStorage.getItem("isFirst") || true;
  // const isFirst = (await FlutterNativeUtil.getLocalData("isFirst")) || true;
  // 키우기 로딩 구분값 추가
  // await FlutterNativeUtil.setLocalData("lastLocation", "false");
  // openCoachmark(JSON.parse(isFirst));
  anickToastEvent();

  userKey = urlParams.get("userKey");

  clientCode = urlParams.get("clientCode");
  prevPage = urlParams.get("prevPage") || "https://kwangdongmart.com/";
  console.log("prevPage : ", prevPage);
  adid = urlParams.get("adid");
  GLOBAL_CONSTANT = globalConstant(clientCode);

  setAdid(adid);
  setUI(GLOBAL_CONSTANT);
  eventHandler();
  requestUserPv("GATEWAY");
})();

// 사용자 통계 저장
async function requestUserPv(type) {
  if (!userPvIntervalCheck(userKey, type, GLOBAL_CONSTANT)) {
    console.log("인터벌 주기가 지나지 않았습니다. user-pv 호출 X");
    return;
  }
  const response = await fetchStats.setUserPv({
    clientCode,
    productCode: type,
    userKey,
    contentType: type,
    os,
  });
  if (response) {
    const storageKey = `user-pv-${type}`;
    const encodeUserKey = fullyEncodeURIComponent(userKey);
    const storedData = JSON.parse(localStorage.getItem(storageKey)) || {};
    storedData[encodeUserKey] = Date.now();
    localStorage.setItem(storageKey, JSON.stringify(storedData));
    return response;
  }
}

//adid가 없을 경우 방어 로직
async function setAdid(uuId) {
  if (
    !uuId ||
    uuId.trim() === "" ||
    uuId === "00000-000-000000-00000" ||
    uuId === "ios_option_disabled" ||
    uuId === "00000000-0000-0000-0000-000000000000" ||
    uuId === "null" ||
    uuId === "undefined"
  ) {
    adid = getUUID();
  }
  // localStorage.setItem("adid", adid);
  // await FlutterNativeUtil.setLocalData("adid", adid);
}

//GLOBAL_CONSTANT 기준으로 동적 UI 생성
function setUI(GLOBAL_CONSTANT) {
  const {
    PLAY_ZONE_INFO,
    USE_RAISING,
    USE_MILEAGE,
    USE_AD_SCRIPT,
    TITLE,
    LOGO_SRC,
    USE_TITLE_TYPE,
  } = GLOBAL_CONSTANT;

  const logoWrap = document.querySelector(".logo");
  const playWrap = document.querySelector(".play_wrap");
  const raisingWrap = document.querySelector(".main_game_wrap");
  const adgWrap = document.querySelector(".ad_img_wrap");

  if (logoWrap) {
    logoWrap.textContent = TITLE;

    if (USE_TITLE_TYPE === "IMG") {
      logoWrap.style.background = `url(${LOGO_SRC}) no-repeat center `;
      logoWrap.style.backgroundSize = "100%";
    } else {
      // logoWrap.style.background = "none";
      // logoWrap.style.fontSize = "1.6rem";
      // logoWrap.style.width = "auto";
      // logoWrap.style.height = "auto";
    }
  }

  if (playWrap && PLAY_ZONE_INFO) {
    playWrap.innerHTML = "";
    playWrap.style.flexWrap = "wrap";
    PLAY_ZONE_INFO.forEach((GAME) => {
      const li = document.createElement("li");

      const playButton = document.createElement("div");
      playButton.className = `play_btn ${GAME.TYPE} auth_btn`;
      playButton.id = GAME.TYPE;

      const textDiv = document.createElement("div");
      textDiv.className = "text";

      const nameParagraph = document.createElement("p");
      nameParagraph.textContent = GAME.NAME;

      const contentParagraph = document.createElement("p");
      contentParagraph.textContent = GAME.CONTENT;

      textDiv.appendChild(nameParagraph);
      textDiv.appendChild(contentParagraph);
      playButton.appendChild(textDiv);
      li.appendChild(playButton);
      playWrap.appendChild(li);
    });

    // if (USE_MILEAGE !== "N") {
    //   const myPointWrap = document.createElement("div");
    //   const myPointText = document.createElement("div");
    //   const myPoint = document.createElement("p");
    //   const myPointContent = document.createElement("p");
    //   const li = document.createElement("li");

    //   myPointWrap.className = "my_point_btn auth_btn";
    //   myPointWrap.id = "mileage";
    //   myPointText.className = "text";
    //   myPoint.textContent = "내 마일리지";
    //   myPointContent.textContent = "적립한 마일리지를 포인트로 전환하세요!";
    //   myPointText.appendChild(myPoint);
    //   myPointText.appendChild(myPointContent);
    //   myPointWrap.appendChild(myPointText);
    //   li.appendChild(myPointWrap);

    //   playWrap.appendChild(li);
    // }
  }

  if (raisingWrap && USE_RAISING === "N") {
    raisingWrap.style.display = "none";
  }

  if (adgWrap && USE_AD_SCRIPT === "N") {
    adgWrap.style.display = "none";
  }
  // else {
  //   console.log("광고 호출!");
  //   const adScript = document.createElement("script");
  //   adScript.type = "text/javascript";

  //   adScript.referrerPolicy = "no-referrer-when-downgrade";
  //   adScript.src = "https://worker.gsr-ads.co.kr/NetInsight/js/zaBNAVKn";
  //   adgWrap.appendChild(adScript);
  // }
}

function eventHandler() {
  mainCloseBtn.addEventListener("click", () => {
    console.log("메인 닫기! : ", prevPage);
    window.location.replace(prevPage || "https://kwangdongmart.com/");
    // FlutterNativeUtil.finish();
  });

  //인증 필요한 버튼 리스트
  const authBtns = document.querySelectorAll(".auth_btn");
  authBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      if (!isLoad) authLoad(e);
    })
  );
  closeBtn.addEventListener("click", () => onToggle("termsAgree"));

  confirmTermsAgreeBtn.addEventListener("click", () =>
    termsAgreeConfirm(loadPage)
  );
}

//인증 후 게임 실행
async function authLoad(e) {
  //중복 요청 방지
  isLoad = true;
  //실행 게임 id 값
  const { id } = e.currentTarget;
  // 키우기 실행시 준비중 토스트 출력
  console.log("toast : id", id);
  if (id === "raising") {
    showReadyToast();
    isLoad = false;
    return;
  }

  loadGameId = id;

  const isAuth = await userAuthentication();

  if (isAuth) {
    loadPage(loadGameId);
  }
  isLoad = false;
}

function showReadyToast() {
  const toastDiv = document.querySelector(".check");
  if (toastDiv) {
    console.log("토스트 표시");
    toastDiv.classList.remove("show");

    // 타이머가 동작 중이면 초기화
    if (toastTimeout) {
      clearTimeout(toastTimeout);
      toastTimeout = null;
    }

    // `show` 클래스를 추가하고 타이머 설정
    toastDiv.classList.add("show");

    toastTimeout = setTimeout(() => {
      toastDiv.classList.remove("show");
      toastTimeout = null; // 타이머 초기화
      console.log("토스트 숨김");
    }, 3000);
  }
}

//인증 모달 토글창
function onToggle(type) {
  if (!type) return;
  const modal = type === "termsAgree" ? termsAgreeModal : "";
  if (modal) {
    const isOpen = modal.classList.contains("show");
    isOpen ? modal.classList.remove("show") : modal.classList.add("show");
  }
}

// 사용자 인증 (회원 & 약관동의)
async function userAuthentication() {
  let isAuth = true;
  const response = await fetchUser.setProfile({
    clientCode,
    productCode,
    userKey,
    adid,
    os,
  });

  if (response) {
    console.log(" setProfile response : ", response);
    let { userKey, newUserYn, termsAgreeYn, termsAgreePossibleTime } =
      response.data;
    // localStorage.setItem("userKey", userKey);
    // localStorage.setItem("newUserYn", newUserYn);
    // localStorage.setItem("termsAgreeYn", termsAgreeYn);

    //약관철회 후 24시간이 지나지않았으면 서비스 이용 불가
    if (termsAgreePossibleTime === "00:00:00") {
      isAuth = checkTerms(termsAgreeYn);
    } else {
      isAuth = false;
      openWithdrwaPop();
    }
  }
  return isAuth;
}

function checkTerms(termsAgreeYn) {
  let isTerms = true;
  //약관 미동의 회원이면서 약관 사용 옵션이 설정되어있을 경우
  if (termsAgreeYn === "N" && GLOBAL_CONSTANT.USE_TERMS === "Y") {
    //약관동의 모달 오픈
    onToggle("termsAgree");
    isTerms = false;
  }

  return isTerms;
}

//약관 모달 동의 이벤트
//TODO 약관동의에 대한 옵션값 체크는 내부에서 진행하도록,
async function termsAgreeConfirm(callback) {
  const termsResponse = await fetchUser.patchTerms({
    clientCode,
    productCode,
    userKey,
  });

  if (termsResponse) {
    const { resultMessage } = termsResponse;

    //callback함수가 있을경우
    if (resultMessage === "SUCCESS" && callback) {
      callback(loadGameId);
    }
    //약관 동의 팝업 닫기
    onToggle("termsAgree");
  }
}

function loadPage(type) {
  const pageTypes = ["qna", "mileage", "raising"];
  let url;

  const locationURL = async (url, isAdid, type) => {
    const query = new URLSearchParams({
      userKey,
      clientCode,
      productCode: type === "qna" ? productCode : type.toUpperCase(),
      os,
      prevPage,
    });

    if (isAdid) query.append("adid", adid);

    if (type === "plus") {
      //포미션은 쿼리파라미터가 다름
      //사용통계 저장
      // const response = await requestUserPv("PPZ");
      // if (response) {
      //   // 운영
      //   // const queryString = new URLSearchParams({
      //   //   userUuId: userKey,
      //   //   userAdId: adid,
      //   // });
      //   // window.open(`${url}&${queryString.toString()}`);
      //   // 개발 (자체구축 오퍼월_로컬)
      //   // TODO : 임시 개발 서버에는 replace로 이동 운영은 기존과 동일
      //   const queryString = new URLSearchParams({
      //     clientCode,
      //     userKey,
      //     adid,
      //     os,
      //   });
      //   _replace(`${url}&${queryString.toString()}`);
      // }
    } else {
      try {
        _replace(`${url}?${query.toString()}`);

        // if (type === "point") {
        //   window.location.replace(url);
        // } else {
        //   _replace(`${url}?${query.toString()}`);
        // }
      } catch (error) {
        //_replace() 는 오리진이 틀어지면 에러가 나기때문에 에러나면 놀이터 메인으로 돌아가도록 예외처리
        window.location.replace(
          `${CONTENT_INFO.GATEWAY.URL}?${query.toString()}`
        );
      }
    }
  };

  if (!pageTypes.includes(type)) {
    url = GLOBAL_CONSTANT.PLAY_ZONE_INFO.find((el) => el.TYPE === type).URL;
  } else {
    url = CONTENT_INFO[type.toUpperCase()].URL;
  }

  locationURL(url, true, type);
}

async function anickToastEvent() {
  const anickToast = document.getElementById("anickToast");
  // const init = await FlutterNativeUtil.getLocalData("isFirst");
  // if (init) return;
  anickToast.style.display = "block";
  anickToast.classList.add("splash_toast");
}

// function openCoachmark(isFirst) {
//   const coachmark = document.querySelector(".coachmark_wrap");
//   const imgCoachmark = document.querySelector(".imgCoachmark");
//   const closeBtn = document.getElementById("coachClose");

//   if (coachmark && isFirst) {
//     // 성능 문제로 코치마크 사용시에 이미지 태그 별도 삽입
//     const img = document.createElement("img");
//     img.src = "./assets/images/img_coachmark.png";
//     imgCoachmark.append(img);

//     coachmark.classList.remove("hide");
//     closeBtn.addEventListener("click", async () => {
//       coachmark.classList.add("hide");
//       anickToastEvent();
//       // localStorage.setItem("isFirst", false);
//       await FlutterNativeUtil.setLocalData("isFirst", false);
//     });
//   }
// }

function openWithdrwaPop() {
  const withdrwaPop = document.getElementById("withdrwaPop");
  const confirmWithdrwa = document.getElementById("confirmWithdrwa");

  if (withdrwaPop && confirmWithdrwa) {
    withdrwaPop.classList.add("show");
    confirmWithdrwa.addEventListener("click", () => {
      withdrwaPop.classList.remove("show");
    });
  }
}
