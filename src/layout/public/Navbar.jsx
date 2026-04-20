import { NavLink } from "react-router-dom";
import "../../assets/css/navbar.css";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

function Navbar() {
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoading(true); // 상태 확인 시작
      if (user) {
        setIsLoggedIn(true);
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            // 대소문자 방지를 위해 모두 대문자로 변환하여 저장
            const role = userSnap.data().role?.toUpperCase();
            setUserRole(role);
          }
        } catch (error) {
          console.error("Role 가져오기 실패:", error);
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
      setIsLoading(false); // 확인 완료
    });

    return () => unsubscribe();
  }, []);

  // 로딩 중에는 아무것도 안 보이거나 로딩바를 보여줄 수 있음
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

        {/* OWNER인 경우에만 장바구니 표시 (대문자 비교) */}
        {isLoggedIn && userRole === "OWNER" && (
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

        {/* 로그인만 되어있으면 마이페이지 표시 */}
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
