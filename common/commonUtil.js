// import * as FlutterNativeUtil from "../js/gs/flutter_native_util.js";
//uuid 생성 (32개의 16진수)
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
/**adid가 없을 경우 방어 함수
 *
 * @returns newAdid string
 */
function getUUID() {
  const uuid = uuidv4();
  const newAdid = "noadid" + uuid.slice(6);

  return newAdid;
}
//현재 실행된 플랫폼 정보
function getOS() {
  let userAgent = navigator.userAgent;
  let result;
  if (userAgent.match(/iPhone/i) || userAgent.match(/iPad/i)) {
    // iOS
    result = "ios";
  } else if (userAgent.match(/Android/i)) {
    // Android
    result = "aos";
  } else {
    result = "pc";
  }
  // console.log("getOS userAgent : ", userAgent);
  return result;
}

/** userKey 인코딩 GET 방식 호출 할때 사용
 *
 * @param {*} value
 * @returns
 */
function fullyEncodeURIComponent(value) {
  return encodeURIComponent(value)
    .replace(/\+/g, "%2B") // + 기호 처리
    .replace(/\=/g, "%3D") // = 기호 처리
    .replace(/&/g, "%26") // & 기호 처리
    .replace(/#/g, "%23") // # 기호 처리
    .replace(/\//g, "%2F") // / 기호 처리
    .replace(/\?/g, "%3F") // ? 기호 처리
    .replace(/:/g, "%3A") // : 기호 처리
    .replace(/@/g, "%40") // @ 기호 처리
    .replace(/\$/g, "%24"); // $ 기호 처리
}

/** 기존 replace 개선 함수
 *
 * 안드로이드환경에서 window.location.replace 통해 페이지 전환시 history가 쌓이는 경우 발생 이를 개선한 함수
 * * replaceState 활용  : 페이지 이동시 히스토리 객체를 수정하여 기록을 남기지 않는 방식, 출처가 다른경우 에러 발생됨.
 * (참고) local 개발 환경일때는 replaceState를 태우면 안됨 (프로젝트 별 오리진이 달라져서 에러남)
 * @param {string} url
 */
function _replace(url) {
  const isLocal = false; //로컬 개발 유무 (Local  O : true Local x : false) * 배포전 false로 변경
  if (history.replaceState && !isLocal) {
    // history의 replaceState 기능이 사용 가능한 경우
    history.replaceState(null, document.title, url);
    history.go(0);
  } else {
    // history의 replaceState 기능이 사용 가능하지 않은 경우
    window.location.replace(url);
  }
}
/** 네이티브 물리 BackKey 콜백함수
 *  네이티브 BackKey 클릭시 이벤트 동작 함수 (헤더 뒤로가기 이벤트와 동일하게 동작하도록 설정)
 * GS 콜백 함수
 */
// function nativeBackKey() {
//   console.log("놀이터 화면에서 nativeBackKey 호출!");
//   FlutterNativeUtil.finish();
// }
/** webVIew 체크 함수
 * 각 OS별 네이티브 webView 설정 객체 유무로 webView 판단을 대신함
 * 더 정확하게 하기위해서는 네이티브에서 useAgent쪽에 특정 문자열을 넣어주는 방식도 있음
 * @returns
 */
function isWebView() {
  console.log("isWebView window: ", window);
  // iOS WebView 구분 (window.webkit 존재 여부 확인)
  if (window.webkit && window.webkit.messageHandlers) {
    console.log("IOS 웹뷰 입니다!!!!!!");
    return true;
  }

  // Android WebView 구분 (window.AndroidInterface 등 네이티브 인터페이스 확인)
  if (window.AndroidInterface) {
    console.log("안드로이드 웹뷰 입니다!!!!!!");
    return true;
  }
  console.log("기본 브라우저 입니다.");
  return false; // 기본 브라우저 환경
}
function webViewCheck() {
  console.log("============== webView Check!! start ==============");
  isWebView();
  getOS();
  console.log("============== webView Check!! end ==============");
}

function getCallInterval(GLOBAL_CONSTANT) {
  return GLOBAL_CONSTANT.CALL_INTERVALS[GLOBAL_CONSTANT.CURRENT_INTERVAL];
}

/** user-pv API 주기 체크 (임시)
 *  추후 서버에서 주기 체크 수정 예정 그 전까지 로컬스토리지 활용
 * @param const EncodeUserKey = fullyEncodeURIComponent(userKey) 사용자 키
 * @param content 콘텐츠 유형
 * @param GLOBAL_CONSTANT API 호출 주기 설정
 * @returns 호출 가능 여부 (true: 호출 가능, false: 호출 불가)
 */
function userPvIntervalCheck(userKey, content, GLOBAL_CONSTANT) {
  const storageKey = `user-pv-${content}`;
  const storedData = JSON.parse(localStorage.getItem(storageKey)) || {};
  const EncodeUserKey = fullyEncodeURIComponent(userKey);
  const lastCalledTime = storedData[EncodeUserKey] || 0;

  const now = Date.now();
  const interval = getCallInterval(GLOBAL_CONSTANT);
  console.log("user-pv Interval : ", GLOBAL_CONSTANT.CURRENT_INTERVAL);
  if (now - lastCalledTime < interval) {
    console.log("userPv 아직 호출 주기가 지나지 않음");
    return false;
  }

  return true;
}

export {
  getUUID,
  getOS,
  fullyEncodeURIComponent,
  _replace,
  // nativeBackKey,
  webViewCheck,
  userPvIntervalCheck,
};
