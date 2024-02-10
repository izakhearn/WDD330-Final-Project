import Quiz from "./playModule.mjs";
import { showCategories } from "./playModule.mjs";

showCategories();

const startButton = document.querySelector(".start__quiz");
startButton.addEventListener("click", () => {
  const category = document.querySelector("#category").value;
  const difficulty = document.querySelector("#difficulty").value;
  const amount = document.querySelector("#amount").value;
  document.querySelector(".quiz__container").innerHTML = "";
  const quiz = new Quiz(category, difficulty, amount);
  quiz.init();
  //   Disable quiz button for 10s to prevent api time out
  startButton.setAttribute("disabled", true);
  let time = 10;
  const interval = setInterval(() => {
    startButton.innerHTML = `Please wait ${time} seconds`;
    time--;
    if (time < 0) {
      clearInterval(interval);
      startButton.removeAttribute("disabled");
      startButton.innerHTML = "Start Quiz";
    }
  }, 1000);
});
