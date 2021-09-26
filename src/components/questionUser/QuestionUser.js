/* eslint-disable */

import { HiShare } from "react-icons/hi"
import "./questionUser.css"
import firebase from "../../firebaseConfig"
import { Link, withRouter, history } from "react-router-dom"
import { AiFillCheckCircle, AiFillCloseCircle, AiFillDelete, AiFillLike } from "react-icons/ai"
import { BsFillTriangleFill } from "react-icons/bs"
import { TiArrowUpOutline, TiArrowUpThick } from "react-icons/ti"
import { BsFillFlagFill } from "react-icons/bs"
import { MdComment } from "react-icons/md"
import { useImmerReducer } from "use-immer"
import { useContext, useEffect } from "react"
import StateContext from "../../StateContext"
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share"
import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share"
import { FiMoreVertical } from "react-icons/fi"
import DispatchContext from "../../DispatchContext"

function QuestionUser(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const initialState = {
    selectedChoice: null,
    loading: true,
    posts: [],
    lastVisible: null,
    loadmore: true,
    share: false,
    activityData: null,
    upVote: null,
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
        draft.share = !draft.share
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
        .collection("upvotes")
        .doc(activityId)
        .get()
        .then((doc) => {
          if (doc.exists) dispatch({ type: "upVote", value: true })
          else dispatch({ type: "upVote", value: false })
        })
      firebase
        .firestore()
        .collection("answers")
        .doc(activityId)
        .get()
        .then((doc) => {
          if (doc.exists) dispatch({ type: "selectedChoice", value: doc.data().attempt })
          else dispatch({ type: "selectedChoice", value: 0 })
        })
    }
  }, [])

  const response = (userChoice) => {
    if (appState.user) {
      let activityId = props.uid + "|" + props.question.id
      dispatch({ type: "selectedChoice", value: userChoice })
      firebase.firestore().collection("answers").doc(activityId).set({ uid: props.uid, qid: props.question.id, attempt: userChoice })
      updateUserPerformance(userChoice)
    } else {
      dispatch({ type: "selectedChoice", value: userChoice })
      return
    }
  }
  const upvote = (userVote) => {
    if (appState.user) {
      let activityId = props.uid + "|" + props.question.id
      if (state.upVote) {
        dispatch({ type: "upVote", value: false })
        updateVotes("downvote")
        updateContributorVotes("downvote")
        firebase.firestore().collection("upvotes").doc(activityId).delete()
      } else {
        dispatch({ type: "upVote", value: true })
        let data = { uid: props.uid, qid: props.question.id, time: firebase.firestore.FieldValue.serverTimestamp() }
        firebase.firestore().collection("upvotes").doc(activityId).set(data)
        updateVotes("upvote")
        updateContributorVotes("upvote")
      }
    } else {
      appDispatch({ type: "showLoginScreen", value: true })
      return
    }
  }
  const updateUserPerformance = async (userChoice) => {
    if (!props.question.topic) {
      return
    }
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

  const updateVotes = async (userVote) => {
    var sfDocRef = firebase.firestore().collection("questions").doc(props.question.id)

    return firebase
      .firestore()
      .runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
          if (!sfDoc.exists) {
          } else {
            let voteCount = sfDoc.data().voteCount ? parseInt(sfDoc.data().voteCount) : 0
            console.log("error", voteCount)
            if (userVote == "upvote") {
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
  const updateContributorVotes = async (userVote) => {
    var sfDocRef = firebase.firestore().collection("users").doc(props.uid)

    return firebase
      .firestore()
      .runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
          if (!sfDoc.exists) {
          } else {
            let voteCount = sfDoc.data().voteCount ? parseInt(sfDoc.data().voteCount) : 0
            console.log("error", voteCount)
            if (userVote == "upvote") {
              voteCount++
            } else {
              voteCount--
            }
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
              <div onClick={() => props.history.push("/user/" + props.question.authorUid)}>
                <img src={props.question.author.userProfilePhoto} alt="" className="questionAuthorImage" />
              </div>
              <div onClick={() => props.history.push("/user/" + props.question.authorUid)} className="questionAuthorName">
                <div>{props.question.author.userDisplayName}</div>
                <div className="questionAuthorNameTimeUser">{getDateTime(props.question.time)}</div>
              </div>
              <div className="questionAuthorMore">{appState.user && props.question.author.uid == appState.user.uid ? <AiFillDelete onClick={() => dispatch({ type: "deleteQuestion", value: true })} className="moreIcon" /> : <BsFillFlagFill className="moreIcon" />}</div>
            </div>
            {state.deleteQuestion && (
              <div className="questionDelete">
                <span>Do you want to delete this question?</span>
                <span onClick={() => deleteQuestion()} className="questionDeleteChoice">
                  Yes
                </span>
                <span onClick={() => dispatch({ type: "deleteQuestion", value: false })} className="questionDeleteChoice">
                  No
                </span>
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
              <div className="questionChoiceTextUser">{props.question.choiceA}</div>
              {state.selectedChoice > 0 ? props.question.correctChoice == 1 ? <AiFillCheckCircle className="questionChoiceRadioIconUser" /> : state.selectedChoice == 1 ? <AiFillCloseCircle className="questionChoiceWrongRadioIconUser" /> : null : null}
            </div>
            <div onClick={() => response(2)} className={`questionChoiceUser ${state.selectedChoice > 0 ? (props.question.correctChoice == 2 ? "questionChoiceCorrectUser" : state.selectedChoice == 2 ? "questionChoiceWrongUser" : "disableChoiceUser") : ""}`}>
              <div className="questionChoiceRadioUser">B</div>
              <div className="questionChoiceTextUser">{props.question.choiceB}</div>
              {state.selectedChoice > 0 ? props.question.correctChoice == 2 ? <AiFillCheckCircle className="questionChoiceRadioIconUser" /> : state.selectedChoice == 2 ? <AiFillCloseCircle className="questionChoiceWrongRadioIconUser" /> : null : null}
            </div>
            <div onClick={() => response(3)} className={`questionChoiceUser ${state.selectedChoice > 0 ? (props.question.correctChoice == 3 ? "questionChoiceCorrectUser" : state.selectedChoice == 3 ? "questionChoiceWrongUser" : "disableChoiceUser") : ""}`}>
              <div className="questionChoiceRadioUser">C</div>
              <div className="questionChoiceTextUser">{props.question.choiceC}</div>
              {state.selectedChoice > 0 ? props.question.correctChoice == 3 ? <AiFillCheckCircle className="questionChoiceRadioIconUser" /> : state.selectedChoice == 3 ? <AiFillCloseCircle className="questionChoiceWrongRadioIconUser" /> : null : null}
            </div>
            <div onClick={() => response(4)} className={`questionChoiceUser ${state.selectedChoice > 0 ? (props.question.correctChoice == 4 ? "questionChoiceCorrectUser" : state.selectedChoice == 4 ? "questionChoiceWrongUser" : "disableChoiceUser") : ""}`}>
              <div className="questionChoiceRadioUser">D</div>
              <div className="questionChoiceTextUser">{props.question.choiceD}</div>
              {state.selectedChoice > 0 ? props.question.correctChoice == 4 ? <AiFillCheckCircle className="questionChoiceRadioIconUser" /> : state.selectedChoice == 4 ? <AiFillCloseCircle className="questionChoiceWrongRadioIconUser" /> : null : null}
            </div>
            <div className="questionFooterUser">
              <div onClick={() => upvote(state.upVote ? false : true)} className="questionFooterVoteSection">
                {state.upVote ? <BsFillTriangleFill className="voteButtonUpVoted" /> : <BsFillTriangleFill className="voteButton" />}
                <span className={`voteCount ${state.upVote && "voteCountUpVoted"}`}>{state.totalVoteCount ? state.totalVoteCount + " votes" : "Upvote"}</span>
                {/* <BiDownvote className="voteButton" /> */}
              </div>
              <div onClick={() => props.history.push("/question/" + props.question.id)} className="questionFooterCommentSection">
                <MdComment className="commentIcon" />
                <span className="voteCount">Comment</span>
                {/* <span className="commentCount">10</span> */}
              </div>
              <div className="questionFooterCommentSection" onClick={() => dispatch({ type: "share" })}>
                <HiShare className="shareIcon" />
                <span className="voteCount">Share</span>
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
