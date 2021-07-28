/* eslint-disable */

import { useImmerReducer } from "use-immer"
import firebase from "../../firebaseConfig"
import "./addQuestion.css"

import topics from "../../topics.json"
import Loader from "../loader/Loader"
import QuestionAdmin from "../questionAdmin/QuestionAdmin"
console.log(topics)
function AddQuestion() {
  const initialState = {
    correctChoice: 0,
    question: "",
    choiceA: "",
    choiceB: "",
    choiceC: "",
    choiceD: "",
    subject: "none",
    message: "",
    loading: false,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "question":
        draft.question = action.value
        return
      case "choiceA":
        draft.choiceA = action.value
        return
      case "choiceB":
        draft.choiceB = action.value
        return
      case "choiceC":
        draft.choiceC = action.value
        return
      case "choiceD":
        draft.choiceD = action.value
        return
      case "correctChoice":
        draft.correctChoice = action.value
        return
      case "subject":
        draft.subject = action.value
        return

      case "message":
        draft.message = action.value
        draft.loading = false
        return
      case "loading":
        draft.loading = action.value
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  const addQuestion = async () => {
    dispatch({ type: "loading", value: true })
    if (state.question.length < 5 || state.choiceA.length < 3 || state.choiceB.length < 3 || state.choiceC.length < 3 || state.choiceD.length < 3) {
      dispatch({ type: "message", value: "Please enter a valid question and choices" })
      return
    }
    if (state.correctChoice == 0) {
      dispatch({ type: "message", value: "Please select correct answer choice" })
      return
    }
    if (state.subject == "none") {
      dispatch({ type: "message", value: "Please select subject and topic" })
      return
    }
    let question = {
      time: firebase.firestore.FieldValue.serverTimestamp(),
      question: state.question,
      choiceA: state.choiceA,
      choiceB: state.choiceB,
      choiceC: state.choiceC,
      choiceD: state.choiceD,
      correctChoice: state.correctChoice,
      subject: state.subject,
    }
    let log = await firebase.firestore().collection("questions").add(question)
    if (log.id) dispatch({ type: "message", value: "Question posted successfully!" })
    else dispatch({ type: "message", value: "Errpr!!!" })
  }

  return (
    <div className="addQuestionContainer">
      <div className="addQuestionWrapper">
        <textarea rows="5" placeholder="Enter Question!" className="question" value={state.question} onChange={(e) => dispatch({ type: "question", value: e.target.value })} />
        <div className="choice">
          <input type="radio" className="choiceRadioButton" onChange={() => dispatch({ type: "correctChoice", value: 1 })} checked={state.correctChoice == 1 ? true : false} />
          <textarea rows="1" placeholder="Choice A" className="choiceText" value={state.choiceA} onChange={(e) => dispatch({ type: "choiceA", value: e.target.value })} />
        </div>
        <div className="choice">
          <input type="radio" className="choiceRadioButton" onChange={() => dispatch({ type: "correctChoice", value: 2 })} checked={state.correctChoice == 2 ? true : false} />
          <textarea rows="1" placeholder="Choice B" className="choiceText" value={state.choiceB} onChange={(e) => dispatch({ type: "choiceB", value: e.target.value })} />
        </div>
        <div className="choice">
          <input type="radio" className="choiceRadioButton" onChange={() => dispatch({ type: "correctChoice", value: 3 })} checked={state.correctChoice == 3 ? true : false} />
          <textarea rows="1" placeholder="Choice C" className="choiceText" value={state.choiceC} onChange={(e) => dispatch({ type: "choiceC", value: e.target.value })} />
        </div>
        <div className="choice">
          <input type="radio" className="choiceRadioButton" onChange={() => dispatch({ type: "correctChoice", value: 4 })} checked={state.correctChoice == 4 ? true : false} />
          <textarea rows="1" placeholder="Choice D" className="choiceText" value={state.choiceD} onChange={(e) => dispatch({ type: "choiceD", value: e.target.value })} />
        </div>
        <div className="select">
          <select onChange={(e) => dispatch({ type: "subject", value: e.target.value })}>
            <option value="none">SUBJECT</option>
            {topics.subjects.map((item, index) => {
              return (
                <option key={index} value={item}>
                  {item}
                </option>
              )
            })}
          </select>
        </div>

        {state.loading ? (
          <Loader />
        ) : (
          <div onClick={() => addQuestion()} className="addQuestionButton">
            Post Question
          </div>
        )}
        {state.message && <div className="message">{state.message}</div>}
        <QuestionAdmin
          question={{
            subject: state.subject,
            question: state.question,
            choiceA: state.choiceA,
            choiceB: state.choiceB,
            choiceC: state.choiceC,
            choiceD: state.choiceD,
            correctChoice: state.correctChoice,
          }}
        />
      </div>
    </div>
  )
}
export default AddQuestion
