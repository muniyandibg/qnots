/* eslint-disable */

import Login from "../../components/login/Login"
import "./user.css"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import { useImmerReducer } from "use-immer"
import { useContext, useEffect } from "react"
import GetQuestionsUser from "../../components/getQuestionsUser/GetQuestionsUser"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import firebase from "../../firebaseConfig"

function User() {
  const id = useParams()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const initialState = {
    loading: true,
    user: null,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "loading":
        draft.loading = action.value
        return
      case "userData":
        draft.user = action.value
        draft.loading = false
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  useEffect(() => {
    window.scrollTo(0, 0)
    getUserData()
  }, [])

  const getUserData = async () => {
    await firebase
      .firestore()
      .collection("users")
      .doc(id.id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log(doc.data())
          dispatch({ type: "userData", value: { ...doc.data() } })
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!")
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error)
      })
  }

  return (
    <div className="profileContainer container">
      <div className="profileWrapper">
        <div className="userDetails">
          {!state.loading && state.user && <img src={state.user.userProfilePhoto} alt="" className="profilePhoto" />}
          {!state.loading && state.user && <div className="userName">{state.user.userDisplayName}</div>}
        </div>

        {appState.user && <GetQuestionsUser authorUid={id.id} />}
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
export default User
