import apiRequest from "./api.js"

class App {
  constructor(){
    this._onPostFeedback = this._onPostFeedback.bind(this);
  }

  setup(){
    document.querySelector("#feedbackButton").addEventListener("click", this._onPostFeedback);
  }

  async _onPostFeedback(event){
    event.preventDefault();
    let feedbackForm = document.querySelector("#feedbackForm");
    let body = {}
    body.name = feedbackForm.elements[0].value
    body.email = feedbackForm.elements[1].value
    body.feedback = feedbackForm.elements[2].value
    let [status, data] = await apiRequest("POST", "feedback", body);
    if (status === 200) {
      alert("Feedback successfully posted to database and email sent to merchant")
    } else {
      alert("There was an error in submitting the feedback.")
    }
  }
}

let app = new App();
app.setup();
