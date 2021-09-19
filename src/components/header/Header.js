/* eslint-disable */

import { NavLink, useLocation } from "react-router-dom"
import "./header.css"
import logo from "../../assets/qnots1.png"
import { AiOutlineHome, AiFillHome, AiFillTrophy, AiOutlineTrophy, AiOutlinePieChart, AiFillPieChart } from "react-icons/ai"
import { RiFileListLine, RiFileListFill, RiMedalFill, RiMedalLine } from "react-icons/ri"
import { IoIosAddCircleOutline, IoIosAddCircle } from "react-icons/io"
import { FaRegUserCircle, FaUserCircle } from "react-icons/fa"
import DispatchContext from "../../DispatchContext"
import StateContext from "../../StateContext"
import { useContext } from "react"

function Header() {
  const { pathname } = useLocation()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  return (
    <div className="headerContainer">
      <div className="betaMessage">This website under development!</div>
      <ul className="headerMenu">
        <li className="headerMenuItem">
          <div className="logo">Qnots</div>
          {/* <img src={logo} alt="logo" className="headerLeftLogo" /> */}
        </li>
        <li className="headerMenuItem">
          <NavLink exact to="/" activeClassName="headerMenuActiveLink" className="headerMenuLink">
            {pathname === "/" ? <AiFillHome className="headerMenuIcon" /> : <AiOutlineHome className="headerMenuIcon" />}
            <span className="headerMenuLinkText">Home</span>
          </NavLink>
        </li>
        <li className="headerMenuItem">
          <NavLink exact to="/topiclist" activeClassName="headerMenuActiveLink" className="headerMenuLink">
            {pathname === "/topiclist" ? <RiFileListFill className="headerMenuIcon" /> : <RiFileListLine className="headerMenuIcon" />}
            <span className="headerMenuLinkText">Topics</span>
          </NavLink>
        </li>
        <li className="headerMenuItem">
          <NavLink exact to="/performance" activeClassName="headerMenuActiveLink" className="headerMenuLink">
            {pathname === "/performance" ? <AiFillPieChart className="headerMenuIcon" /> : <AiOutlinePieChart className="headerMenuIcon" />}
            <span className="headerMenuLinkText">Performance</span>
          </NavLink>
        </li>

        <li className="headerMenuItem">
          <NavLink exact to="/postquestion" activeClassName="headerMenuActiveLink" className="headerMenuLink">
            {pathname === "/postquestion" ? <IoIosAddCircle className="headerMenuIcon" /> : <IoIosAddCircleOutline className="headerMenuIcon" />}
            <span className="headerMenuLinkText">Post Question</span>
          </NavLink>
        </li>

        <li className="headerMenuItem">
          <NavLink exact to="/profile" activeClassName="headerMenuActiveLink">
            {appState.user ? (
              <div className="headerMenuIcon headerMenuLink">
                <img src={appState.user.userProfilePhoto} alt="profile" className="headerProfileImage" />
              </div>
            ) : pathname === "/profile" ? (
              <FaUserCircle className="headerMenuIcon" />
            ) : (
              <FaRegUserCircle className="headerMenuIcon" />
            )}
          </NavLink>
        </li>
      </ul>
    </div>
  )
}
export default Header
