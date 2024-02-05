import { loadTemplate, renderWithTemplate, loadJSON } from "./utils.mjs";

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
    const data = await loadJSON(`../json/trivia_test.json`);
    for (const question of data.results) {
      question.choices = question.incorrect_answers;
      question.choices.push(question.correct_answer);
      question.choices = question.choices.sort();
    }
    return data;
    // let questions = [];
    // for (const question of data.results){
    //     questions.push(question);
    // }
    // let answers = [];
    // for (const answer of data.results){
    //     answers.push(answer.correct_answer);
    // }
    // let choices = [];
    // for (const choice of data.results){
    //     choices.push(choice.incorrect_answers+","+choice.correct_answer);
    // }
    // console.log(choices);
    // console.log(answers);
    // console.log(questions);
  }

  async renderQuestions(data) {
    const template = await loadTemplate("../partials/quiz.html");
    const main = document.querySelector("main");
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
      questionDiv.querySelector(".question").textContent = question.question;
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
        label.textContent = choice;
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
