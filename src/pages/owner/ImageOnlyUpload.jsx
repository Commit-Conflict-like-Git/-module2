import { storage } from "../../firebase/config"; // 본인의 설정 경로 확인
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React, { useState } from "react";

function ImageOnlyUpload() {
  const [images, setImages] = useState([]);

  // 파일을 선택했을 때 실행
  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  // 버튼을 눌렀을 때 이미지만 스토리지에 업로드
  const startUpload = async () => {
    if (images.length === 0) return alert("이미지를 선택해주세요!");

    console.log("--- 업로드 시작 ---");

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      try {
        // 1. 스토리지 참조 만들기 (train_images 폴더 안에 저장)
        // 적용 예시
        const fileName = `${file.name}_${Date.now()}`;
        const storageRef = ref(storage, `trains/${fileName}`);

        // 2. 파일 업로드
        const snapshot = await uploadBytes(storageRef, file);

        // 3. 업로드된 파일의 공개 주소(URL) 가져오기
        const downloadURL = await getDownloadURL(snapshot.ref);

        // 4. 콘솔창에 출력 (이 주소를 복사해서 JSON에 넣으세요!)
        console.log(`파일명: ${file.name}`);
        console.log(`주소: ${downloadURL}`);
        console.log("----------------------------");
      } catch (error) {
        console.error(`${file.name} 업로드 실패:`, error);
      }
    }
    alert("모든 이미지가 업로드되었습니다. F12 콘솔창을 확인하세요!");
  };

  return (
    <div style={{ padding: "20px", border: "2px solid blue", margin: "20px" }}>
      <h2>이미지 스토리지 저장기</h2>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={startUpload}>Storage에 이미지만 올리기</button>
      <p>※ 업로드 후 F12를 눌러 콘솔창에 뜨는 주소를 복사하세요.</p>
    </div>
  );
}

export default ImageOnlyUpload;
