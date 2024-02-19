import { loadTemplate, renderWithTemplate, loadJSON,getLocalStorage } from "./utils.mjs";
import Trivia from "./trivia.mjs";

export default class Quiz {
  constructor(category, difficulty, amount, custom = false) {
    this.category = category;
    this.difficulty = difficulty;
    this.amount = amount;
    this.resetCountdown = false;
  }

  async init() {
    const questions = await this.loadQuestions();
    this.renderQuestions(questions);
    this.setQuizInfo();
  }

  async setQuizInfo() {
    const quizInfo = document.querySelector(".quiz__info");
    document.querySelector(".category__value").innerHTML = this.category;
    document.querySelector(".difficulty__value").innerHTML = this.difficulty;
    document.querySelector(".amount__value").innerHTML = this.amount;
  }

  async loadQuestions() {
    const data = await new Trivia().getQuestions(
      this.category,
      this.difficulty,
      this.amount
    );
    for (const question of data.results) {
      question.choices = question.incorrect_answers;
      question.choices.push(question.correct_answer);
      question.choices = question.choices.sort();
    }
    return data;
  }

  async renderQuestions(data) {
    document.querySelector(".play__field").classList.remove("hidden");
    const template = await loadTemplate("../partials/quiz.html");
    const main = document.querySelector(".quiz__container");
    let questions = data.results;
    for (let i = 0; i < questions.length; i++) {
      const div = document.createElement("div");
      const qclass = "question-" + i;
      div.classList.add(qclass);
      div.id = i;
      div.classList.add("question-container");
      if (i == 0) {
        div.classList.add("active");
      }
      div.innerHTML = template;
      main.appendChild(div);
      const question = questions[i];
      const questionDiv = document.querySelector(`.${qclass}`);
      questionDiv.querySelector(".question").innerHTML = question.question;
      const choices = question.choices;
      const choicesDiv = questionDiv.querySelector(".answers");
      for (let j = 0; j < choices.length; j++) {
        const choice = choices[j];
        const input = document.createElement("input");
        input.type = "radio";
        input.name = qclass;
        input.value = choice;
        input.id = `choice-${j}`;
        const label = document.createElement("label");
        label.htmlFor = input.id;
        label.innerHTML = choice;
        choicesDiv.appendChild(input);
        choicesDiv.appendChild(label);
      }
      const submitButton = questionDiv.querySelector(".submit");
      submitButton.addEventListener("click", () => {
        const selected = questionDiv.querySelector(
          `input[name=${qclass}]:checked`
        );

        if (selected) {
          const answer = selected.value;
          if (answer === question.correct_answer) {
            questionDiv.classList.add("correct");
            this.Score();
          } else {
            questionDiv.classList.add("incorrect");
            this.Score();
          }
          questionDiv.classList.remove("active");
          if (i < questions.length - 1) {
            const nextQuestion = document.querySelector(`.question-${i + 1}`);
            nextQuestion.classList.add("active");
            this.resetCountdown = true;
            //Sleep for 1 second
            setTimeout(() => {
              this.resetCountdown = false;
              this.countdown(nextQuestion);
            }, 5);
          } else {
            const score = document.querySelectorAll(".correct").length;
            const scoreDiv = document.createElement("div");
            scoreDiv.classList.add("score");
            scoreDiv.textContent = `You got ${score} out of ${questions.length} correct!`;
            this.resetCountdown = true;
            main.appendChild(scoreDiv);
          }
        }
      });
    };
    this.countdown(document.querySelector(".question-0"));
  }
  async Score() {
    const score = document.querySelectorAll(".correct").length;
    const scoreSpan = document.querySelector(".score__value");
    scoreSpan.innerHTML = score;
  }

  async countdown(questionDiv) {
    const timer = document.querySelector(".countdown__value");
    let time = 3000;
    const interval = setInterval(() => {
      time--;
      timer.innerHTML = parseFloat(time/100).toFixed(0);
      if (time <= 0) {
        let questions = document.querySelectorAll(".question-container");
        questionDiv.classList.remove("active");
        const i = parseInt(questionDiv.id);
          if (i < questions.length - 1) {
            const nextQuestion = document.querySelector(`.question-${i + 1}`);
            nextQuestion.classList.add("active");
            clearInterval(interval);
            this.countdown(nextQuestion);
          }else{
            const score = document.querySelectorAll(".correct").length;
            const scoreDiv = document.createElement("div");
            scoreDiv.classList.add("score");
            scoreDiv.textContent = `You got ${score} out of ${questions.length} correct!`;
            this.resetCountdown = true;
            clearInterval(interval);
            const main = document.querySelector(".quiz__container");
            main.appendChild(scoreDiv);
          }
      }
      if (this.resetCountdown === true) {
        clearInterval(interval);
      }
    }, 1);
  }
}

export class CustomQuiz{
  constructor(quizName) {
    this.quizName = quizName;
    this.resetCountdown = false;
    this.category = "Custom";
    this.difficulty = "Custom";
    this.amount = "Custom";
  }
  async init() {
    const questions = await this.loadQuestions();
    this.renderQuestions(questions);
    this.setQuizInfo();
  }

  async setQuizInfo() {
    const quizInfo = document.querySelector(".quiz__info");
    document.querySelector(".category__value").innerHTML = this.category;
    document.querySelector(".difficulty__value").innerHTML = this.difficulty;
    document.querySelector(".amount__value").innerHTML = this.amount;
  }

  async loadQuestions() {
    try{
    if (localStorage.getItem(this.quizName) === null) {
      throw new Error("No quiz found");
    }

    const data = await getLocalStorage(this.quizName);
    for (const question of data) {
      question.choices = question.incorrect_answers;
      question.choices.push(question.correct_answer);
      question.choices = question.choices.sort();
    }
    return data;
  }catch(err){
    console.log(err);
    alert("No quiz found");
    window.location.reload();
  }
  }

  async renderQuestions(data) {
    document.querySelector(".play__field").classList.remove("hidden");
    const template = await loadTemplate("../partials/quiz.html");
    const main = document.querySelector(".quiz__container");
    let questions = data;
    for (let i = 0; i < questions.length; i++) {
      const div = document.createElement("div");
      const qclass = "question-" + i;
      div.classList.add(qclass);
      div.id = i;
      div.classList.add("question-container");
      if (i == 0) {
        div.classList.add("active");
      }
      div.innerHTML = template;
      main.appendChild(div);
      const question = questions[i];
      const questionDiv = document.querySelector(`.${qclass}`);
      questionDiv.querySelector(".question").innerHTML = question.question;
      const choices = question.choices;
      const choicesDiv = questionDiv.querySelector(".answers");
      for (let j = 0; j < choices.length; j++) {
        const choice = choices[j];
        const input = document.createElement("input");
        input.type = "radio";
        input.name = qclass;
        input.value = choice;
        input.id = `choice-${j}`;
        const label = document.createElement("label");
        label.htmlFor = input.id;
        label.innerHTML = choice;
        choicesDiv.appendChild(input);
        choicesDiv.appendChild(label);
      }
      const submitButton = questionDiv.querySelector(".submit");
      submitButton.addEventListener("click", () => {
        const selected = questionDiv.querySelector(
          `input[name=${qclass}]:checked`
        );

        if (selected) {
          const answer = selected.value;
          if (answer === question.correct_answer) {
            questionDiv.classList.add("correct");
            this.Score();
          } else {
            questionDiv.classList.add("incorrect");
            this.Score();
          }
          questionDiv.classList.remove("active");
          if (i < questions.length - 1) {
            const nextQuestion = document.querySelector(`.question-${i + 1}`);
            nextQuestion.classList.add("active");
            this.resetCountdown = true;
            //Sleep for 1 second
            setTimeout(() => {
              this.resetCountdown = false;
              this.countdown(nextQuestion);
            }, 5);
          } else {
            const score = document.querySelectorAll(".correct").length;
            const scoreDiv = document.createElement("div");
            scoreDiv.classList.add("score");
            scoreDiv.textContent = `You got ${score} out of ${questions.length} correct!`;
            this.resetCountdown = true;
            main.appendChild(scoreDiv);
          }
        }
      });
    };
    this.countdown(document.querySelector(".question-0"));
  }
  async Score() {
    const score = document.querySelectorAll(".correct").length;
    const scoreSpan = document.querySelector(".score__value");
    scoreSpan.innerHTML = score;
  }

  async countdown(questionDiv) {
    const timer = document.querySelector(".countdown__value");
    let time = 3000;
    const interval = setInterval(() => {
      time--;
      timer.innerHTML = parseFloat(time/100).toFixed(0);
      if (time <= 0) {
        let questions = document.querySelectorAll(".question-container");
        questionDiv.classList.remove("active");
        const i = parseInt(questionDiv.id);
          if (i < questions.length - 1) {
            const nextQuestion = document.querySelector(`.question-${i + 1}`);
            nextQuestion.classList.add("active");
            clearInterval(interval);
            this.countdown(nextQuestion);
          }else{
            const score = document.querySelectorAll(".correct").length;
            const scoreDiv = document.createElement("div");
            scoreDiv.classList.add("score");
            scoreDiv.textContent = `You got ${score} out of ${questions.length} correct!`;
            this.resetCountdown = true;
            clearInterval(interval);
            const main = document.querySelector(".quiz__container");
            main.appendChild(scoreDiv);
          }
      }
      if (this.resetCountdown === true) {
        clearInterval(interval);
      }
    }, 1);
  }
}

export function showCategories() {
  const trivia = new Trivia();
  trivia.getCategories().then((data) => {
    const select = document.querySelector(".category");
    for (const category of data.trivia_categories) {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    }
  });
}
