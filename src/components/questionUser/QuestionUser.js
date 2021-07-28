/* eslint-disable */

import { HiShare } from "react-icons/hi"
import "./questionUser.css"
import firebase from "../../firebaseConfig"
import { AiFillCheckCircle, AiFillCloseCircle, AiFillDelete } from "react-icons/ai"
import { useImmerReducer } from "use-immer"
import { useContext } from "react"
import StateContext from "../../StateContext"
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share"
import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share"

function QuestionUser(props) {
  const appState = useContext(StateContext)
  const initialState = {
    selectedChoice: 0,
    loading: true,
    posts: [],
    lastVisible: null,
    loadmore: true,
    share: false,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "selectedChoice":
        draft.selectedChoice = action.value
        return
      case "share":
        draft.share = action.value
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  const response = (userChoice) => {
    dispatch({ type: "selectedChoice", value: userChoice })
    if (appState.user) updateUserPerformance(userChoice)
  }
  const updateUserPerformance = async (userChoice) => {
    let email = appState.user.userEmail
    let attempt = 1
    let correct = 0
    if (userChoice == props.question.correctChoice) correct = 1
    let attemptData = attempt + "|" + correct
    // Create a reference to the SF doc.
    var sfDocRef = firebase.firestore().collection("performance").doc(email)

    return firebase
      .firestore()
      .runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
          if (!sfDoc.exists) {
            firebase
              .firestore()
              .collection("performance")
              .doc(email)
              .set({ [props.question.subject]: attemptData })
          } else {
            let data = sfDoc.data()[props.question.subject]
            let userAttemptData = ["0", "0"]
            if (data) userAttemptData = data.split("|")
            let userAttempt = parseInt(userAttemptData[0])
            let userCorrect = parseInt(userAttemptData[1])
            if (userChoice == props.question.correctChoice) {
              userAttempt++
              userCorrect++
            } else {
              userAttempt++
            }
            attemptData = userAttempt + "|" + userCorrect
            transaction.update(sfDocRef, { [props.question.subject]: attemptData })
          }
        })
      })
      .then(() => {
        console.log("Transaction successfully committed!")
      })
      .catch((error) => {
        console.log("Transaction failed: ", error)
      })
  }

  const getDateTime = (time) => {
    const fireBaseTime = new Date(time.seconds * 1000 + time.nanoseconds / 1000000)
    const date = fireBaseTime.toDateString()
    const atTime = fireBaseTime.toLocaleTimeString()

    return date
  }

  return (
    <div className="questionContainerUser">
      <div className="questionWrapperUser">
        <div className="questionHeaderUser">
          <span className="questionHeaderLinkUser">{props.question.subject}</span>
          <span className="questionHeaderDateUser">{getDateTime(props.question.time)}</span>
        </div>
        <div className="questionUser">{props.question.question}</div>
        <div onClick={() => response(1)} className={`questionChoiceUser ${state.selectedChoice > 0 ? (props.question.correctChoice == 1 ? "questionChoiceCorrectUser" : state.selectedChoice == 1 ? "questionChoiceWrongUser" : "disableChoiceUser") : ""}`}>
          <div className="questionChoiceRadioUser">A</div>
          <div className="questionChoiceText">{props.question.choiceA}</div>
          {state.selectedChoice > 0 ? props.question.correctChoice == 1 ? <AiFillCheckCircle className="questionChoiceRadioIconUser" /> : state.selectedChoice == 1 ? <AiFillCloseCircle className="questionChoiceWrongRadioIconUser" /> : null : null}
        </div>
        <div onClick={() => response(2)} className={`questionChoiceUser ${state.selectedChoice > 0 ? (props.question.correctChoice == 2 ? "questionChoiceCorrectUser" : state.selectedChoice == 2 ? "questionChoiceWrongUser" : "disableChoiceUser") : ""}`}>
          <div className="questionChoiceRadioUser">B</div>
          <div className="questionChoiceText">{props.question.choiceB}</div>
          {state.selectedChoice > 0 ? props.question.correctChoice == 2 ? <AiFillCheckCircle className="questionChoiceRadioIconUser" /> : state.selectedChoice == 2 ? <AiFillCloseCircle className="questionChoiceWrongRadioIconUser" /> : null : null}
        </div>
        <div onClick={() => response(3)} className={`questionChoiceUser ${state.selectedChoice > 0 ? (props.question.correctChoice == 3 ? "questionChoiceCorrectUser" : state.selectedChoice == 3 ? "questionChoiceWrongUser" : "disableChoiceUser") : ""}`}>
          <div className="questionChoiceRadioUser">C</div>
          <div className="questionChoiceText">{props.question.choiceC}</div>
          {state.selectedChoice > 0 ? props.question.correctChoice == 3 ? <AiFillCheckCircle className="questionChoiceRadioIconUser" /> : state.selectedChoice == 3 ? <AiFillCloseCircle className="questionChoiceWrongRadioIconUser" /> : null : null}
        </div>
        <div onClick={() => response(4)} className={`questionChoiceUser ${state.selectedChoice > 0 ? (props.question.correctChoice == 4 ? "questionChoiceCorrectUser" : state.selectedChoice == 4 ? "questionChoiceWrongUser" : "disableChoiceUser") : ""}`}>
          <div className="questionChoiceRadioUser">D</div>
          <div className="questionChoiceTextUser">{props.question.choiceD}</div>
          {state.selectedChoice > 0 ? props.question.correctChoice == 4 ? <AiFillCheckCircle className="questionChoiceRadioIconUser" /> : state.selectedChoice == 4 ? <AiFillCloseCircle className="questionChoiceWrongRadioIconUser" /> : null : null}
        </div>
        {!state.share && (
          <div onClick={() => dispatch({ type: "share", value: true })} className="shareQuestionUser">
            Share <HiShare />
          </div>
        )}

        {state.share && (
          <div className="shareQuestionUser">
            <FacebookShareButton quote={props.question.question} url={"https://qnots.com/question/" + props.question.id} className="shareButtons">
              <FacebookIcon round={true} size={28} />
            </FacebookShareButton>
            <TwitterShareButton url={props.question.question + " " + "https://qnots.com/question/" + props.question.id} className="shareButtons">
              <TwitterIcon round={true} size={28} />
            </TwitterShareButton>
            <WhatsappShareButton url={props.question.question + " " + "https://qnots.com/question/" + props.question.id} className="shareButtons">
              <WhatsappIcon round={true} size={28} />
            </WhatsappShareButton>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionUser
