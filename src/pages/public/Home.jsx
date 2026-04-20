import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import paw from '../../assets/img/paw.svg';
import person from '../../assets/img/user-img.svg';
import '../../assets/css/homeTop.css'
import '../../assets/css/homeBody.css'

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className='home-container'>
      <section className='home-status-bar'>
        <div className='status-content'>
          <div className='status-left-group'>
            <img
              src={user && userData ? person : paw}
              alt='status-icon'
              className='status-icon'
            />

            {user && userData ? (
              <div className='user-status'>
                <div className='home-top'>
                  <span className='home-user-name'>{userData.name}</span>
                  <span className='user-role'>
                    ({userData.role === 'owner' ? '보호자' : userData.role === 'trainer' ? '훈련사' : userData.role})
                  </span>
                </div>

                {userData.role === 'owner' && (
                  <div className='dog-info-summary'>
                    반려견 이름|나이|성별
                  </div>
                )}
              </div>
            ) : (
              <div className='nonlogin-message'>
                <span>62마리의 강아지가 오늘도 함께 훈련중입니다 </span>
              </div>
            )}
          </div>

          <div className='status-right-group'>
            {user && userData ? (
              <button className='btn1' onClick={() => navigate('/mypage')}>마이페이지</button>
            ) : (
              <div className='nonlogin-btn-container'>
                <button onClick={() => navigate('/login')} className='btn1'>로그인</button>
                <span onClick={() => navigate('/signup')} className='home-signup'>회원가입</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className='home-section'>
        <div className='home-section-header'>
          <h2 className='home-innertitle'>인기훈련</h2>
          <span className='more-btn'>더보기</span>
        </div>
        <div className='card-grid'>

        </div>
      </section>

      <div className='home-bottom'>
        <section className='home-notice'>
          <div className='home-section-header'>
            <h2 className='home-innertitle'>공지사항</h2>
            <span className='more-btn'>더보기</span>
          </div>
          <ul className='notice-list'>

          </ul>
        </section>

        <section className='home-banner'>
          <div className='banner-nav prev'>&lt;</div>
          <div className='banner-nav next'>&gt;</div>
        </section>
      </div>
    </div>
  );
}

export default Home;
