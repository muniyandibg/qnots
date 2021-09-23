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
  const showLoginScreen = () => {
    appDispatch({ type: "showLoginScreen", value: false })
  }

  return (
    <div className="loginContainer">
      <div className="loginWrapper">
        <div className="quote">This application under development!</div>
        <div className="loginLogo">Qnots</div>

        {state.loading ? (
          <Loader />
        ) : (
          <div onClick={() => login()} className="loginButton">
            Continue With Google
          </div>
        )}
        <div className="termsNotice">
          <span>
            Please note, This website under development and testing. The contents may be changed or removed without notice. By using our services you are agreeing to our{" "}
            <a className="link" href="https://qnots.com/terms">
              Terms of use
            </a>{" "}
            ,{" "}
            <a className="link" href="https://qnots.com/privacy">
              Privacy policy
            </a>
          </span>
        </div>
        <div onClick={() => showLoginScreen()} className="guest">
          Continue as Guest!
        </div>
      </div>
    </div>
  )
}
export default Login
