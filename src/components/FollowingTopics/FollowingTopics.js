/* eslint-disable */

import { useContext, useEffect } from "react"
import firebase from "../../firebaseConfig"
import { withRouter } from "react-router"
import { useImmerReducer } from "use-immer"
import StateContext from "../../StateContext"
import Loader from "../loader/Loader"
import "./followingTopics.css"
import DispatchContext from "../../DispatchContext"

function FollowingTopics(props) {
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
                <span onClick={() => props.history.push("/topic/" + item)} className="topicListItemText">
                  {item}
                </span>
                <span onClick={() => appDispatch({ type: "unFollowTopic", value: item })} className="topicListItemTextUnFollowBtn">
                  Unfollow
                </span>
              </div>
            )
          })
        ) : appState.user ? (
          <div className="messageToUser">Start following topics!</div>
        ) : (
          <div className="messageToUser">Login to view your favorite topics!</div>
        )}
      </div>
    </div>
  )
}
export default withRouter(FollowingTopics)
