/* eslint-disable */

import { NavLink, useLocation } from "react-router-dom"
import "./header.css"
import logo from "../../assets/qnots1.png"
import { AiOutlineHome, AiFillHome, AiFillTrophy, AiOutlineTrophy, AiOutlinePieChart, AiFillPieChart } from "react-icons/ai"
import { RiFileListLine, RiFileListFill, RiMedalFill, RiMedalLine } from "react-icons/ri"
import { FaRegUserCircle } from "react-icons/fa"
import DispatchContext from "../../DispatchContext"
import StateContext from "../../StateContext"
import { useContext } from "react"

function Header() {
  const { pathname } = useLocation()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  return (
    <div className="headerContainer">
      <div className="headerWrapper">
        <div className="headerLeft">
          <img src={logo} alt="logo" className="headerLeftLogo" />
        </div>
        <div className="headerRight">
          <ul className="headerMenu">
            <li className="headerMenuItem">
              <NavLink exact to="/" activeClassName="headerMenuActiveLink">
                {pathname === "/" ? <AiFillHome className="headerMenuIcon" /> : <AiOutlineHome className="headerMenuIcon" />}
              </NavLink>
            </li>
            <li className="headerMenuItem">
              <NavLink exact to="/topics" activeClassName="headerMenuActiveLink">
                {pathname === "/topics" ? <RiFileListFill className="headerMenuIcon" /> : <RiFileListLine className="headerMenuIcon" />}
              </NavLink>
            </li>
            <li className="headerMenuItem">
              <NavLink exact to="/performance" activeClassName="headerMenuActiveLink">
                {pathname === "/performance" ? <AiFillPieChart className="headerMenuIcon" /> : <AiOutlinePieChart className="headerMenuIcon" />}
              </NavLink>
            </li>
            {/* <li className="headerMenuItem">
              <NavLink exact to="/kleague" activeClassName="headerMenuActiveLink">
                {pathname === "/kleague" ? <AiFillTrophy className="headerMenuIcon" /> : <AiOutlineTrophy className="headerMenuIcon" />}
              </NavLink>
            </li>
            <li className="headerMenuItem">
              <NavLink exact to="/medals" activeClassName="headerMenuActiveLink">
                {pathname === "/medals" ? <RiMedalFill className="headerMenuIcon" /> : <RiMedalLine className="headerMenuIcon" />}
              </NavLink>
            </li> */}
            <li className="headerMenuItem">
              <NavLink exact to="/profile" activeClassName="headerMenuActiveLink">
                {appState.user ? (
                  <div className="headerMenuIcon">
                    <img src={appState.user.userProfilePhoto} alt="profile" className="headerProfileImage" />
                  </div>
                ) : (
                  <FaRegUserCircle className="headerMenuIcon" />
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
export default Header
