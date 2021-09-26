/* eslint-disable */

import { useImmerReducer } from "use-immer"
import firebase from "../../firebaseConfig"
import "./addQuestion.css"
import { Link, withRouter, history } from "react-router-dom"
import topics from "../../topics.json"
import Loader from "../loader/Loader"
import QuestionAdmin from "../questionAdmin/QuestionAdmin"
import { useContext } from "react"
import DispatchContext from "../../DispatchContext"
import StateContext from "../../StateContext"
import { produceWithPatches } from "immer"
console.log(topics)
function AddQuestion(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const initialState = {
    correctChoice: 0,
    question: "",
    choiceA: "",
    choiceB: "",
    choiceC: "",
    choiceD: "",
    topic: "",
    message: "",
    loading: false,
    active: "question",
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

      case "topic":
        draft.topic = action.value.toLowerCase()
        return

      case "message":
        draft.message = action.value
        draft.loading = false
        return
      case "loading":
        draft.loading = action.value
        return
      case "active":
        draft.active = action.value
        return
      case "success":
        draft.active = "addQuestion"
        draft.correctChoice = 0
        draft.question = ""
        draft.choiceA = ""
        draft.choiceB = ""
        draft.choiceC = ""
        draft.choiceD = ""
        draft.topic = ""
        draft.message = ""
        draft.loading = false
        draft.active = "question"
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  const addQuestion = async () => {
    dispatch({ type: "loading", value: true })

    let question = {
      author: appState.user,
      authorUid: appState.user.uid,
      authorEmail: appState.user.userEmail,
      time: firebase.firestore.FieldValue.serverTimestamp(),
      question: state.question,
      choiceA: state.choiceA,
      choiceB: state.choiceB,
      choiceC: state.choiceC,
      choiceD: state.choiceD,
      correctChoice: state.correctChoice,
      topic: state.topic.trim(),
      status: "public",
    }
    let log = await firebase.firestore().collection("questions").add(question)
    if (log.id) {
      dispatch({ type: "success" })
      props.history.push("/question/" + log.id)
      addTopic(state.topic.trim())
    } else dispatch({ type: "message", value: "Error!!!" })
  }

  const addTopic = async (topic) => {
    await firebase
      .firestore()
      .collection("topics")
      .where("topic", "==", topic)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length == 0) {
          console.log(querySnapshot.docs.length)
          let searchKeywords = []
          for (let i = 1; i <= topic.length; i++) searchKeywords.push(topic.substr(0, i))
          firebase.firestore().collection("topics").add({ topic: topic, searchKeywords })
        }
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error)
      })
  }

  const validate = () => {
    if (state.question.length < 5 || state.choiceA.length < 3 || state.choiceB.length < 3 || state.choiceC.length < 3 || state.choiceD.length < 3) {
      dispatch({ type: "message", value: "Please enter a valid question and choices" })
      return
    }
    if (state.correctChoice == 0) {
      dispatch({ type: "message", value: "Please select correct answer choice" })
      return
    }
    if (state.topic.length < 3) {
      dispatch({ type: "message", value: "Topic must have atleaset 3 characters" })
      return
    }
    dispatch({ type: "active", value: "preview" })
  }

  if (state.active == "preview")
    return (
      <div className="addQuestionContainer">
        <div className="addQuestionWrapper">
          <QuestionAdmin
            question={{
              topic: state.topic.trim(),
              question: state.question,
              choiceA: state.choiceA,
              choiceB: state.choiceB,
              choiceC: state.choiceC,
              choiceD: state.choiceD,
              correctChoice: state.correctChoice,
            }}
          />
          <div className="questionInstructions">
            <div>Please note you are posting this question publicly! Please make sure it will be useful for others.</div>

            <div>We thank you for your support and cooperation.</div>
          </div>
          <div className="questionFooter">
            {!state.loading && (
              <div onClick={() => dispatch({ type: "active", value: "question" })} className="backButton">
                Back
              </div>
            )}
            {state.loading ? (
              <Loader />
            ) : (
              <div onClick={() => addQuestion()} className="previewButton">
                Post
              </div>
            )}
          </div>
        </div>
      </div>
    )
  else
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
          {/* <div className="select">
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
          </div> */}
          <div className="topic">
            <input type="text" placeholder="Topic" pattern="[a-zA-Z0-9 ]+" className="topicText" value={state.topic} onChange={(e) => dispatch({ type: "topic", value: e.target.value.replace(/[^a-zA-Z0-9 ]/g, "") })} required />
          </div>

          {state.message && <div className="message">{state.message}</div>}

          <div className="questionFooter">
            <div onClick={() => validate()} className="previewButton">
              Preview
            </div>
          </div>
        </div>
      </div>
    )
}
export default withRouter(AddQuestion)
