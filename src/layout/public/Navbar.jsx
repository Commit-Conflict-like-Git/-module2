import { NavLink } from "react-router-dom";
import "../../assets/css/navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            홈
          </NavLink>
        </li>
        <li>|</li>
        <li>
          <NavLink
            to="/train"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            훈련
          </NavLink>
        </li>
        <li>|</li>
        <li>
          <NavLink
            to="/cart"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            장바구니
          </NavLink>
        </li>
        <li>|</li>
        <li>
          <NavLink
            to="/notice"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            공지사항
          </NavLink>
        </li>
        <li>|</li>
        <li>
          <NavLink
            to="/mypage"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            마이페이지
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
