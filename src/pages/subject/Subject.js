/* eslint-disable */

import Login from "../../components/login/Login"
import "./subject.css"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import { useImmerReducer } from "use-immer"
import { useContext, useEffect } from "react"
import GetQuestionsUser from "../../components/getQuestionsUser/GetQuestionsUser"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

function Home() {
  const subject = useParams()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const initialState = {
    loading: true,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "loading":
        draft.loading = action.value
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="subjectContainer">
      <div className="subjectWrapper">
        {!appState.user && <Login />}
        <div className="subjectTitleContainer">
          <div className="subjectTitle">{subject.subject}</div>
        </div>
        <GetQuestionsUser subject={subject.subject} />
      </div>
    </div>
  )
}
export default Home
