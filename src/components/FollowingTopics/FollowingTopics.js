/* eslint-disable */

import { useContext, useEffect } from "react"
import firebase from "../../firebaseConfig"
import { useImmerReducer } from "use-immer"
import StateContext from "../../StateContext"
import Loader from "../loader/Loader"
import "./followingTopics.css"

function FollowingTopics() {
  const appState = useContext(StateContext)

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
    getData()
  }, [])

  const getData = async () => {
    await firebase.firestore().collection("following").where("user", "==", appState.user.userEmail).get()
  }

  return (
    <div className="followingTopicsContainer">
      {state.loading ? (
        <Loader />
      ) : (
        <div className="followingTopicsWrapper">
          <div>Topic1</div>
          <div>Topic1</div>
          <div>Topic1</div>
          <div>Topic1</div>
        </div>
      )}
    </div>
  )
}
export default FollowingTopics
