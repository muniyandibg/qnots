/* eslint-disable */

import { useContext } from "react"
import { useImmerReducer } from "use-immer"
import DispatchContext from "../../DispatchContext"
import StateContext from "../../StateContext"
import Loader from "../loader/Loader"
import "./login.css"

function Login() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const initialState = {
    loading: false,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "loading":
        draft.loading = action.value
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  const login = () => {
    state.loading = true
    appDispatch({ type: "changeLoginCount" })
  }

  return (
    <div className="loginContainer">
      <div className="loginWrapper">
        <div className="loginHeader">Log in to track your performance!</div>
        {state.loading ? (
          <Loader />
        ) : (
          <div onClick={() => login()} className="loginButton">
            Continue With google
          </div>
        )}
        <div className="loginFooter">
          By using our services you are agreeing to our{" "}
          <span>
            <a href="https://qnots.com/terms">Terms of use</a>
          </span>
          <span className="blankSpace">and</span>
          <span>
            <a href="https://qnots.com/privacy">Privacy policy</a>
          </span>
        </div>
      </div>
    </div>
  )
}
export default Login
