/* eslint-disable */

import "./postQuestion.css"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import { useImmerReducer } from "use-immer"
import { useContext } from "react"
import AddQuestion from "../../components/addQuestion/AddQuestion"
import QuestionAdmin from "../../components/questionAdmin/QuestionAdmin"
import Login from "../../components/login/Login"

function PostQuestion() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const initialState = {
    active: "addQuestion",
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "active":
        draft.active = action.value
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  return (
    <div className="adminContainer container">
      <div className="adminWrapper">{appState.user ? <AddQuestion /> : <div className="messageToUser">You are not logged in!</div>}</div>
    </div>
  )
}
export default PostQuestion
