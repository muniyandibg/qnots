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
    <div className="profileContainer">
      <div className="profileWrapper">
        <div className="userDetails">
          {appState.user && <img src={appState.user.userProfilePhoto} alt="" className="profilePhoto" />}
          {appState.user && <div className="userName">{appState.user.userDisplayName}</div>}
          {appState.user ? (
            <div onClick={() => appDispatch({ type: "changeLogoutCount" })} className="logoutButtonUser">
              Logout
            </div>
          ) : (
            <div className="messageToUser">You are not logged in!</div>
          )}
        </div>
        {appState.user && <GetQuestionsUser authorUid={appState.user.uid} />}
      </div>
    </div>
  )
}
export default Profile
