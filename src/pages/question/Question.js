/* eslint-disable */

import Login from "../../components/login/Login"
import "./question.css"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import { useImmerReducer } from "use-immer"
import { useContext, useEffect } from "react"
import firebase from "../../firebaseConfig"
import GetQuestionsUser from "../../components/getQuestionsUser/GetQuestionsUser"
import Loader from "../../components/loader/Loader"
import { useParams } from "react-router-dom"
import QuestionUser from "../../components/questionUser/QuestionUser"

function Question() {
  const id = useParams()

  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const userId = appState.user ? appState.user.uid : null
  const initialState = {
    loading: true,
    question: null,
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
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    window.scrollTo(0, 0)
    getQuestion()
  }, [])

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
          // doc.data() will be undefined in this case
          console.log("No such document!")
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error)
      })
  }

  return (
    <div className="questionContainerSingle">
      <div className="questionWrapperSingle">
        {!appState.user && <Login />}
        {!state.loading && <QuestionUser uid={userId} key={id.id} question={state.question} />}
        {!state.loading && <div className="commentFeature">Comment Feature will be available soon...</div>}
      </div>
    </div>
  )
}
export default Question
