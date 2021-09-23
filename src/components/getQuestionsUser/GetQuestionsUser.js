/* eslint-disable */

import "./getQuestionsUser.css"
import { useContext, useEffect } from "react"
import { useImmerReducer } from "use-immer"
import Loader from "../loader/Loader"
import firebase from "../../firebaseConfig"
import QuestionUser from "../questionUser/QuestionUser"
import StateContext from "../../StateContext"

function GetQuestionsUser(props) {
  const appState = useContext(StateContext)
  const userId = appState.user ? appState.user.uid : null
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

    if (props.topic) {
      query = firebase.firestore().collection("questions").where("topic", "==", props.topic).where("status", "==", "public").orderBy("time", "desc").limit(10)
      if (lastVisible != null) query = firebase.firestore().collection("questions").where("topic", "==", props.topic).where("status", "==", "public").orderBy("time", "desc").startAfter(lastVisible).limit(10)
    } else if (props.authorUid) {
      query = firebase.firestore().collection("questions").where("status", "==", "public").where("authorUid", "==", props.authorUid).orderBy("time", "desc").limit(10)
      if (lastVisible != null) query = firebase.firestore().collection("questions").where("status", "==", "public").where("authorUid", "==", props.authorUid).orderBy("time", "desc").startAfter(lastVisible).limit(10)
    } else if (props.myFeeds) {
      query = firebase.firestore().collection("questions").where("status", "==", "public").where("topic", "in", props.myFeeds).orderBy("time", "desc").limit(10)
      if (lastVisible != null) query = firebase.firestore().collection("questions").where("status", "==", "public").where("topic", "in", props.myFeeds).orderBy("time", "desc").startAfter(lastVisible).limit(10)
    } else {
      query = firebase.firestore().collection("questions").where("status", "==", "public").orderBy("time", "desc").limit(10)
      if (lastVisible != null) query = firebase.firestore().collection("questions").where("status", "==", "public").orderBy("time", "desc").startAfter(lastVisible).limit(10)
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
            return <QuestionUser uid={userId} key={post.id} question={post} />
          })}

          {state.loadmore && (
            <div onClick={() => getData()} className="getQuestionsLoadmoreUser">
              LOAD MORE
            </div>
          )}
        </>
      ) : (
        <div className="getQuestionsLoadmoreUser">No more qnots to show...</div>
      )}
    </div>
  )
}
export default GetQuestionsUser
