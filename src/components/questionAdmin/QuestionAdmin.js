/* eslint-disable */

import { HiShare } from "react-icons/hi"
import "./questionAdmin.css"
import firebase from "../../firebaseConfig"
import { AiFillCheckCircle, AiFillDelete } from "react-icons/ai"

function QuestionAdmin(props) {
  const deleteQuestion = async (id) => {
    await firebase.firestore().collection("questions").doc(id).delete()
    alert("Question deleted!")
  }

  return (
    <div className="questionContainer">
      <div className="questionWrapper">
        <div className="questionHeader">
          <span className="questionHeaderLink">{props.question.subject}</span>
          <span className="questionHeaderDate">13 July 2021</span>
        </div>
        <div className="question">{props.question.question}</div>
        <div className={`questionChoice ${props.question.correctChoice == 1 && "adminQuestionChoiceCorrect"}`}>
          {props.question.correctChoice == 1 ? <AiFillCheckCircle className="questionChoiceRadioIcon" /> : <div className="questionChoiceRadio">A</div>}
          <div className="questionChoiceText">{props.question.choiceA}</div>
        </div>
        <div className={`questionChoice ${props.question.correctChoice == 2 && "adminQuestionChoiceCorrect"}`}>
          {props.question.correctChoice == 2 ? <AiFillCheckCircle className="questionChoiceRadioIcon" /> : <div className="questionChoiceRadio">B</div>}
          <div className="questionChoiceText">{props.question.choiceB}</div>
        </div>
        <div className={`questionChoice ${props.question.correctChoice == 3 && "adminQuestionChoiceCorrect"}`}>
          {props.question.correctChoice == 3 ? <AiFillCheckCircle className="questionChoiceRadioIcon" /> : <div className="questionChoiceRadio">C</div>}
          <div className="questionChoiceText">{props.question.choiceC}</div>
        </div>
        <div className={`questionChoice ${props.question.correctChoice == 4 && "adminQuestionChoiceCorrect"}`}>
          {props.question.correctChoice == 4 ? <AiFillCheckCircle className="questionChoiceRadioIcon" /> : <div className="questionChoiceRadio">D</div>}
          <div className="questionChoiceText">{props.question.choiceD}</div>
        </div>
        <div onClick={() => deleteQuestion(props.question.id)} className="shareQuestion">
          <span>Delete:{props.question.id}</span>
          <AiFillDelete />
        </div>
        <div className="shareQuestion">
          <span>Share </span>
          <HiShare />
        </div>
      </div>
    </div>
  )
}

export default QuestionAdmin
