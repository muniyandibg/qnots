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
    var docRef = firebase.firestore().collection("questions").doc("4P8AAcEWWsn9OblX6YiQ")
    console.log(id)
    await docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log(doc.data())
          dispatch({ type: "question", value: { ...doc.data(), id } })
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
    <div className="questionContainer">
      <div className="questionWrapper">
        {!appState.user && <Login />}
        {!state.loading && <QuestionUser question={state.question} />}
      </div>
    </div>
  )
}
export default Question
