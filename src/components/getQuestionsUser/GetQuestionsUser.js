/* eslint-disable */

import "./getQuestionsUser.css"
import { useEffect } from "react"
import { useImmerReducer } from "use-immer"
import Loader from "../loader/Loader"
import firebase from "../../firebaseConfig"
import QuestionUser from "../questionUser/QuestionUser"

function GetQuestionsUser(props) {
  const initialState = {
    loading: true,
    posts: [],
    lastVisible: null,
    loadmore: true,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "setPosts":
        draft.posts = draft.posts.concat(action.value)

        draft.loading = false
        return
      case "lastVisible":
        draft.lastVisible = action.value

        return
      case "loadmore":
        draft.loadmore = action.value

        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    let query = ""
    let data = []
    let lastVisible = state.lastVisible

    if (props.subject) {
      query = firebase.firestore().collection("questions").orderBy("time", "desc").where("subject", "==", props.subject).limit(10)
      if (lastVisible != null) query = firebase.firestore().collection("questions").orderBy("time", "desc").where("subject", "==", props.subject).startAfter(lastVisible).limit(10)
    } else {
      query = firebase.firestore().collection("questions").orderBy("time", "desc").limit(10)
      if (lastVisible != null) query = firebase.firestore().collection("questions").orderBy("time", "desc").startAfter(lastVisible).limit(10)
    }

    await query
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length > 1) {
          var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
          dispatch({ type: "lastVisible", value: lastVisible })
          console.log(lastVisible)
        }
        if (querySnapshot.docs.length < 10) {
          dispatch({ type: "loadmore", value: false })
        }
        querySnapshot.forEach((doc) => {
          let post = { ...doc.data(), id: doc.id }
          data.push(post)
        })
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error)
      })

    dispatch({ type: "setPosts", value: data })
  }

  return (
    <div className="getQuestionsContainer">
      {state.loading ? (
        <Loader />
      ) : state.posts.length ? (
        <>
          {state.posts.map((post, index) => {
            return <QuestionUser attemptsUpdate={props.attemptsUpdate} key={index} question={post} />
          })}

          {state.loadmore && (
            <div onClick={() => getData()} className="getQuestionsLoadmore">
              LOAD MORE
            </div>
          )}
        </>
      ) : (
        <div className="getQuestionsLoadmore">NEW QUESTIONS WILL BE POSTED SOON...</div>
      )}
    </div>
  )
}
export default GetQuestionsUser
