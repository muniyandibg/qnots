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
        <div className="topicTitleContainer">
          <div className="topicTitle">
            <span className="hash">#</span>
            <span className="topicLinkText">{topic.topic}</span>
          </div>
          <div>
            {appState.followingTopics.indexOf(topic.topic) > -1 ? (
              <span onClick={() => appDispatch({ type: "unFollowTopic", value: topic.topic })} className="topicListItemTextUnFollowBtn">
                Unfollow
              </span>
            ) : (
              <span onClick={() => appDispatch({ type: "followTopic", value: topic.topic })} className="topicListItemTextFollowBtn">
                Follow
              </span>
            )}
          </div>
        </div>
        <GetQuestionsUser topic={topic.topic} />
      </div>
    </div>
  )
}
export default Home
