import { useContext, useEffect } from "react/cjs/react.development"
import { useImmerReducer } from "use-immer"
import DispatchContext from "../../DispatchContext"
import firebase from "../../firebaseConfig"
import StateContext from "../../StateContext"
import Loader from "../loader/Loader"
import "./comments.css"
function Comments(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const initalState = {
    loading: true,
    commentText: "",
    comments: [],
  }
  function ourReducer(draft, action) {
    switch (action.type) {
      case "loading":
        draft.loading = action.value
        return
      case "commentText":
        draft.commentText = action.value
        return
      case "postComment":
        draft.comments.unshift(action.value)
        draft.commentText = ""
        return
      case "commentsData":
        draft.comments = action.value
        draft.loading = false
        return
      case "deleteComment":
        draft.comments.splice(action.value, 1)
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initalState)
  useEffect(() => {
    firebase
      .firestore()
      .collection("comments")
      .orderBy("time", "desc")
      .get()
      .then((querySnapShots) => {
        let data = []
        querySnapShots.forEach((doc) => {
          let commentData = doc.data()
          commentData.id = doc.id
          data.push(commentData)
        })
        dispatch({ type: "commentsData", value: data })
      })
  }, [])
  const postComment = async () => {
    if (state.commentText == "") {
      alert("Please enter something")
      return
    }
    let comment = {
      commentText: state.commentText,
      uid: appState.user.uid,
      qid: props.qid,
      userName: appState.user.userDisplayName,
      userProfilePhoto: appState.user.userProfilePhoto,
      time: firebase.firestore.FieldValue.serverTimestamp(),
    }
    let log = await firebase.firestore().collection("comments").add(comment)
    if (log.id) {
      updateCommentCount()
    }
    let commentData = { ...comment, id: log.id }
    dispatch({ type: "postComment", value: commentData })
  }
  const updateCommentCount = () => {
    var sfDocRef = firebase.firestore().collection("questions").doc(props.qid)

    return firebase
      .firestore()
      .runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
          if (!sfDoc.exists) {
          } else {
            let commentCount = sfDoc.data().commentCount ? parseInt(sfDoc.data().commentCount) : 0

            commentCount++

            transaction.update(sfDocRef, { commentCount })
          }
        })
      })
      .then(() => {
        console.log("Transaction successfully committed!")
      })
      .catch((error) => {
        console.log("Transaction failed: ", error)
      })
  }
  const deleteComment = (commentId, index) => {
    firebase.firestore().collection("comments").doc(commentId).delete()
    dispatch({ type: "deleteComment", value: index })
  }

  return (
    <div className="commentsContainer">
      <div className="commentsWrapper">
        {appState.user ? (
          <div className="postCommentSection">
            <img className="profileImg" src={appState.user.userProfilePhoto} alt="img" />
            <input
              value={state.commentText}
              onChange={(e) => {
                dispatch({ type: "commentText", value: e.target.value })
              }}
              className="commentInput"
              type="text"
              placeholder="Enter your comment"
            />
            <div onClick={() => postComment()} className="postCommentButton">
              POST
            </div>
          </div>
        ) : (
          <div onClick={() => appDispatch({ type: "showLoginScreen", value: true })} className="postCommentSection">
            Login to post comment
          </div>
        )}
        {state.loading ? (
          <div className="commentsLoader">
            <Loader />
          </div>
        ) : state.comments.length > 0 ? (
          state.comments.map((comment, index) => {
            return (
              <div key={comment.id} className="userComment">
                <span className="commentUserName">{comment.userName}</span>
                <span>{comment.commentText}</span>
                {appState.user && appState.user.uid == comment.uid && (
                  <span onClick={() => deleteComment(comment.id, index)} className="commentDeleteButton">
                    Delete
                  </span>
                )}
              </div>
            )
          })
        ) : (
          <div>Be the first to comment</div>
        )}
      </div>
    </div>
  )
}

export default Comments
