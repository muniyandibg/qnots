/* eslint-disable */

import Login from "../../components/login/Login"
import "./topic.css"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import { useImmerReducer } from "use-immer"
import { useContext, useEffect } from "react"
import GetQuestionsUser from "../../components/getQuestionsUser/GetQuestionsUser"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

function Home() {
  const topic = useParams()
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
    <div className="topicContainer container">
      <div className="topicWrapper">
        {!appState.user && <Login />}
        <div className="topicTitleContainer">
          <div className="topicTitle">{topic.topic}</div>
        </div>
        <GetQuestionsUser topic={topic.topic} />
      </div>
    </div>
  )
}
export default Home
