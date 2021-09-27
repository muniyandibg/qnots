/* eslint-disable */

import "./report.css"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import { useImmerReducer } from "use-immer"
import { useContext, useEffect } from "react"
import firebase from "../../firebaseConfig"
import { useParams } from "react-router-dom"
import QuestionUser from "../../components/questionUser/QuestionUser"

function Report() {
  const id = useParams()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const userId = appState.user ? appState.user.uid : null

  const initialState = {
    loading: true,
    question: null,
    reportData: null,
    reportText: "",
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "loading":
        draft.loading = action.value
        return
      case "question":
        console.log(action.value)
        draft.question = action.value
        draft.loading = false
        return
      case "reportText":
        draft.reportText = action.value
        return
      case "reportData":
        draft.reportData = action.value
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    window.scrollTo(0, 0)
    getQuestion()
    getReport()
  }, [])
  const getReport = async () => {
    if (!appState.user) {
      return
    }
    await firebase
      .firestore()
      .collection("reports")
      .where("uid", "==", appState.user.uid)
      .where("qid", "==", id.id)
      .get()
      .then((querySnapShot) => {
        if (querySnapShot.docs.length) dispatch({ type: "reportData", value: querySnapShot.docs[0].data() })
      })
  }

  const getQuestion = async () => {
    console.log(id)
    await firebase
      .firestore()
      .collection("questions")
      .doc(id.id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log(doc.data())
          dispatch({ type: "question", value: { ...doc.data(), id: id.id } })
        } else {
          console.log("No such document!")
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error)
      })
  }

  const postReport = async () => {
    if (state.reportText == "") {
      alert("Please enter something")
      return
    }
    let report = {
      reportText: state.reportText,
      uid: appState.user.uid,
      qid: id.id,
      userDisplayName: appState.user.userDisplayName,
      userProfilePhoto: appState.user.userProfilePhoto,
      time: firebase.firestore.FieldValue.serverTimestamp(),
    }
    let log = await firebase.firestore().collection("reports").add(report)

    if (log.id) {
      report.id = log.id
      dispatch({ type: "reportData", value: report })
    }
  }

  return (
    <div className="questionContainerSingle">
      <div className="questionWrapperSingle">
        {!state.loading && <QuestionUser uid={userId} key={id.id} question={state.question} />}
        {appState.user && state.reportData && <div className="postCommentSection">Thanks for reporting!</div>}
        {appState.user && !state.reportData && (
          <div className="postCommentSection">
            <img className="profileImg" src={appState.user.userProfilePhoto} alt="img" />
            <input
              value={state.commentText}
              onChange={(e) => {
                dispatch({ type: "reportText", value: e.target.value })
              }}
              className="commentInput"
              type="text"
              placeholder="Enter your issue with this question!"
            />
            <div onClick={() => postReport()} className="postCommentButton">
              POST
            </div>
          </div>
        )}
        {!appState.user && (
          <div onClick={() => appDispatch({ type: "showLoginScreen", value: true })} className="postCommentSection">
            <div className="messageToUser">Login to post report</div>
          </div>
        )}
      </div>
    </div>
  )
}
export default Report
