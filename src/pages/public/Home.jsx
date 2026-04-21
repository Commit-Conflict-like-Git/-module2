import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, limit, getDocs, where } from 'firebase/firestore';
import TrainCard from '../owner/TrainCard';
import paw from '../../assets/img/paw.svg';
import person from '../../assets/img/user-img.svg';
import banner1 from '../../assets/img/banner1.png';
import banner2 from '../../assets/img/banner2.png';
import banner3 from '../../assets/img/banner3.png';
import '../../assets/css/homeTop.css'
import '../../assets/css/homeBody.css'
import '../../assets/css/train.css'

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userDog, setUserDog] = useState(null);
  const [hotTraining, setHotTraining] = useState([]);
  const [userNotice, setUserNotice] = useState([]);
  const bannerImages = [banner1, banner2, banner3];
  const [currentIdx, setCurrentIdx] = useState(0);

  const calculateAge = (birthDate) => {
    if (!birthDate) return "";
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  }

  useEffect(() => {
    // 유저 감시 및 반려견 정보 호출
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const uData = userDoc.data();
          setUserData(uData);

          if (uData.role === 'owner') {
            const dogQuery = query(
              collection(db, "dogs"), 
              where("userId", "==", currentUser.uid), 
              limit(1)
            );
            const dogSnapshot = await getDocs(dogQuery);
            if (!dogSnapshot.empty) {
              setUserDog(dogSnapshot.docs[0].data());
            } else {
              setUserDog(null);
            }
          }
        }
      } else {
        setUserData(null);
        setUserDog(null);
      }
    });

    // 인기 훈련 호출
    const fetchTrainings = async () => {
      try {
        const q = query(collection(db, "trainings"), limit(4));
        const querySnapshot = await getDocs(q);
        const trainings = querySnapshot.docs.map(doc => ({
          trainID: doc.id,
          ...doc.data()
        }));
        setHotTraining(trainings);
      } catch (error) {
        console.error("훈련 데이터 불러오는 중 오류:", error);
      }
    };

    // 공지사항 호출
    const fetchNotices = async () => {
      try {
        const q = query(collection(db, "notices"), limit(4));
        const querySnapshot = await getDocs(q);
        const noticeData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserNotice(noticeData);
      } catch (error) {
        console.error("전체 공지사항 불러오기 오류 발생", error);
      }
    };

    fetchTrainings();
    fetchNotices();

    return () => unsubscribe();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/train/${id}`);
  };

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev === 0 ? bannerImages.length -1 : prev -1));
  };
  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev === bannerImages.length -1 ? 0 : prev + 1));
  }, [bannerImages.length]);

  // 배너 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3500); 

    return () => clearInterval(timer);
  }, [currentIdx]);


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
                    {userDog ? (
                      `${userDog.name} | ${calculateAge(userDog.birth)}살 | ${userDog.gender === 'male' ? '남아' : '여아'}`
                    ) : (
                      '등록된 반려견 정보가 없습니다'
                    )}
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
          <span className='more-btn' onClick={() => navigate('/train')}>더보기</span>
        </div>
        <div className='card-grid'>
            {hotTraining.length > 0 ? (
              hotTraining.map((item) => (
                <TrainCard 
                  key={item.trainID} 
                  item={item} 
                  onClick={handleCardClick} 
                />
              ))
            ) : (
              <div className='no-data'>등록된 훈련이 없습니다.</div>
            )}
        </div>
      </section>

      <div className='home-bottom'>
        <section className='home-notice'>
          <div className='home-section-header'>
            <h2 className='home-innertitle'>공지사항</h2>
            <span className='more-btn' onClick={() => navigate('/notice')}>더보기</span>
          </div>
          <ul className='notice-list'>
            {userNotice.length > 0 ? (
              userNotice.map((notice) => (
                <li
                  key={notice.id}
                  className='notice-li'
                  onClick={() => navigate(`/notice/${notice.id}`)}
                >
                  <span className='notice-item'>{notice.noticeTitle}</span>
                </li>
              ))
            ) : (
              <li className='no-data'>등록된 공지사항이 없습니다.</li>
            )}
          </ul>
        </section>

        <section className='home-banner'>
          <div className='banner-nav prev' onClick={prevSlide}>&lt;</div>
          <div className='banner-content'>
            <img
              src={bannerImages[currentIdx]}
              alt={`배너 ${currentIdx + 1}`}
              className='banner-img'
            />
          </div>
          <div className='banner-nav next'onClick={nextSlide}>&gt;</div>
        </section>
      </div>
    </div>
  );
}

export default Home;
