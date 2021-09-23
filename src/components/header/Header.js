/* eslint-disable */

import { NavLink, useLocation } from "react-router-dom"
import "./header.css"
import logo from "../../assets/qnots1.png"
import { AiOutlineHome, AiFillHome, AiFillTrophy, AiOutlineTrophy, AiOutlinePieChart, AiFillPieChart } from "react-icons/ai"
import { RiFileListLine, RiFileListFill, RiMedalFill, RiMedalLine } from "react-icons/ri"
import { IoIosAddCircleOutline, IoIosAddCircle } from "react-icons/io"
import { FaRegUserCircle, FaUserCircle, FaSearch } from "react-icons/fa"
import { SiFeedly } from "react-icons/si"
import { HiUserGroup } from "react-icons/hi"
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
        <div className="logo">Qnots</div>

        <div className="search">
          <FaSearch className="searchIcon" />
          <input type="text" placeholder="Search" className="searchInput" />
        </div>

        <div className="headerMenu">
          <li className="headerMenuItem">
            <NavLink exact to="/" activeClassName="headerMenuActiveLink" className="headerMenuLink">
              {pathname === "/" ? <AiFillHome className="headerMenuIcon" /> : <AiFillHome className="headerMenuIcon" />}
              <span className="headerMenuLinkText">Home</span>
            </NavLink>
          </li>
          <li className="headerMenuItem">
            <NavLink exact to="/feeds" activeClassName="headerMenuActiveLink" className="headerMenuLink">
              {pathname === "/feeds" ? <SiFeedly className="headerMenuIcon" /> : <SiFeedly className="headerMenuIcon" />}
              <span className="headerMenuLinkText">My Feeds</span>
            </NavLink>
          </li>

          <li className="headerMenuItem">
            <NavLink exact to="/topiclist" activeClassName="headerMenuActiveLink" className="headerMenuLink">
              {pathname === "/topiclist" ? <RiFileListFill className="headerMenuIcon" /> : <RiFileListFill className="headerMenuIcon" />}
              <span className="headerMenuLinkText">Topics</span>
            </NavLink>
          </li>
          <li className="headerMenuItem">
            <NavLink exact to="/contributors" activeClassName="headerMenuActiveLink" className="headerMenuLink">
              {pathname === "/contributors" ? <HiUserGroup className="headerMenuIcon" /> : <HiUserGroup className="headerMenuIcon" />}
              <span className="headerMenuLinkText">Contributors</span>
            </NavLink>
          </li>
          <li className="headerMenuItem">
            <NavLink exact to="/performance" activeClassName="headerMenuActiveLink" className="headerMenuLink">
              {pathname === "/performance" ? <AiFillPieChart className="headerMenuIcon" /> : <AiFillPieChart className="headerMenuIcon" />}
              <span className="headerMenuLinkText">Performance</span>
            </NavLink>
          </li>

          <li className="headerMenuItem">
            <NavLink exact to="/postquestion" activeClassName="headerMenuActiveLink" className="headerMenuLink">
              {pathname === "/postquestion" ? <IoIosAddCircle className="headerMenuIcon" /> : <IoIosAddCircle className="headerMenuIcon" />}
              <span className="headerMenuLinkText">Create</span>
            </NavLink>
          </li>
        </div>

        {appState.user ? (
          <NavLink exact to="/profile" className="loginLink">
            <img src={appState.user.userProfilePhoto} alt="profile" className="headerProfileImage" />
          </NavLink>
        ) : (
          <div onClick={() => appDispatch({ type: "showLoginScreen", value: true })} className="login">
            Login
          </div>
        )}
      </div>
      <div className="headerWrapperMobile">
        <FaSearch className="searchIconMobile" />
        <div className="logo">Qnots</div>

        {appState.user ? (
          <NavLink exact to="/profile" className="loginLink">
            <img src={appState.user.userProfilePhoto} alt="profile" className="headerProfileImage" />
          </NavLink>
        ) : (
          <div onClick={() => appDispatch({ type: "showLoginScreen", value: true })} className="login">
            Login
          </div>
        )}
      </div>
      <div className="headerMenuMobile">
        <li className="headerMenuItem">
          <NavLink exact to="/" activeClassName="headerMenuActiveLink" className="headerMenuLink">
            {pathname === "/" ? <AiFillHome className="headerMenuIcon" /> : <AiFillHome className="headerMenuIcon" />}
            <span className="headerMenuLinkText">Home</span>
          </NavLink>
        </li>
        <li className="headerMenuItem">
          <NavLink exact to="/feeds" activeClassName="headerMenuActiveLink" className="headerMenuLink">
            {pathname === "/feeds" ? <SiFeedly className="headerMenuIcon" /> : <SiFeedly className="headerMenuIcon" />}
            <span className="headerMenuLinkText">My Feeds</span>
          </NavLink>
        </li>

        <li className="headerMenuItem">
          <NavLink exact to="/topiclist" activeClassName="headerMenuActiveLink" className="headerMenuLink">
            {pathname === "/topiclist" ? <RiFileListFill className="headerMenuIcon" /> : <RiFileListFill className="headerMenuIcon" />}
            <span className="headerMenuLinkText">Topics</span>
          </NavLink>
        </li>
        <li className="headerMenuItem">
          <NavLink exact to="/contributors" activeClassName="headerMenuActiveLink" className="headerMenuLink">
            {pathname === "/contributors" ? <HiUserGroup className="headerMenuIcon" /> : <HiUserGroup className="headerMenuIcon" />}
            <span className="headerMenuLinkText">Contributors</span>
          </NavLink>
        </li>
        <li className="headerMenuItem">
          <NavLink exact to="/performance" activeClassName="headerMenuActiveLink" className="headerMenuLink">
            {pathname === "/performance" ? <AiFillPieChart className="headerMenuIcon" /> : <AiFillPieChart className="headerMenuIcon" />}
            <span className="headerMenuLinkText">Performance</span>
          </NavLink>
        </li>

        <li className="headerMenuItem">
          <NavLink exact to="/postquestion" activeClassName="headerMenuActiveLink" className="headerMenuLink">
            {pathname === "/postquestion" ? <IoIosAddCircle className="headerMenuIcon" /> : <IoIosAddCircle className="headerMenuIcon" />}
            <span className="headerMenuLinkText">Create</span>
          </NavLink>
        </li>
      </div>
    </div>
  )
}
export default Header
