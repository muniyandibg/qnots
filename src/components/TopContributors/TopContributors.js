/* eslint-disable */
import "./topContributors.css"
import { useContext, useEffect } from "react"
import { withRouter } from "react-router"
import { useImmerReducer } from "use-immer"
import StateContext from "../../StateContext"
import firebase from "../../firebaseConfig"
import Loader from "../loader/Loader"
import DispatchContext from "../../DispatchContext"

function TopContributors(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const userId = appState.user ? appState.user.uid : null
  const initialState = {
    loading: true,
    posts: [],
    lastVisible: null,
    loadmore: true,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "setPosts":
        draft.posts = draft.posts.concat(action.value)

        draft.loading = false
        return
      case "lastVisible":
        draft.lastVisible = action.value

        return
      case "loadmore":
        draft.loadmore = action.value

        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    let query = ""
    let data = []
    let lastVisible = state.lastVisible

    query = firebase.firestore().collection("users").orderBy("qnotsCount", "desc").limit(10)
    if (lastVisible != null) query = firebase.firestore().collection("users").orderBy("qnotsCount", "desc").startAfter(lastVisible).limit(10)

    await query
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length > 1) {
          var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
          dispatch({ type: "lastVisible", value: lastVisible })
          console.log(lastVisible)
        }
        if (querySnapshot.docs.length < 10) {
          dispatch({ type: "loadmore", value: false })
        }
        querySnapshot.forEach((doc) => {
          let post = { ...doc.data(), id: doc.id }
          data.push(post)
        })
        console.log(data)
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error)
      })

    dispatch({ type: "setPosts", value: data })
  }

  return (
    <div>
      {state.loading ? (
        <div className="loaderSection">
          <Loader />
        </div>
      ) : (
        state.posts.length > 0 &&
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
export default withRouter(TopContributors)
