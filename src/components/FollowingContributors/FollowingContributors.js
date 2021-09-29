/* eslint-disable */
import "./followingContributors.css"
import { useContext, useEffect } from "react"
import { withRouter } from "react-router"
import { useImmerReducer } from "use-immer"
import StateContext from "../../StateContext"
import firebase from "../../firebaseConfig"
import Loader from "../loader/Loader"
import DispatchContext from "../../DispatchContext"

function FollowingContributors(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const followingContributors = appState.followingUsers
  const initialState = {
    loading: true,
    posts: [],
    lastVisible: null,
    loadmore: true,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "addUser":
        console.log(action.value)
        draft.posts = draft.posts.concat(action.value)

        return
      case "lastVisible":
        draft.lastVisible = action.value

        return
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
    if (appState.followingUsers.length == 0) {
      dispatch({ type: "loading", value: false })
      return
    }

    followingContributors.map(async (userId) => {
      await firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get()
        .then((doc) => {
          dispatch({ type: "addUser", value: doc.data() })
        })
    })

    dispatch({ type: "loading", value: false })
  }

  return (
    <div>
      {state.loading ? (
        <div className="loaderSection">
          <Loader />
        </div>
      ) : state.posts.length == 0 ? (
        <div className="messageToUser">Start following contributors to get feeds from them!</div>
      ) : (
        state.posts.map((contributor, index) => {
          return (
            <div key={contributor.uid} className="contributorCardContainer">
              <div className="contributorCardWrapper">
                <div onClick={() => props.history.push("/user/" + contributor.uid)}>
                  <img className="contributorProfilePhoto" src={contributor.userProfilePhoto} alt="img" />
                </div>
                <div onClick={() => props.history.push("/user/" + contributor.uid)} className="contributorDetails">
                  <div className="contributorName">{contributor.userDisplayName}</div>
                  <div className="contributorStats">
                    <span className="qnotsCount">{contributor.qnotsCount} Qnots</span>
                    <span>{contributor.qnotsCount} Followers</span>
                  </div>
                </div>
                <div>
                  {appState.followingUsers.indexOf(contributor.uid) > -1 ? (
                    <span onClick={() => appDispatch({ type: "unFollowUser", value: contributor.uid })} className="unFollowButton">
                      Unfollow
                    </span>
                  ) : (
                    <span onClick={() => appDispatch({ type: "followUser", value: contributor.uid })} className="followButton">
                      Follow
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
export default withRouter(FollowingContributors)
