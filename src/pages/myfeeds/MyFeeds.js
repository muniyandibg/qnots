/* eslint-disable */

import Login from "../../components/login/Login"
import "./myfeeds.css"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import { useImmerReducer } from "use-immer"
import { useContext, useEffect } from "react"
import GetQuestionsUser from "../../components/getQuestionsUser/GetQuestionsUser"

function MyFeeds() {
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
    <div className="homeContainer container">
      <div className="homeWrapper">{appState.followingTopics.length > 0 ? <GetQuestionsUser myFeeds={appState.followingTopics} /> : <div className="messageToUser">Start following topics to build your feeds...</div>}</div>
    </div>
  )
}
export default MyFeeds
