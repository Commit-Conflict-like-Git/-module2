import React from 'react'
import { auth } from '../../firebase/config'
import '../../assets/css/home.css'

function Home() {

  const user = auth.currentUser;

  return (
    <div className='home'>
      {user ? (
        <>
          <div>EMAIL: {user.email}</div>
          <div>ID: {user.uid}</div>
        </>
      ) : (
        <div>로그인 정보가 없습니다.</div>
      )}

      <div className='home-div'>62마리의 강아지가 오늘도 함께 훈련중입니다. </div>
      <div className='home-div'>인기훈련</div>
      <div className='home-div'>공지사항</div>
      <div className='home-div'>배너</div>
    </div>
  );
}

export default Home;
