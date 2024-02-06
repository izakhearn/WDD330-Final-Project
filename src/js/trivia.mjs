

export default class Trivia {
  constructor() {
    this.api =  "https://opentdb.com";
  }

  async getCategories() {
    const url = `${this.api}/api_category.php`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  async getQuestions(category, difficulty, amount) {
    const url = `${this.api}/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
}