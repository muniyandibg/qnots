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
    active: "topics",
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "loading":
        draft.loading = action.value
        return
      case "active":
        draft.active = action.value
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="topicContainer">
      <div className="topicWrapper">
        {!appState.user ? (
          <div className="messageToUser">Login to view your personalised feeds from topics you follow!</div>
        ) : (
          <div className="topicType">
            <div onClick={() => dispatch({ type: "active", value: "topics" })} className={state.active == "topics" ? "topicTypeItemActive" : "topicTypeItem"}>
              From Topics
            </div>
            <div onClick={() => dispatch({ type: "active", value: "contributors" })} className={state.active == "contributors" ? "topicTypeItemActive" : "topicTypeItem"}>
              By Contributors
            </div>
          </div>
        )}
        {appState.user && <div className="feedsRestrictionAlert">{state.active == "topics" ? "Qnots from 10 topics most recently followed by you!" : "Qnots from 10 contributors most recently followed by you!"}</div>}
        {appState.user && state.active == "topics" && <GetQuestionsUser myFeedsTopics={appState.followingTopics} />}
        {appState.user && state.active == "contributors" && <GetQuestionsUser myFeedsContributors={appState.followingUsers} />}
      </div>
    </div>
  )
}
export default MyFeeds
