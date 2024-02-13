import QuizManager from "./quizManager.mjs";
import { getLocalStorage } from "./utils.mjs";

document.getElementById("create-quiz").addEventListener("click", createQuiz);
document.getElementById("edit-quiz").addEventListener("click", editQuiz);

function editQuiz() {
  const quizName = document.getElementById("quiz-name-input").value;
  try {
    const quiz = getLocalStorage(quizName);
    if (quiz) {
      const quizManager = new QuizManager(quizName);
      quizManager.init();
    } else {
      throw new Error("Quiz not found");
    }
  } catch (error) {
    alert(error);
  }
}

function createQuiz() {
  const quizName = document.getElementById("quiz-name-input").value;
  if (quizName === "") {
    alert("Please enter a quiz name");
    return;
  }
  if (getLocalStorage(quizName)) {
    alert("Quiz already exists");
    return;
  }
  const quizManager = new QuizManager(quizName);
  quizManager.init();
}
