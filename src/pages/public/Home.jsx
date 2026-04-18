import React from 'react'
import { auth } from '../../firebase/config'

function Home() {

  const user = auth.currentUser;

  return (
    <div>
      <div>home</div>
      {user ? (
        <>
          <div>EMAIL: {user.email}</div>
          <div>ID: {user.uid}</div>
        </>
      ) : (
        <div>로그인 정보가 없습니다.</div>
      )}
    </div>
  );
}

export default Home;
