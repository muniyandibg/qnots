/* eslint-disable */
import "./App.css"
import { useEffect } from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import Header from "./components/header/Header"
import Home from "./pages/home/Home"
import MyFeeds from "./pages/myfeeds/MyFeeds"
import Performance from "./pages/performance/Permormance"
import Question from "./pages/question/Question"
import Report from "./pages/report/Report"
import PostQuestion from "./pages/postQuestion/PostQuestion"
import Topic from "./pages/topic/Topic"
import TopicList from "./pages/topiclist/TopicList"
import firebase from "./firebaseConfig"
import Loader from "./components/loader/Loader"
import Profile from "./pages/profile/Profile"
import User from "./pages/user/User"
import Admin from "./pages/admin/Admin"
import Terms from "./pages/terms/Terms"
import Privacy from "./pages/privacy/Privacy"
import Login from "./components/login/Login"

function App() {
  const initialState = {
    showLoginScreen: false,
    loading: true,
    user: null,
    loginCount: 0,
    logoutCount: 0,
    followingTopics: [],
    updateFollowingTopics: 0,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "loading":
        draft.loading = action.value
        return

      case "setUserData":
        draft.user = action.value
        draft.showLoginScreen = false
        draft.loading = false
        return
      case "logoutUser":
        draft.user = null
        draft.followingTopics = []
        draft.showLoginScreen = true
        draft.loading = false
        return
      case "showLoginScreen":
        draft.showLoginScreen = action.value
        return
      case "changeLoginCount":
        draft.loginCount = draft.loginCount + 1
        return
      case "changeLogoutCount":
        draft.logoutCount = draft.loginCount + 1
        return

      case "setFollowingTopics":
        draft.followingTopics = action.value
        return

      case "unFollowTopic":
        let index = draft.followingTopics.indexOf(action.value)
        draft.followingTopics.splice(index, 1)
        draft.updateFollowingTopics++

        return

      case "followTopic":
        if (draft.user) {
          draft.followingTopics.push(action.value)
          draft.updateFollowingTopics++
        } else draft.showLoginScreen = true
        return

      default:
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.updateFollowingTopics > 0) updateFollowingTopics()
  }, [state.followingTopics])

  const updateFollowingTopics = () => {
    if (state.user) firebase.firestore().collection("following").doc(state.user.uid).set({ topics: state.followingTopics })
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        let followingTopics = await firebase.firestore().collection("following").doc(user.uid).get()
        if (followingTopics.data()) dispatch({ type: "setFollowingTopics", value: followingTopics.data().topics })
        let userData = { uid: user.uid, userDisplayName: user.displayName, userProfilePhoto: user.photoURL, userEmail: user.email, voteCount: 0 }
        dispatch({ type: "setUserData", value: userData })
        if (user.metadata.creationTime === user.metadata.lastSignInTime) {
          console.log("new user")
          firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                console.log("user record already created")
              } else {
                firebase.firestore().collection("users").doc(user.uid).set(userData)
                console.log("New user record")
              }
            })
            .catch((error) => {
              console.log("Error getting document:", error)
            })
        } else {
          console.log("existing user")
        }
      } else {
        dispatch({ type: "logoutUser" })
      }
    })
  }, [])

  useEffect(() => {
    function authenticateWithGoogle() {
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function () {
          var provider = new firebase.auth.GoogleAuthProvider()
          return firebase.auth().signInWithRedirect(provider)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
    if (state.loginCount) authenticateWithGoogle()
  }, [state.loginCount])

  useEffect(() => {
    function logout() {
      firebase
        .auth()
        .signOut()
        .then(function () {})
        .catch(function (error) {
          console.log(error)
        })
    }
    if (state.logoutCount) logout()
  }, [state.logoutCount])

  if (state.loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Loader />
      </div>
    )
  else if (state.showLoginScreen)
    return (
      <DispatchContext.Provider value={dispatch}>
        <Login />
      </DispatchContext.Provider>
    )
  else
    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <BrowserRouter>
            <Header />

            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/feeds" exact>
                <MyFeeds />
              </Route>
              <Route path="/topiclist" exact>
                <TopicList />
              </Route>
              <Route path="/performance" exact>
                <Performance />
              </Route>
              <Route path="/profile" exact>
                <Profile />
              </Route>

              <Route path="/postquestion" exact>
                <PostQuestion />
              </Route>
              <Route path="/question/:id" exact>
                <Question />
              </Route>
              <Route path="/report/:id" exact>
                <Report />
              </Route>
              <Route path="/topic/:topic" exact>
                <Topic />
              </Route>
              <Route path="/user/:id" exact>
                <User />
              </Route>
              <Route path="/terms" exact>
                <Terms />
              </Route>
              <Route path="/privacy" exact>
                <Privacy />
              </Route>
            </Switch>
          </BrowserRouter>
        </DispatchContext.Provider>
      </StateContext.Provider>
    )
}

export default App
