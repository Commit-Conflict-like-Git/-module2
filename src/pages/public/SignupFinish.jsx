import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/signup.css'
import '../../assets/css/signupPages/signupFinish.css'
import '../../assets/css/button.css'

function SignupFinish({role}) {

    const navigate = useNavigate();

    const isOwner = role === 'owner';
    const content = {
        hello: isOwner 
        ? "로그인 화면으로 이동합니다."
        : "관리자의 승인을 기다려주세요. ",
        btnText: isOwner ? "로그인" : "확인",
        btnPath: isOwner ? "/login" : "/"
    };

    return (
        <div className='inner-body finish'>
            <div className="title-group">
                <img src="src/assets/img/paw.svg" alt="소제목" className="paw"/>
                <div className="title">회원가입</div>
            </div>
            <div className='finish-content'>
                <p className='welcome'>회원가입이 완료되었습니다. </p>
                <p className='welcome'>{content.hello}</p>

                <button
                    onClick={() => navigate(content.btnPath)}
                    className='btn1'
                >
                    {content.btnText}
                </button>
            </div>
        </div>
    );
}

export default SignupFinish
