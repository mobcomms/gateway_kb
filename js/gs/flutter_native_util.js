export const isFlutter = () => !!window.flutter_inappwebview;
export const isAndroid = () =>
  navigator.userAgent.match(/woodongs_android_/) != null;
export const isiOS = () => navigator.userAgent.match(/woodongs_ios_/) != null;
export function flutterPostMessage(name, params, useConsoleLog = true) {
  if (useConsoleLog) {
    console.log("[Native]", name, JSON.stringify(params));
  }
  if (isFlutter()) {
    if (window.flutter_inappwebview.callHandler) {
      return window.flutter_inappwebview.callHandler(name, params);
    } else {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          flutterPostMessage(name, params, useConsoleLog)
            .then(resolve)
            .catch(reject);
        }, 100);
      });
    }
  }
}
/**
 * history back, back할 page가 없으면 window close
 */
export function goBack() {
  if (isFlutter()) {
    flutterPostMessage("goBack");
  } else {
    window.history.back();
  }
}
/**
 * webview close
 * @param data 앱에 전달할 데이터
 */
export function finish(data) {
  if (isFlutter()) {
    flutterPostMessage("finish", data);
  } else {
    window.close();
  }
}

/**
 * 외부 브라우저를 실행하여 페이지를 표시한다.
 * @param url
 */
export function launchExternal(url) {
  if (isFlutter()) {
    flutterPostMessage("launchExternal", url);
  } else {
    window.open(url, "_blank");
  }
}
/**
 * 외부 브라우저 앱을 실행하여 페이지를 표시한다.
 * @param url
 */
export function launchExternalApplication(url) {
  if (isFlutter()) {
    flutterPostMessage("launchExternalApplication", url);
  } else {
    window.open(url, "_blank");
  }
}
/**
 * 광고 아이디 (ADID/IDFA) 취득
 */
export function getAdId() {
  if (isFlutter()) {
    return flutterPostMessage("getAdId");
  } else {
    return "";
  }
}
/**
 * 암호화 고객 번호 취득
 */
export function getEncryptCustomerNumber() {
  if (isFlutter()) {
    return flutterPostMessage("getEncryptCustomerNumber");
  } else {
    return "";
  }
}
/**
 * App buildNumber 취득
 */
export function getBuildNumber() {
  if (isFlutter()) {
    return flutterPostMessage("getBuildNumber");
  } else {
    return "99999";
  }
}

/**
 * (우리동네GS 놀이터 지원용 ) 내부 브라우징에 사용할 host 설정.
 * @param hostArray
 */
export function configureHostListForInternalBrowsing(hostArray) {
  if (isFlutter()) {
    return flutterPostMessage(
      "configureHostListForInternalBrowsing",
      hostArray
    );
  }
}

/**
 * set localStorage
 */
export async function setLocalData(key, data) {
  // console.log("setLocalData 호출  key : ", key);
  if (key === null || typeof key !== "string") {
    console.log("key 정보가 있어야 합니다");
    return;
  }
  //등록
  const params = {
    key,
    data: JSON.stringify(data),
  };
  if (isFlutter()) {
    console.log("setLocalData Flutter params : ", params);
    return flutterPostMessage("setLocalData", params);
  } else {
    // console.log("getLocalData Window  key : ", key, " data :  ", data);
    localStorage.setItem(key, data);
  }
}
/**
 * get localStorage
 */
export async function getLocalData(key) {
  // console.log("getLocalData 호출  key : ", key);
  if (key === null || typeof key !== "string") {
    console.log("key 정보가 있어야 합니다");
    return;
  }
  const params = {
    key,
  };
  if (isFlutter()) {
    // console.log("getLocalData Flutter params : ", params);
    return flutterPostMessage("getLocalData", params);
  } else {
    // console.log("getLocalData Window key : ", key);
    return localStorage.getItem(key);
  }
}

export function openConfirmDialog(
  message,
  left,
  right,
  subMessage,
  subImageUrl,
  subImageWidth,
  subImageHeight,
  textAlign
) {
  if (isFlutter()) {
    return flutterPostMessage("openConfirmDialog", {
      message,
      left,
      right,
      subMessage,
      subImageUrl,
      subImageWidth,
      subImageHeight,
      textAlign,
    });
  } else {
    alert(message);
  }
}

export function openAlertDialog(
  message,
  textButton,
  subMessage,
  subImageUrl,
  subImageWidth,
  subImageHeight
) {
  if (isFlutter()) {
    return flutterPostMessage("openAlertDialog", {
      message,
      textButton,
      subMessage,
      subImageUrl,
      subImageWidth,
      subImageHeight,
    });
  } else {
    alert(message);
  }
}
