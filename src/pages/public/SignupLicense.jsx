import React, { useState } from 'react'
import '../../assets/css/signup.css'
import '../../assets/css/signupPages/license.css'
import '../../assets/css/button.css'

function SignupLicense({onNext, formData, onFormData}) {

  const [fileName, setFileName] = useState("파일을 선택하세요.");

  // 파일 유효성 검사
  const isFileUpload = formData.certificationFile !== null;

  const handleFileChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setFileName(file.name);
        onFormData({ ...formData, certificationFile: file });
      } else {
        setFileName("파일을 선택하세요.");
      }
    };

  const handleNext = () => {
    if (isFileUpload) {
      onNext();
    }
  }

  return (
    <div className='inner-body'>
      <div className="title-group">
        <img src="src/assets/img/paw.svg" alt="소제목" className="paw"/>
        <div className="title">회원가입</div>
      </div>

      <div className='license-content'>
        <p className='file-include'> 훈련사 인증을 위한 서류를 첨부해주세요.</p>
        <p className='authorize'> 승인 과정을 2-7일 정도 소요될 예정입니다. </p>
        <div className='file-upload'>
          <input
            className="upload-name"
            value={fileName}
            readOnly
          />

          <label htmlFor="file-input" className="upload-button">
            파일 업로드
          </label>

          <input
            type="file" id="file-input"
            onChange={handleFileChange} 
            style={{ display: 'none' }}
          />
        </div>
      </div>
      <div className='button-container'>
        <button
          onClick={handleNext}
          className='btn1'
          disabled={!isFileUpload}
          > 다음 &gt; </button>
      </div>
    </div>
  )
}

export default SignupLicense
