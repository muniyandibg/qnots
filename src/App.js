/* eslint-disable */
import "./App.css"
import { useEffect } from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import Header from "./components/header/Header"
import Home from "./pages/home/Home"
import Performance from "./pages/performance/Permormance"
import Question from "./pages/question/Question"
import Subject from "./pages/subject/Subject"
import Topics from "./pages/topics/Topics"
import firebase from "./firebaseConfig"
import Loader from "./components/loader/Loader"
import Profile from "./pages/profile/Profile"
import Admin from "./pages/admin/Admin"
import Terms from "./pages/terms/Terms"
import Privacy from "./pages/privacy/Privacy"

function App() {
  const initialState = {
    loading: true,
    user: null,
    loginCount: 0,
    logoutCount: 0,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "loading":
        draft.loading = action.value
        return

      case "setUserData":
        console.log(action.value)
        draft.user = action.value
        draft.loading = false
        return
      case "logoutUser":
        draft.user = null
        draft.loading = false
        return
      case "changeLoginCount":
        draft.loginCount = draft.loginCount + 1
        return
      case "changeLogoutCount":
        draft.logoutCount = draft.loginCount + 1
        return
      default:
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        let userData = { userDisplayName: user.displayName, userProfilePhoto: user.photoURL, userEmail: user.email }

        dispatch({ type: "setUserData", value: userData })
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
              <Route path="/topics" exact>
                <Topics />
              </Route>
              <Route path="/performance" exact>
                <Performance />
              </Route>
              <Route path="/profile" exact>
                <Profile />
              </Route>
              <Route path="/admin" exact>
                <Admin />
              </Route>
              <Route path="/question/:id" exact>
                <Question />
              </Route>
              <Route path="/subject/:subject" exact>
                <Subject />
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
