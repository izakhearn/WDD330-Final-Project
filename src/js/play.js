import Quiz from "./playModule.mjs";
import { CustomQuiz, showCategories, TeamQuiz } from "./playModule.mjs";

const customQuiz = document.querySelector(".custom__quiz");
const normalQuiz = document.querySelector(".normal__quiz");

const teamParam = new URLSearchParams(window.location.search).get("team");
if (teamParam === "true") {
  document.querySelector("#team-mode").checked = true;
}

customQuiz.addEventListener("click", () => {
  document.querySelector("#custom-quiz").classList.toggle("hidden");
  document.querySelector("#normal-quiz").classList.add("hidden");
  const startButton = document.querySelector(".start__custom__quiz");
  startButton.addEventListener("click", () => {
    const quizName = document.querySelector(".quiz__name").value;
    document.querySelector(".quiz__container").innerHTML = "";
    const quiz = new CustomQuiz(quizName);
    quiz.init();
    const quizType = document.querySelector(".quiz__type");
    quizType.classList.add("hidden");
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
});

normalQuiz.addEventListener("click", () => {
  document.querySelector("#normal-quiz").classList.toggle("hidden");
  document.querySelector("#custom-quiz").classList.add("hidden");
  showCategories();

  const startButton = document.querySelector(".start__quiz");
  startButton.addEventListener("click", () => {
    const category = document.querySelector("#category").value;
    const difficulty = document.querySelector("#difficulty").value;
    const amount = document.querySelector("#amount").value;
    document.querySelector(".quiz__container").innerHTML = "";
    if (document.querySelector("#team-mode").checked) {
      const quiz = new TeamQuiz(category, difficulty, amount);
      quiz.init();
    } else {
      const quiz = new Quiz(category, difficulty, amount);
      quiz.init();
    }
    const quizType = document.querySelector(".quiz__type");
    quizType.classList.add("hidden");
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
});
