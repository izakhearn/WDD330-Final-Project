import {
  setLocalStorage,
  getLocalStorage,
  renderListWithTemplate,
} from "./utils.mjs";

function template(question) {
  return `
    <div class="question-accordion">
        <h3>${question.question}</h3>
        <div class="question__acc__content">
        <div class="acc_question">
        <label for="question">Question</label>
        <input value="${question.question}" id="question"></input>
        </div>
        <label for="correct_answer">Correct Answer</label>
        <input value="${question.correct_answer}" id="correct_answer"></input>
        <label for="incorrect_answer0">Incorrect Answer 1</label>
        <input value="${question.incorrect_answers[0]}" id="incorrect_answer0"></input>
        <label for="incorrect_answer1">Incorrect Answer 2</label>
        <input value="${question.incorrect_answers[1]}" id="incorrect_answer1"></input>
        <label for="incorrect_answer2">Incorrect Answer 3</label>
        <input value="${question.incorrect_answers[2]}" id="incorrect_answer2"></input>
        <div id="buttons">
        <button class="edit">Save</button>
        <button class="delete">Delete</button>
        </div>
        </div>
    </div>
    `;
}
export default class QuizManager {
  constructor(quizName) {
    this.quizName = quizName;
  }
  async init() {
    this.quiz = await getLocalStorage(this.quizName);
    if (!this.quiz) {
      this.quiz = [];
    }
    this.renderQuestions(template, document.querySelector(".quiz-editor"));
    this.addAccordionListeners();
    this.addSaveListeners();
    this.addDeleteListerners();
    // Add new question button
    const newQuestionButton = document.createElement("button");
    newQuestionButton.textContent = "New Question";
    newQuestionButton.addEventListener("click", this.newQuestion);
    document.querySelector(".quiz-editor").appendChild(newQuestionButton);
  }

  async save() {
    setLocalStorage(this.quizName, this.quiz);
  }
  async removeQuestion(index) {
    this.quiz.splice(index, 1);
    await this.save();
  }

  async updateQuestion(index, question) {

    
    question = {
      question: document.getElementById("question").value,
      correct_answer: document.getElementById("correct_answer").value,
      incorrect_answers: [
        document.getElementById("incorrect_answer0").value,
        document.getElementById("incorrect_answer1").value,
        document.getElementById("incorrect_answer2").value,
      ],
    };
    this.quiz[index] = question;
    await this.save();
    document.querySelector(".quiz-editor").innerHTML = "";
    const quizName = document.getElementById("quiz-name-input").value;
    const quizManager = new QuizManager(quizName);
    quizManager.init();
  }

  async getQuestions() {
    return this.quiz;
  }

  async getQuestion(index) {
    return this.quiz[index];
  }

  async getQuestionCount() {
    return this.quiz.length;
  }

  async renderQuestions(
    templateFn,
    parentElement,
    position = "afterBegin",
    clear = true
  ) {
    renderListWithTemplate(
      templateFn,
      parentElement,
      this.quiz,
      position,
      clear
    );
  }
  async addAccordionListeners() {
    const accordions = document.querySelectorAll(".question-accordion h3");
    accordions.forEach((accordion) => {
      accordion.addEventListener("click", this.openAccordion);
    });
  }
  async openAccordion() {
    this.parentElement.classList.toggle("active");
  }

  async addSaveListeners() {
    const saveButtons = document.querySelectorAll(".edit");
    saveButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        this.updateQuestion(index);
      });
    });
  }

  async addDeleteListerners() {
    const deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        this.removeQuestion(index);
        document.querySelector(".quiz-editor").innerHTML = "";
        const quizName = document.getElementById("quiz-name-input").value;
        const quizManager = new QuizManager(quizName);
        quizManager.init();
      });
    });
  }

  async newQuestion() {
    const quizName = document.getElementById("quiz-name-input").value;
    const question = {
      question: "New Question",
      correct_answer: "",
      incorrect_answers: ["", "", "", ""],
    };
    const quiz = await getLocalStorage(quizName);
    if (quiz) {
      quiz.push(question);
      setLocalStorage(quizName, quiz);
    } else {
      setLocalStorage(quizName, [question]);
    }
    document.querySelector(".quiz-editor").innerHTML = "";
    const quizManager = new QuizManager(quizName);
    quizManager.init();
  }
}
