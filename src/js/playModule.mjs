import {
  loadTemplate,
  renderWithTemplate,
  loadJSON,
  getLocalStorage,
} from "./utils.mjs";
import Trivia from "./trivia.mjs";

export default class Quiz {
  constructor(category, difficulty, amount) {
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
            this.fireworks();
          }
        }
      });
    }
    this.countdown(document.querySelector(".question-0"));
  }
  async Score() {
    const score = document.querySelectorAll(".correct").length;
    const scoreSpan = document.querySelector(".score__value");
    scoreSpan.innerHTML = score;
  }

  async fireworks() {
    const body = document.querySelector("body");
    for (let i = 0; i < 20; i++) {
      const firework = document.createElement("div");
      firework.classList.add("firework");
      firework.style.left = Math.random() * 100 + "vw";
      firework.style.animationDuration = Math.random() * 2 + 1 + "s";
      firework.style.animationDelay = Math.random() * 2 + 1 + "s";
      firework.style.animationTimingFunction = `cubic-bezier(${Math.random()}, ${Math.random()}, ${Math.random()}, ${Math.random()})`;
      body.appendChild(firework);

      setTimeout(() => {
        firework.remove();
      }, 5000);
    }
  }
  async countdown(questionDiv) {
    const timer = document.querySelector(".countdown__value");
    let time = 3000;
    const interval = setInterval(() => {
      time--;
      timer.innerHTML = parseFloat(time / 100).toFixed(0);
      if (time <= 0) {
        let questions = document.querySelectorAll(".question-container");
        questionDiv.classList.remove("active");
        const i = parseInt(questionDiv.id);
        if (i < questions.length - 1) {
          const nextQuestion = document.querySelector(`.question-${i + 1}`);
          nextQuestion.classList.add("active");
          clearInterval(interval);
          this.countdown(nextQuestion);
        } else {
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

export class CustomQuiz {
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
    try {
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
    } catch (err) {
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
            this.fireworks();
          }
        }
      });
    }
    this.countdown(document.querySelector(".question-0"));
  }
  async Score() {
    const score = document.querySelectorAll(".correct").length;
    const scoreSpan = document.querySelector(".score__value");
    scoreSpan.innerHTML = score;
  }

  async fireworks() {
    const body = document.querySelector("body");
    for (let i = 0; i < 20; i++) {
      const firework = document.createElement("div");
      firework.classList.add("firework");
      firework.style.left = Math.random() * 100 + "vw";
      firework.style.animationDuration = Math.random() * 2 + 1 + "s";
      firework.style.animationDelay = Math.random() * 2 + 1 + "s";
      firework.style.animationTimingFunction = `cubic-bezier(${Math.random()}, ${Math.random()}, ${Math.random()}, ${Math.random()})`;
      body.appendChild(firework);

      setTimeout(() => {
        firework.remove();
      }, 5000);
    }
  }
  async countdown(questionDiv) {
    const timer = document.querySelector(".countdown__value");
    let time = 3000;
    const interval = setInterval(() => {
      time--;
      timer.innerHTML = parseFloat(time / 100).toFixed(0);
      if (time <= 0) {
        let questions = document.querySelectorAll(".question-container");
        questionDiv.classList.remove("active");
        const i = parseInt(questionDiv.id);
        if (i < questions.length - 1) {
          const nextQuestion = document.querySelector(`.question-${i + 1}`);
          nextQuestion.classList.add("active");
          clearInterval(interval);
          this.countdown(nextQuestion);
        } else {
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

export class TeamQuiz {
  constructor(category, difficulty, amount) {
    this.category = category;
    this.difficulty = difficulty;
    this.amount = amount;
    this.resetCountdown = false;
  }

  async init() {
    const questions = await this.loadQuestions();
    this.renderQuestions(questions);
    this.setQuizInfo();
    this.team();
    this.switchTeam();
  }

  async team() {
    const infoPanel = document.querySelector(".quiz__info");
    const team = document.createElement("div");
    team.classList.add("team");
    team.innerHTML = `
    <h3>Team Mode</h3>
    <p> Current Team:</p>
    `;
    infoPanel.prepend(team);
    const scoreDiv = document.querySelector(".score");
    scoreDiv.innerHTML = `<h3>Team Score</h3>
    <p>Team 1: <span class="team-score-1">0</span></p>
    <p>Team 2: <span class="team-score-2">0</span></p>
    `;
  }

  async switchTeam() {
    const team = document.querySelector(".team");
    const currentTeam = team.querySelector("p");
    const currentTeamNumber = currentTeam.textContent.split(" ")[2];
    if (currentTeamNumber === "1") {
      currentTeam.textContent = `Current Team: 2`;
    } else {
      currentTeam.textContent = `Current Team: 1`;
    }
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
          const currentTeam = document
            .querySelector(".team p")
            .textContent.split(" ")[2];
          if (answer === question.correct_answer) {
            questionDiv.classList.add("correct-" + currentTeam);
            this.Score();
          } else {
            questionDiv.classList.add("incorrect");
            this.Score();
          }
          this.switchTeam();
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
            this.AnnounceWinner();
            this.resetCountdown = true;
          }
        }
      });
    }
    this.countdown(document.querySelector(".question-0"));
  }
  async Score() {
    const score1 = document.querySelectorAll(".correct-1").length;
    const score2 = document.querySelectorAll(".correct-2").length;
    const scoreSpan1 = document.querySelector(".team-score-1");
    const scoreSpan2 = document.querySelector(".team-score-2");
    scoreSpan1.innerHTML = score1;
    scoreSpan2.innerHTML = score2;
  }

  async AnnounceWinner() {
    const Team1Score = document.querySelectorAll(".correct-1").length;
    const Team2Score = document.querySelectorAll(".correct-2").length;
    const scoreDiv = document.createElement("div");
    scoreDiv.classList.add("score");
    scoreDiv.innerHTML = `<h3>Team Score</h3>
    <p>Team 1: <span class="team-score-1">${Team1Score}</span></p>
    <p>Team 2: <span class="team-score-2">${Team2Score}</span></p>
    `;
    const main = document.querySelector(".quiz__container");
    const body = document.querySelector("body");
    for (let i = 0; i < 20; i++) {
      const firework = document.createElement("div");
      firework.classList.add("firework");
      firework.style.left = Math.random() * 100 + "vw";
      firework.style.animationDuration = Math.random() * 2 + 1 + "s";
      firework.style.animationDelay = Math.random() * 2 + 1 + "s";
      firework.style.animationTimingFunction = `cubic-bezier(${Math.random()}, ${Math.random()}, ${Math.random()}, ${Math.random()})`;
      body.appendChild(firework);

      setTimeout(() => {
        firework.remove();
      }, 5000);
    }

    if (Team1Score > Team2Score) {
      scoreDiv.innerHTML += `<h3>Team 1 Wins!</h3>`;
    }
    if (Team2Score > Team1Score) {
      scoreDiv.innerHTML += `<h3>Team 2 Wins!</h3>`;
    }
    if (Team1Score === Team2Score) {
      scoreDiv.innerHTML += `<h3>It's a tie!</h3>`;
    }
    this.resetCountdown = true;
    main.appendChild(scoreDiv);
  }

  async countdown(questionDiv) {
    const timer = document.querySelector(".countdown__value");
    let time = 3000;
    const interval = setInterval(() => {
      time--;
      timer.innerHTML = parseFloat(time / 100).toFixed(0);
      if (time <= 0) {
        let questions = document.querySelectorAll(".question-container");
        questionDiv.classList.remove("active");
        const i = parseInt(questionDiv.id);
        if (i < questions.length - 1) {
          const nextQuestion = document.querySelector(`.question-${i + 1}`);
          nextQuestion.classList.add("active");
          clearInterval(interval);
          this.countdown(nextQuestion);
        } else {
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
