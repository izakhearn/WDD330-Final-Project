import { loadTemplate, renderWithTemplate, loadJSON } from "./utils.mjs";
import Trivia from "./trivia.mjs";;

export default class Quiz {
  constructor(category, difficulty, amount) {
    this.category = category;
    this.difficulty = difficulty;
    this.amount = amount;
  }

  async init() {
    const questions = await this.loadQuestions();
    this.renderQuestions(questions);
  }

  async loadQuestions() {
    const data = await new Trivia().getQuestions(this.category, this.difficulty, this.amount);
    for (const question of data.results) {
      question.choices = question.incorrect_answers;
      question.choices.push(question.correct_answer);
      question.choices = question.choices.sort();
    }
    return data;
  }

  async renderQuestions(data) {
    const template = await loadTemplate("../partials/quiz.html");
    const main = document.querySelector(".quiz__container");
    let questions = data.results
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
        const selected = questionDiv.querySelector(`input[name=${qclass}]:checked`);
        if (selected) {
          const answer = selected.value;
          if (answer === question.correct_answer) {
            questionDiv.classList.add("correct");
          } else {
            questionDiv.classList.add("incorrect");
          }
          questionDiv.classList.remove("active");
          if (i < questions.length - 1) {
            const nextQuestion = document.querySelector(`.question-${i + 1}`);
            nextQuestion.classList.add("active");
          } else {
            const score = document.querySelectorAll(".correct").length;
            const scoreDiv = document.createElement("div");
            scoreDiv.classList.add("score");
            scoreDiv.textContent = `You got ${score} out of ${questions.length} correct!`;
            main.appendChild(scoreDiv);
          }
        }
      });

    }
  }
}

export function showCategories(){
  const trivia = new Trivia();
  trivia.getCategories().then(data => {
    const select = document.querySelector(".category");
    for (const category of data.trivia_categories){
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    }
  });
}
