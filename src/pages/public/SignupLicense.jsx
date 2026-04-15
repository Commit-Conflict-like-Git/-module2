import React, { useState } from 'react'
import '../../assets/css/signup.css'
import '../../assets/css/button.css'

function SignupLicense({onNext, formData, onFormData}) {

  const [fileName, setFileName] = useState("파일을 선택하세요.");

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
        onNext();
  }

  return (
    <div className='inner-body'>
      <p> 훈련사 인증을 위한 서류를 첨부해주세요.</p>
      <p> 승인 과정을 2-7일 정도 소요될 예정입니다. </p>
      
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
      <button onClick={handleNext} className='btn1'> 다음 &gt; </button>
    </div>
  )
}

export default SignupLicense
