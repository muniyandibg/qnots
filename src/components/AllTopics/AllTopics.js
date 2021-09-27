/* eslint-disable */

import { useContext, useEffect } from "react"
import { useImmerReducer } from "use-immer"
import DispatchContext from "../../DispatchContext"
import firebase from "../../firebaseConfig"
import StateContext from "../../StateContext"
import Loader from "../loader/Loader"
import "./allTopics.css"

function AllTopics() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const initialState = {
    loading: false,
    active: "a",
    topics: [],
  }
  function ourReducer(draft, action) {
    switch (action.type) {
      case "loading":
        draft.loading = action.value
        return
      case "active":
        draft.active = action.value
        return
      case "topics":
        draft.topics = action.value
        draft.loading = false
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  useEffect(() => {
    getData()
  }, [])
  useEffect(() => {
    window.scrollTo(0, 0)
    getData()
  }, [state.active])
  const getData = async () => {
    dispatch({ type: "loading", value: true })
    await firebase
      .firestore()
      .collection("topics")
      .where("searchKeywords", "array-contains", state.active)
      .get()
      .then((querySnapshot) => {
        let topics = []
        querySnapshot.forEach((doc) => {
          topics.push(doc.data().topic)
        })
        dispatch({ type: "topics", value: topics })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <div className="allTopicsContainer">
      <ul className="allTopicsAlphabets">
        <li onClick={() => dispatch({ type: "active", value: "a" })} className={`allTopicsAlphabetItem ${state.active == "a" && "allTopicsAlphabetItemActive"}`}>
          a
        </li>
        <li onClick={() => dispatch({ type: "active", value: "b" })} className={`allTopicsAlphabetItem ${state.active == "b" && "allTopicsAlphabetItemActive"}`}>
          b
        </li>
        <li onClick={() => dispatch({ type: "active", value: "c" })} className={`allTopicsAlphabetItem ${state.active == "c" && "allTopicsAlphabetItemActive"}`}>
          c
        </li>
        <li onClick={() => dispatch({ type: "active", value: "d" })} className={`allTopicsAlphabetItem ${state.active == "d" && "allTopicsAlphabetItemActive"}`}>
          d
        </li>
        <li onClick={() => dispatch({ type: "active", value: "e" })} className={`allTopicsAlphabetItem ${state.active == "e" && "allTopicsAlphabetItemActive"}`}>
          e
        </li>
        <li onClick={() => dispatch({ type: "active", value: "f" })} className={`allTopicsAlphabetItem ${state.active == "f" && "allTopicsAlphabetItemActive"}`}>
          f
        </li>
        <li onClick={() => dispatch({ type: "active", value: "g" })} className={`allTopicsAlphabetItem ${state.active == "g" && "allTopicsAlphabetItemActive"}`}>
          g
        </li>
        <li onClick={() => dispatch({ type: "active", value: "h" })} className={`allTopicsAlphabetItem ${state.active == "h" && "allTopicsAlphabetItemActive"}`}>
          h
        </li>
        <li onClick={() => dispatch({ type: "active", value: "i" })} className={`allTopicsAlphabetItem ${state.active == "i" && "allTopicsAlphabetItemActive"}`}>
          i
        </li>
        <li onClick={() => dispatch({ type: "active", value: "j" })} className={`allTopicsAlphabetItem ${state.active == "j" && "allTopicsAlphabetItemActive"}`}>
          j
        </li>
        <li onClick={() => dispatch({ type: "active", value: "k" })} className={`allTopicsAlphabetItem ${state.active == "k" && "allTopicsAlphabetItemActive"}`}>
          k
        </li>
        <li onClick={() => dispatch({ type: "active", value: "l" })} className={`allTopicsAlphabetItem ${state.active == "l" && "allTopicsAlphabetItemActive"}`}>
          l
        </li>
        <li onClick={() => dispatch({ type: "active", value: "m" })} className={`allTopicsAlphabetItem ${state.active == "m" && "allTopicsAlphabetItemActive"}`}>
          m
        </li>
        <li onClick={() => dispatch({ type: "active", value: "n" })} className={`allTopicsAlphabetItem ${state.active == "n" && "allTopicsAlphabetItemActive"}`}>
          n
        </li>
        <li onClick={() => dispatch({ type: "active", value: "o" })} className={`allTopicsAlphabetItem ${state.active == "o" && "allTopicsAlphabetItemActive"}`}>
          o
        </li>
        <li onClick={() => dispatch({ type: "active", value: "p" })} className={`allTopicsAlphabetItem ${state.active == "p" && "allTopicsAlphabetItemActive"}`}>
          p
        </li>
        <li onClick={() => dispatch({ type: "active", value: "q" })} className={`allTopicsAlphabetItem ${state.active == "q" && "allTopicsAlphabetItemActive"}`}>
          q
        </li>
        <li onClick={() => dispatch({ type: "active", value: "r" })} className={`allTopicsAlphabetItem ${state.active == "r" && "allTopicsAlphabetItemActive"}`}>
          r
        </li>
        <li onClick={() => dispatch({ type: "active", value: "s" })} className={`allTopicsAlphabetItem ${state.active == "s" && "allTopicsAlphabetItemActive"}`}>
          s
        </li>
        <li onClick={() => dispatch({ type: "active", value: "t" })} className={`allTopicsAlphabetItem ${state.active == "t" && "allTopicsAlphabetItemActive"}`}>
          t
        </li>
        <li onClick={() => dispatch({ type: "active", value: "u" })} className={`allTopicsAlphabetItem ${state.active == "u" && "allTopicsAlphabetItemActive"}`}>
          u
        </li>
        <li onClick={() => dispatch({ type: "active", value: "v" })} className={`allTopicsAlphabetItem ${state.active == "v" && "allTopicsAlphabetItemActive"}`}>
          v
        </li>
        <li onClick={() => dispatch({ type: "active", value: "w" })} className={`allTopicsAlphabetItem ${state.active == "w" && "allTopicsAlphabetItemActive"}`}>
          w
        </li>
        <li onClick={() => dispatch({ type: "active", value: "x" })} className={`allTopicsAlphabetItem ${state.active == "x" && "allTopicsAlphabetItemActive"}`}>
          x
        </li>
        <li onClick={() => dispatch({ type: "active", value: "y" })} className={`allTopicsAlphabetItem ${state.active == "y" && "allTopicsAlphabetItemActive"}`}>
          y
        </li>
        <li onClick={() => dispatch({ type: "active", value: "z" })} className={`allTopicsAlphabetItem ${state.active == "z" && "allTopicsAlphabetItemActive"}`}>
          z
        </li>
      </ul>
      {state.loading ? (
        <div className="topicListByAlphabet">
          <div className="loaderSection">
            <Loader />
          </div>
        </div>
      ) : (
        <div className="topicListByAlphabet">
          {state.topics.length > 0 ? (
            state.topics.map((item, index) => {
              return (
                <div key={index} className="topicListItem">
                  <span className="topicListItemText">{item}</span>
                  {appState.followingTopics.indexOf(item) > -1 ? (
                    <span onClick={() => appDispatch({ type: "unFollowTopic", value: item })} className="topicListItemTextUnFollowBtn">
                      Unfollow
                    </span>
                  ) : (
                    <span onClick={() => appDispatch({ type: "followTopic", value: item })} className="topicListItemTextFollowBtn">
                      Follow
                    </span>
                  )}
                </div>
              )
            })
          ) : (
            <div className="messageToUser">No topics to show.</div>
          )}
        </div>
      )}
    </div>
  )
}

export default AllTopics
