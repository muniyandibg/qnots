/* eslint-disable */

import Login from "../../components/login/Login"
import "./home.css"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import { useImmerReducer } from "use-immer"
import { useContext, useEffect } from "react"
import GetQuestionsUser from "../../components/getQuestionsUser/GetQuestionsUser"

function Home() {
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
    <div className="homeContainer">
      <div className="homeWrapper">
        {!appState.user && <Login />}
        <div className="homeTitleContainer">
          <div className="homeTitle">Recent Questions</div>
        </div>
        <GetQuestionsUser />
      </div>
    </div>
  )
}
export default Home
