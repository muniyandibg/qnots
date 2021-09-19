/* eslint-disable */

import { HiShare } from "react-icons/hi"
import "./questionAdmin.css"
import firebase from "../../firebaseConfig"
import { AiFillCheckCircle, AiFillDelete } from "react-icons/ai"
import { FiMoreVertical } from "react-icons/fi"
import { useContext } from "react"
import DispatchContext from "../../DispatchContext"
import StateContext from "../../StateContext"
import { useImmerReducer } from "use-immer"

function QuestionAdmin(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const initialState = {
    loading: false,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "loading":
        draft.loading = action.value
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  return (
    <div className="questionContainer">
      <div className="questionWrapper">
        <div className="questionAuthor">
          <div>
            <img src={appState.user.userProfilePhoto} alt="authorProfile" className="questionAuthorImage" />
          </div>
          <div className="questionAuthorName">
            <div>{appState.user.userDisplayName}</div>
            <div className="questionAuthorNameTime">Just Now</div>
          </div>
          <div className="questionAuthorMore">
            <FiMoreVertical />
          </div>
        </div>
        <div className="questionHeader">
          <span className="questionHeaderLink">{props.question.topic}</span>
        </div>
        <div className="question">{props.question.question}</div>
        <div className={`questionChoice ${props.question.correctChoice == 1 && "adminQuestionChoiceCorrect"}`}>
          <div className="questionChoiceRadio">A</div>
          <div className="questionChoiceText">{props.question.choiceA}</div>
          {props.question.correctChoice == 1 && <AiFillCheckCircle className="questionChoiceRadioIconUser" />}
        </div>
        <div className={`questionChoice ${props.question.correctChoice == 2 && "adminQuestionChoiceCorrect"}`}>
          <div className="questionChoiceRadio">B</div>
          <div className="questionChoiceText">{props.question.choiceB}</div>
          {props.question.correctChoice == 2 && <AiFillCheckCircle className="questionChoiceRadioIconUser" />}
        </div>
        <div className={`questionChoice ${props.question.correctChoice == 3 && "adminQuestionChoiceCorrect"}`}>
          <div className="questionChoiceRadio">C</div>
          <div className="questionChoiceText">{props.question.choiceC}</div>
          {props.question.correctChoice == 3 && <AiFillCheckCircle className="questionChoiceRadioIconUser" />}
        </div>
        <div className={`questionChoice ${props.question.correctChoice == 4 && "adminQuestionChoiceCorrect"}`}>
          <div className="questionChoiceRadio">D</div>
          <div className="questionChoiceText">{props.question.choiceD}</div>
          {props.question.correctChoice == 4 && <AiFillCheckCircle className="questionChoiceRadioIconUser" />}
        </div>
      </div>
    </div>
  )
}

export default QuestionAdmin
