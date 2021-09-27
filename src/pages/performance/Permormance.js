/* eslint-disable */
import firebase from "../../firebaseConfig"
import Login from "../../components/login/Login"
import "./performance.css"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import { useImmerReducer } from "use-immer"
import { useContext, useEffect } from "react"
import GetQuestionsUser from "../../components/getQuestionsUser/GetQuestionsUser"
import Loader from "../../components/loader/Loader"

function Performance() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const initialState = {
    loading: true,
    performance: [],
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "loading":
        draft.loading = action.value
        return
      case "performance":
        let temp = action.value
        let sortedTemp = temp.slice().sort((a, b) => b.percentage - a.percentage)
        draft.performance = sortedTemp
        draft.loading = false
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    window.scrollTo(0, 0)

    if (appState.user) getData()
  }, [])

  const getData = async () => {
    let data = await firebase.firestore().collection("performance").doc(appState.user.userEmail).get()
    let subjects = Object.keys(data.data())
    let performance = []
    subjects.map((item) => {
      let subject = item
      let attemptData = data.data()[subject].split("|")
      let attempts = parseInt(attemptData[0])
      let correct = parseInt(attemptData[1])
      let wrong = attempts - correct
      let percentage = (correct / attempts) * 100
      console.log(percentage)
      let temp = { subject, correct, wrong, percentage }
      performance.push(temp)
    })
    dispatch({ type: "performance", value: performance })
    console.log(performance)
  }

  return (
    <div className="performanceContainer">
      {!appState.user ? (
        <div className="messageToUser">Login to view your performance!</div>
      ) : (
        <div>
          {state.loading ? (
            <div className="loadingContainer">
              <div className="loaderSection">
                <Loader />
              </div>
            </div>
          ) : (
            <div className="performanceWrapper">
              <div className="performanceHeader">
                <div className="performanceSubjectText">Topic</div>
                <div className="performanceFields">Correct</div>
                <div className="performanceFields">Incorrect</div>
                <div className="performanceFields">Percentage</div>
              </div>
              {state.performance.map((item, index) => {
                return (
                  <div key={index} className="performance">
                    <div className="performanceSubjectText">{item.subject}</div>
                    <div className="performanceFields">{item.correct}</div>
                    <div className="performanceFields">{item.wrong}</div>
                    <div className="performanceFields">{item.percentage.toFixed(2)} %</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default Performance
