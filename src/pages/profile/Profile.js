/* eslint-disable */

import Login from "../../components/login/Login"
import "./profile.css"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import { useImmerReducer } from "use-immer"
import { useContext, useEffect } from "react"
import GetQuestionsUser from "../../components/getQuestionsUser/GetQuestionsUser"

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
    <div className="profileContainer container">
      <div className="profileWrapper">
        {appState.user && <img src={appState.user.userProfilePhoto} alt="" className="profilePhoto" />}
        {appState.user && <div className="userName">{appState.user.userDisplayName}</div>}
        {appState.user ? (
          <div onClick={() => appDispatch({ type: "changeLogoutCount" })} className="logoutButton">
            Logout
          </div>
        ) : (
          <div className="messageToUser">You are not logged in!</div>
        )}
        {appState.user && <div className="questionDivider">My Qnots</div>}
        {appState.user && <GetQuestionsUser authorUid={appState.user.uid} />}
        {/* {appState.user && (
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
        )} */}
      </div>
    </div>
  )
}
export default Profile
