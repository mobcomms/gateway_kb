function getErrorMessage(code) {
  let message;
  switch (code) {
    case "400":
      message = "클라이언트 처리 중 문제가 발생했습니다";
      break;
    case "404":
      message = "요청하신 페이지를 찾을 수 없습니다.";
      break;
    case "500":
      message = "서버 처리 중 문제가 발생했습니다.";
      break;
    case "98":
      message = "진행 중인 게임입니다. 새로고침 해주세요.";
      break;
    case "99":
      message = "요청 처리 중 문제가 발생했습니다.";
      break;
    default:
      message = "알 수 없는 오류가 발생했습니다.";
      break;
  }
  return message;
}

function errorToast(errorMessage, resultCode) {
  const el = document.querySelector(".wrap");

  if (!el) return;

  //resultCode 4000이 아닐때는 기본 메세지 출력 reslutCode :"500" 고정 09.20
  if (resultCode !== "4000") {
    errorMessage = getErrorMessage("500");
  }

  const div = document.createElement("div");
  const p = document.createElement("p");
  div.id = "toastMessage";
  div.className = "errorMessage";
  div.style =
    "color:#fff; font-family: Pretendard; font-weight: 400; font-size: 1.4rem; letter-spacing: -0.035rem; line-height: 1.6rem; text-align:center; z-index:1001";
  p.textContent = errorMessage || "서버 처리 중 문제가 발생했습니다.";

  div.appendChild(p);
  el.appendChild(div);

  div.classList.add("show");
  setTimeout(() => {
    div.classList.remove("show");
  }, 3000);
}

export { errorToast };
