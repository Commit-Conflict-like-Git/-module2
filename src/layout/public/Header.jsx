import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import "../../assets/css/header.css";

function Header() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); 
  }, []);

  // 로그아웃
  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigate("/");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="/src/assets/img/logo.svg" alt="로고" />
      </div>

      {user && (
        <p className="logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
          로그아웃
        </p>
      )}
    </header>
  );
}

export default Header;
