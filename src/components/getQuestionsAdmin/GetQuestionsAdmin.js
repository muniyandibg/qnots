/* eslint-disable */

import "./getQuestionsAdmin.css"
import { useEffect } from "react"
import { useImmerReducer } from "use-immer"
import Loader from "../loader/Loader"
import QuestionAdmin from "../questionAdmin/QuestionAdmin"
import firebase from "../../firebaseConfig"
import { getDefaultWatermarks } from "istanbul-lib-report"

function GetQuestionsAdmin() {
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

    // if (props.category == "All") {
    //   query = firebase.firestore().collection("polls").orderBy("time", "desc").where("status", "==", "Public").limit(10)
    //   if (lastVisible != null) query = firebase.firestore().collection("polls").orderBy("time", "desc").where("status", "==", "Public").startAfter(lastVisible).limit(10)
    // } else {
    //   query = firebase.firestore().collection("polls").orderBy("time", "desc").where("category", "==", props.category).where("status", "==", "Public").limit(10)
    //   if (lastVisible != null) query = firebase.firestore().collection("polls").orderBy("time", "desc").where("category", "==", props.category).where("status", "==", "Public").startAfter(lastVisible).limit(10)
    // }
    query = firebase.firestore().collection("questions").orderBy("time", "desc").limit(10)
    if (lastVisible != null) query = firebase.firestore().collection("questions").orderBy("time", "desc").startAfter(lastVisible).limit(10)

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
            return <QuestionAdmin key={index} question={post} />
          })}

          {state.loadmore && (
            <div onClick={() => getData()} className="getQuestionsLoadmore">
              LOAD MORE
            </div>
          )}
        </>
      ) : (
        <div className="getQuestionsLoadmore">NEW POSTS WILL BE POSTED SOON...</div>
      )}
    </div>
  )
}
export default GetQuestionsAdmin
