/* eslint-disable */

import { HiShare } from "react-icons/hi"
import "./questionUser.css"
import firebase from "../../firebaseConfig"
import { Link, withRouter, history } from "react-router-dom"
import { AiFillCheckCircle, AiFillCloseCircle, AiFillDelete } from "react-icons/ai"
import { BiDownvote, BiUpvote, BiComment } from "react-icons/bi"
import { TiArrowUpOutline, TiArrowUpThick } from "react-icons/ti"
import { BsFillFlagFill } from "react-icons/bs"
import { MdComment } from "react-icons/md"
import { useImmerReducer } from "use-immer"
import { useContext, useEffect } from "react"
import StateContext from "../../StateContext"
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share"
import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share"
import { FiMoreVertical } from "react-icons/fi"

function QuestionUser(props) {
  const appState = useContext(StateContext)
  const initialState = {
    selectedChoice: 0,
    loading: true,
    posts: [],
    lastVisible: null,
    loadmore: true,
    share: false,
    activityData: null,
    upVote: false,
    totalVoteCount: props.question.voteCount ? props.question.voteCount : 0,
    deleteQuestion: false,
    staus: null,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "selectedChoice":
        draft.selectedChoice = action.value
        return
      case "share":
        draft.share = action.value
        return
      case "activity":
        draft.activityData = action.value
        if (action.value.attempt) draft.selectedChoice = action.value.attempt
        if (action.value.upVote) draft.upVote = true
        return
      case "upVote":
        draft.upVote = action.value
        return
      case "deleteQuestion":
        draft.deleteQuestion = action.value
        return
      case "totalVoteCount":
        console.log(action.value)
        draft.totalVoteCount = action.value
        return
      case "status":
        draft.status = action.value
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  useEffect(() => {
    if (props.uid) {
      let activityId = props.uid + "|" + props.question.id

      firebase
        .firestore()
        .collection("activity")
        .doc(activityId)
        .get()
        .then((doc) => {
          if (doc.exists) dispatch({ type: "activity", value: { ...doc.data(), activityId } })
          else dispatch({ type: "activity", value: { activityId } })
        })
    }
  }, [])

  const response = (userChoice) => {
    if (appState.user) dispatch({ type: "selectedChoice", value: userChoice })
    else {
      props.history.push("/profile")
      return
    }
    if (appState.user) {
      if (!state.activityData.attempt && !state.activityData.upvote) firebase.firestore().collection("activity").doc(state.activityData.activityId).set({ attempt: userChoice })
      else firebase.firestore().collection("activity").doc(state.activityData.activityId).update({ attempt: userChoice })

      updateUserPerformance(userChoice)
    }
  }
  const upvote = (userVote) => {
    if (appState.user) {
      dispatch({ type: "upVote", value: userVote })
      updateQuestionVotes(userVote)
      if (!state.activityData.attempt && !state.activityData.upVote) firebase.firestore().collection("activity").doc(state.activityData.activityId).set({ upVote: userVote })
      else firebase.firestore().collection("activity").doc(state.activityData.activityId).update({ upVote: userVote })
    } else {
      props.history.push("/profile")
      return
    }
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
              .set({ [props.question.topic]: attemptData })
          } else {
            let data = sfDoc.data()[props.question.topic]
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
            transaction.update(sfDocRef, { [props.question.topic]: attemptData })
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

  const updateQuestionVotes = async (userVote) => {
    var sfDocRef = firebase.firestore().collection("questions").doc(props.question.id)

    return firebase
      .firestore()
      .runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
          if (!sfDoc.exists) {
          } else {
            let voteCount = sfDoc.data().voteCount ? parseInt(sfDoc.data().voteCount) : 0
            console.log("error", voteCount)
            if (userVote) {
              voteCount++
            } else {
              voteCount--
            }
            dispatch({ type: "totalVoteCount", value: voteCount })
            transaction.update(sfDocRef, { voteCount })
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

  const deleteQuestion = () => {
    firebase.firestore().collection("questions").doc(props.question.id).delete()
    dispatch({ type: "status", value: "deleted" })
  }

  return (
    <div className="questionContainerUser">
      <div className="questionWrapperUser">
        {props.question.status != "public" || state.status == "deleted" ? (
          <>
            <div>This Question Not Available.</div>
          </>
        ) : (
          <>
            <div className="questionAuthor">
              <div onClick={() => props.history.push("user/" + props.question.authorUid)}>
                <img src={props.question.author.userProfilePhoto} alt="" className="questionAuthorImage" />
              </div>
              <div onClick={() => props.history.push("user/" + props.question.authorUid)} className="questionAuthorName">
                <div>{props.question.author.userDisplayName}</div>
                <div className="questionAuthorNameTime">{getDateTime(props.question.time)}</div>
              </div>
              <div className="questionAuthorMore">{appState.user && props.question.author.uid == appState.user.uid ? <AiFillDelete onClick={() => dispatch({ type: "deleteQuestion", value: true })} className="moreIcon" /> : <BsFillFlagFill className="moreIcon" />}</div>
            </div>
            {state.deleteQuestion && (
              <div className="questionHeaderUser">
                <span>Do you want to delete this question?</span>
                <span onClick={() => deleteQuestion()}>YES</span>
                <span onClick={() => dispatch({ type: "deleteQuestion", value: false })}>NO</span>
              </div>
            )}
            {props.question.topic && (
              <div className="questionHeaderUser">
                <Link className="questionHeaderLinkUser" to={"/topic/" + props.question.topic}>
                  <span className="questionHeaderLinkTextUser">{props.question.topic}</span>
                </Link>
              </div>
            )}
            <div className="questionUser">{props.question.question}</div>
            <div onClick={() => response(1)} className={`questionChoiceUser ${state.selectedChoice > 0 ? (props.question.correctChoice == 1 ? "questionChoiceCorrectUser" : state.selectedChoice == 1 ? "questionChoiceWrongUser" : "disableChoiceUser") : ""}`}>
              <div className="questionChoiceRadioUser">A</div>
              <div className="questionChoiceTextUser">
                {props.question.choiceA}
                <span className="questionResultIcon">{state.selectedChoice > 0 ? props.question.correctChoice == 1 ? <AiFillCheckCircle className="questionChoiceRadioIconUser" /> : state.selectedChoice == 1 ? <AiFillCloseCircle className="questionChoiceWrongRadioIconUser" /> : null : null}</span>
              </div>
            </div>
            <div onClick={() => response(2)} className={`questionChoiceUser ${state.selectedChoice > 0 ? (props.question.correctChoice == 2 ? "questionChoiceCorrectUser" : state.selectedChoice == 2 ? "questionChoiceWrongUser" : "disableChoiceUser") : ""}`}>
              <div className="questionChoiceRadioUser">B</div>
              <div className="questionChoiceTextUser">
                {props.question.choiceB}
                <span className="questionResultIcon">{state.selectedChoice > 0 ? props.question.correctChoice == 2 ? <AiFillCheckCircle className="questionChoiceRadioIconUser" /> : state.selectedChoice == 2 ? <AiFillCloseCircle className="questionChoiceWrongRadioIconUser" /> : null : null}</span>
              </div>
            </div>
            <div onClick={() => response(3)} className={`questionChoiceUser ${state.selectedChoice > 0 ? (props.question.correctChoice == 3 ? "questionChoiceCorrectUser" : state.selectedChoice == 3 ? "questionChoiceWrongUser" : "disableChoiceUser") : ""}`}>
              <div className="questionChoiceRadioUser">C</div>
              <div className="questionChoiceTextUser">
                {props.question.choiceC}
                <span className="questionResultIcon">{state.selectedChoice > 0 ? props.question.correctChoice == 3 ? <AiFillCheckCircle className="questionChoiceRadioIconUser" /> : state.selectedChoice == 3 ? <AiFillCloseCircle className="questionChoiceWrongRadioIconUser" /> : null : null}</span>
              </div>
            </div>
            <div onClick={() => response(4)} className={`questionChoiceUser ${state.selectedChoice > 0 ? (props.question.correctChoice == 4 ? "questionChoiceCorrectUser" : state.selectedChoice == 4 ? "questionChoiceWrongUser" : "disableChoiceUser") : ""}`}>
              <div className="questionChoiceRadioUser">D</div>
              <div className="questionChoiceTextUser">
                {props.question.choiceD}
                <span className="questionResultIcon">{state.selectedChoice > 0 ? props.question.correctChoice == 4 ? <AiFillCheckCircle className="questionChoiceRadioIconUser" /> : state.selectedChoice == 4 ? <AiFillCloseCircle className="questionChoiceWrongRadioIconUser" /> : null : null}</span>
              </div>
            </div>
            <div className="questionFooterUser">
              <div onClick={() => upvote(state.upVote ? false : true)} className="questionFooterVoteSection">
                {state.upVote ? <TiArrowUpThick className="voteButtonGreen" /> : <TiArrowUpOutline className="voteButton" />}
                <span className="voteCount">{state.totalVoteCount}</span>
                {/* <BiDownvote className="voteButton" /> */}
              </div>
              <div onClick={() => props.history.push("question/" + props.question.id)} className="questionFooterCommentSection">
                <MdComment className="commentIcon" />
                {/* <span className="commentCount">10</span> */}
              </div>
              <div className="questionFooterCommentSection" onClick={() => dispatch({ type: "share", value: true })}>
                <HiShare className="shareIcon" />
              </div>
            </div>

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
          </>
        )}
      </div>
    </div>
  )
}

export default withRouter(QuestionUser)
