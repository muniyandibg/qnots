/* eslint-disable */

import "./admin.css"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import { useImmerReducer } from "use-immer"
import { useContext } from "react"
import AddQuestion from "../../components/addQuestion/AddQuestion"
import QuestionAdmin from "../../components/questionAdmin/QuestionAdmin"
import GetQuestionsAdmin from "../../components/getQuestionsAdmin/GetQuestionsAdmin"

function Admin() {
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
    <div className="adminContainer">
      <div className="adminWrapper">
        <div className="adminMenu">
          <div onClick={() => dispatch({ type: "active", value: "addQuestion" })} className={state.active == "addQuestion" ? "adminMenuItemActive" : "adminMenuItem"}>
            ADD QUESTION
          </div>
          <div onClick={() => dispatch({ type: "active", value: "viewQuestions" })} className={state.active == "viewQuestions" ? "adminMenuItemActive" : "adminMenuItem"}>
            VIEW QUESTIONS
          </div>
        </div>
        {state.active == "addQuestion" && <AddQuestion />}
        {state.active == "viewQuestions" && <GetQuestionsAdmin />}
      </div>
    </div>
  )
}
export default Admin
