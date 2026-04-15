import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/signup.css'
import '../../assets/css/button.css'

function SignupFinish({role}) {

    const navigate = useNavigate();

    const isOwner = role === 'owner';
    const content = {
        hello: isOwner 
        ? "로그인 화면으로 이동합니다."
        : "관리자의 승인을 기다려주세요. ",
        btnText: isOwner ? "로그인" : "확인",
        btnPath: isOwner ? "/Login" : "/"
    };

    return (
        <div className='inner-body'>
            <p>회원가입이 완료되었습니다. </p>
            <p>{content.hello}</p>

            <button onClick={() => navigate(content.btnPath)}>
                {content.btnText}
            </button>
        </div>
    );
}

export default SignupFinish
