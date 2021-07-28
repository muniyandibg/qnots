/* eslint-disable */

import Login from "../../components/login/Login"
import "./profile.css"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import { useImmerReducer } from "use-immer"
import { useContext, useEffect } from "react"

function Profile() {
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
    <div className="profileContainer">
      <div className="profileWrapper">
        {appState.user && <div className="moreFeatures">More Features Will Be Added Soon...</div>}
        {appState.user ? (
          <div onClick={() => appDispatch({ type: "changeLogoutCount" })} className="logoutButton">
            Logout
          </div>
        ) : (
          <Login />
        )}
        {appState.user && (
          <div className="conditionsFooter">
            By using our services you are agreeing to our{" "}
            <span>
              <a href="https://qnots.com/terms">Terms of use</a>
            </span>
            <span className="blankSpace">and</span>
            <span>
              <a href="https://qnots.com/privacy">Privacy policy</a>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
export default Profile
