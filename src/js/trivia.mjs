const api =  import.meta.env.VITE_SERVER_URL;

export default class Trivia {
  constructor() {
    this.api = api;
  }

  async getCategories() {
    const url = `${this.api}/api_category.php`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  async getQuestions(category, difficulty, amount) {
    const url = `${this.api}/api/questions?category=${category}&difficulty=${difficulty}&amount=${amount}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
}