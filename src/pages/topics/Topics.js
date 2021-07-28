/* eslint-disable */

import "./topics.css"
import { Link } from "react-router-dom"
import { FcFolder } from "react-icons/fc"
import subjectData from "../../topics.json"
import { useEffect } from "react"

function Topics() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="topicContainer">
      <div className="topicWrapper">
        <div className="titleContainer">
          <div className="title">Subjects</div>
        </div>
        {subjectData.subjects.map((subject, index) => {
          return (
            <Link to={"/subject/" + subject} exact className="subjectLink">
              <FcFolder className="subjectFolderIcon" />
              <div className="subjectText">{subject}</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
export default Topics
