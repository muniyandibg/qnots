/* eslint-disable */

import "./topiclist.css"

import { useContext, useEffect, useReducer } from "react"
import FollowingTopics from "../../components/FollowingTopics/FollowingTopics"
import AllTopics from "../../components/AllTopics/AllTopics"
import { useImmerReducer } from "use-immer"
import StateContext from "../../StateContext"

function TopicList() {
  const initialState = {
    active: "following",
  }

  function ourReducer(draft, action) {
    switch (action.type) {
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
    <div className="topicContainer container">
      <div className="topicWrapper">
        <div className="topicType">
          <div onClick={() => dispatch({ type: "active", value: "following" })} className={state.active == "following" ? "topicTypeItemActive" : "topicTypeItem"}>
            Following
          </div>
          <div onClick={() => dispatch({ type: "active", value: "allTopics" })} className={state.active == "allTopics" ? "topicTypeItemActive" : "topicTypeItem"}>
            All Topics
          </div>
        </div>
        {state.active == "following" ? <FollowingTopics /> : <AllTopics />}
      </div>
    </div>
  )
}
export default TopicList
