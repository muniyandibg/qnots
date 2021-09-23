/* eslint-disable */

import { useContext, useEffect } from "react"
import firebase from "../../firebaseConfig"
import { useImmerReducer } from "use-immer"
import StateContext from "../../StateContext"
import Loader from "../loader/Loader"
import "./followingTopics.css"
import DispatchContext from "../../DispatchContext"

function FollowingTopics() {
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
    //getData()
  }, [])

  const getData = async () => {
    await firebase.firestore().collection("following").where("user", "==", appState.user.userEmail).get()
  }

  return (
    <div className="followingTopicsContainer">
      <div className="topicListByAlphabet">
        {appState.followingTopics.length > 0 ? (
          appState.followingTopics.map((item, index) => {
            return (
              <div key={index} className="topicListItem">
                <span className="topicListItemText">{item}</span>
                <span onClick={() => appDispatch({ type: "unFollowTopic", value: item })} className="topicListItemTextUnFollowBtn">
                  Unfollow
                </span>
              </div>
            )
          })
        ) : (
          <div className="messageToUser">No topics to show.</div>
        )}
      </div>
    </div>
  )
}
export default FollowingTopics
