/* eslint-disable */

import "./contributors.css"

import { useContext, useEffect, useReducer } from "react"
import FollowingContributors from "../../components/FollowingContributors/FollowingContributors"
import TopContributors from "../../components/TopContributors/TopContributors"
import { useImmerReducer } from "use-immer"
import StateContext from "../../StateContext"

function TopicList() {
  const initialState = {
    active: "topContributors",
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
    <div className="topicContainer">
      <div className="topicWrapper">
        <div className="topicType">
          <div onClick={() => dispatch({ type: "active", value: "topContributors" })} className={state.active == "topContributors" ? "topicTypeItemActive" : "topicTypeItem"}>
            Top Contributors
          </div>
          <div onClick={() => dispatch({ type: "active", value: "following" })} className={state.active == "following" ? "topicTypeItemActive" : "topicTypeItem"}>
            Following
          </div>
        </div>
        {state.active == "following" ? <FollowingContributors /> : <TopContributors />}
      </div>
    </div>
  )
}
export default TopicList
