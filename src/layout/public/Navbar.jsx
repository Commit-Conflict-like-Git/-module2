import { NavLink } from "react-router-dom";
import "../../assets/css/navbar.css";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

function Navbar() {
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoading(true);

      if (user) {
        setIsLoggedIn(true);

        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const role = userSnap.data().role;
            setUserRole(role);
          }
        } catch (error) {
          console.error("Role 가져오기 실패:", error);
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) return null;

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

        {isLoggedIn && userRole === "owner" && (
          <>
            <li>|</li>
            <li>
              <NavLink
                to="/cart"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                장바구니
              </NavLink>
            </li>
          </>
        )}

        <li>|</li>

        <li>
          <NavLink
            to="/notice"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            공지사항
          </NavLink>
        </li>

        {isLoggedIn && (
          <>
            <li>|</li>
            <li>
              <NavLink
                to="/mypage"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                마이페이지
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
