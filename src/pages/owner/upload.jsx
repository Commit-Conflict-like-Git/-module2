import { useEffect } from "react";
import { db } from "../../firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

const trainData = [
  {
    uid: "trainer_uid_001",
    role: "TRAINER",
    trainTitle: "도심 속 사회성 길들이기 기초",
    trainDescription:
      "도시 환경에서 다양한 자극(차량 소음, 사람, 자전거 등)에 과민하게 반응하는 반려견을 위한 사회성 기초 훈련 프로그램입니다.\n\n 센터 인근 실제 산책 환경에서 진행되며, 강아지가 일상적인 외부 자극에 자연스럽게 적응하도록 단계적으로 훈련합니다.\n\n [교육 내용]\n • 횡단보도 대기 및 신호 인지 훈련\n • 카페 및 공공장소 매너 교육\n • 차량 및 오토바이 소음 둔감화 훈련\n • 낯선 사람 및 반려견과의 적절한 거리 유지 훈련\n\n [보호자 교육]\n • 반려견 바디랭귀지 해석 방법\n • 흥분 상태에서의 올바른 대응법\n • 산책 시 안정적인 리드 방법\n\n 본 프로그램은 반복적인 실전 훈련을 통해 반려견이 도심 환경에서도 안정적이고 차분한 행동을 유지하도록 만드는 것을 목표로 합니다.",
    trainImg:
      "https://firebasestorage.googleapis.com/v0/b/todays-training.firebasestorage.app/o/trains%2FdogWalkCity.jpg_1776329791524?alt=media&token=a976395a-1c3a-4528-8311-be0026e00ce8",
    day: "토요일",
    date: "2026-05-02",
    ampm: "오전",
    trainTime: "10:30",
    trainerName: "박건우",
    trainPlace: "오늘의 훈련센터 내 훈련장 및 외부",
    price: 120000,
  },

  {
    uid: "trainer_uid_002",
    role: "TRAINER",
    trainTitle: "완벽한 배변 훈련의 정석",
    trainDescription:
      "반복적인 배변 실수로 어려움을 겪는 보호자를 위한 체계적인 배변 교정 프로그램입니다.\n\n강아지의 배변 패턴과 생활 환경을 분석하여, 스스로 올바른 장소에서 배변하도록 유도하는 행동 교정 중심의 교육을 진행합니다.\n\n[교육 내용]\n • 배변 패턴 분석 및 문제 원인 진단\n • 배변 공간 설정 및 환경 최적화\n • 성공 시 정확한 보상 타이밍 훈련\n • 실수 발생 시 올바른 대응 방법 교육\n\n [보호자 교육]\n • 배변 루틴 형성 및 유지 방법\n • 환경 변화 시 대처 전략\n\n 강아지의 본능과 습관 형성 원리를 활용하여 자연스럽고 안정적인 배변 습관을 만드는 것이 목표입니다.",
    trainImg:
      "https://firebasestorage.googleapis.com/v0/b/todays-training.firebasestorage.app/o/trains%2FpottyTtraining.png_1776329785591?alt=media&token=98a8492d-048c-4c5c-9080-f3bd53e8bef0",
    day: "일요일",
    date: "2026-05-03",
    ampm: "오후",
    trainTime: "02:00",
    trainerName: "김혜윤",
    trainPlace: "오늘의 훈련 센터 내 리트리버 교실",
    price: 95000,
  },

  {
    uid: "trainer_uid_003",
    role: "TRAINER",
    trainTitle: "줄 당김 없는 평화로운 산책 매너",
    trainDescription:
      "산책 시 줄을 강하게 당기거나 보호자를 끌고 가는 행동을 교정하는 산책 전문 훈련 프로그램입니다.\n\n 주변 산책 코스를 활용하여 실제 환경에서 훈련이 진행되며, 보호자와 보조를 맞추는 안정적인 보행을 목표로 합니다.\n\n[교육 내용]\n • 하네스 및 목줄 올바른 사용법\n • '힐(Heel)' 보행 훈련\n • 외부 자극(사람, 차량, 다른 개)에 대한 반응 조절\n • 보호자와의 아이컨택 강화 훈련\n\n [보호자 교육]\n • 산책 중 문제 행동 교정 방법\n • 일관된 훈련 유지 전략\n\n 훈련을 통해 반려견과 보호자가 함께 편안하게 산책할 수 있는 환경을 만드는 것이 목표입니다.",
    trainImg:
      "https://firebasestorage.googleapis.com/v0/b/todays-training.firebasestorage.app/o/trains%2FdogWalkTrain.png_1776329780126?alt=media&token=c7eff807-b0d8-4066-bbee-9aa233d44fcd",
    day: "월요일",
    date: "2026-05-04",
    ampm: "오후",
    trainTime: "04:30",
    trainerName: "강민호",
    trainPlace: "오늘의 훈련센터 내부 훈련장 및 외부",
    price: 110000,
  },

  {
    uid: "trainer_uid_004",
    role: "TRAINER",
    trainTitle: "분리불안 완화 및 독립심 강화",
    trainDescription:
      "보호자와 떨어질 때 불안, 짖음, 하울링 등의 문제 행동을 보이는 반려견을 위한 전문 교정 프로그램입니다.\n\n 반려견이 혼자 있는 시간을 안정적으로 받아들일 수 있도록 단계별로 훈련을 진행합니다.\n\n [교육 내용]\n • 외출 신호 둔감화 훈련\n • 혼자 있는 시간 점진적 증가 훈련\n • 노즈워크 및 장난감 활용 안정화\n • 켄넬 및 공간 적응 훈련\n\n [보호자 교육]\n • 외출 전 행동 패턴 교정\n • 귀가 시 올바른 반응 방법\n\n 건강한 애착 관계를 형성하고 반려견의 독립성을 키우는 것이 목표입니다.",
    trainImg:
      "https://firebasestorage.googleapis.com/v0/b/todays-training.firebasestorage.app/o/trains%2Fdog.jpg_1776331117624?alt=media&token=ad6f9849-bf15-4983-ba88-b84d0b796386",
    day: "수요일",
    date: "2026-05-06",
    ampm: "오전",
    trainTime: "11:00",
    trainerName: "한지후",
    trainPlace: "오늘의 훈련 훈련장",
    price: 150000,
  },

  {
    uid: "trainer_uid_005",
    role: "TRAINER",
    trainTitle: "기본 복종 및 예절 교육 (기초반)",
    trainDescription:
      "반려견과의 기본적인 의사소통을 위한 필수 명령어를 학습하는 기초 훈련 프로그램입니다.\n\n 긍정 강화 방식으로 반려견이 즐겁게 학습하도록 유도합니다.\n\n [교육 내용]\n • 앉아, 기다려, 엎드려 명령어 훈련\n • 이리와(Recall) 훈련\n • 기본 매너 행동 교육\n\n [보호자 교육]\n • 명령 전달 방법\n • 일상에서 적용하는 방법\n\n 보호자와 반려견 간의 신뢰 관계를 형성하는 것이 목표입니다.",
    trainImg:
      "https://firebasestorage.googleapis.com/v0/b/todays-training.firebasestorage.app/o/trains%2FBasicClass.jpg_1776329846029?alt=media&token=a33d4b0a-774d-4bbd-86f7-0567830e2ee4",
    day: "금요일",
    date: "2026-05-08",
    ampm: "오후",
    trainTime: "01:00",
    trainerName: "채수빈",
    trainPlace: "오늘의 훈련 기초 교실",
    price: 80000,
  },

  {
    uid: "trainer_uid_006",
    role: "TRAINER",
    trainTitle: "공격성 및 짖음 교정 프로젝트",
    trainDescription:
      "다른 사람이나 반려견에게 공격적인 반응을 보이거나 과도하게 짖는 행동을 교정하는 고급 훈련 프로그램입니다.\n\n 문제 행동의 원인을 분석하여 맞춤형 교정 훈련을 진행합니다.\n\n [교육 내용]\n • 공격성 원인 분석 (공포, 방어 등)\n • 역조건 형성 훈련\n • 행동 수정 및 통제 훈련\n\n[보호자 교육]\n • 위험 상황 대처 방법\n • 행동 관리 전략\n\n안전하고 안정적인 행동 패턴 형성을 목표로 합니다.",
    trainImg:
      "https://firebasestorage.googleapis.com/v0/b/todays-training.firebasestorage.app/o/trains%2FangryDog.jpg_1776329841327?alt=media&token=b55f25f4-2999-4179-9c87-cef16252a8fa",
    day: "일요일",
    date: "2026-05-10",
    ampm: "오후",
    trainTime: "03:00",
    trainerName: "표지호",
    trainPlace: "오늘의 훈련센터 대형견 교실",
    price: 250000,
  },

  {
    uid: "trainer_uid_002",
    role: "TRAINER",
    trainTitle: "퍼피 클래스: 생애 첫 교육",
    trainDescription:
      "생후 초기 강아지를 위한 사회화 및 기초 교육 프로그램입니다.\n\n올바른 성장 방향을 잡아 문제 행동을 예방하는 데 목적이 있습니다.\n\n[교육 내용]\ • 사회화 훈련\n •- 입질(무는 행동) 교정\n •- 신체 접촉 적응 훈련\n\n[보호자 교육]\n •- 올바른 양육 방법\n •- 문제 행동 예방 전략\n\n건강한 성장을 위한 기초를 만드는 것이 목표입니다.",
    trainImg:
      "https://firebasestorage.googleapis.com/v0/b/todays-training.firebasestorage.app/o/trains%2FDogWalk.jpg_1776329851161?alt=media&token=627ee853-f376-440a-b91c-ce7bfc8634a3",
    day: "화요일",
    date: "2026-05-12",
    ampm: "오후",
    trainTime: "05:00",
    trainerName: "김혜윤",
    trainPlace: "오늘의 훈련센터 시브로 교실",
    price: 100000,
  },

  {
    uid: "trainer_uid_007",
    role: "TRAINER",
    trainTitle: "에너지 발산을 위한 어질리티 입문",
    trainDescription:
      "에너지가 많은 반려견을 위한 스포츠 기반 훈련 프로그램입니다.\n\n다양한 장애물을 활용하여 신체 활동과 집중력을 동시에 향상시킵니다.\n\n[교육 내용]\n • 터널 통과 훈련\n • 허들 점프\n • 슬라럼 코스 훈련\n\n[보호자 교육]\n • 안전한 운동 방법\n • 놀이를 통한 훈련 방법\n\n스트레스 해소와 자신감 향상을 목표로 합니다.",
    trainImg:
      "https://firebasestorage.googleapis.com/v0/b/todays-training.firebasestorage.app/o/trains%2FAgilityDog.jpg_1776329837861?alt=media&token=c934aeef-9877-4a57-9995-a4d25000cd24",
    day: "목요일",
    date: "2026-05-14",
    ampm: "오후",
    trainTime: "07:00",
    trainerName: "최상엽",
    trainPlace: "오늘의 훈련센터 루시 교실",
    price: 180000,
  },
];

function UploadPage() {
  useEffect(() => {
    const resetAndUpload = async () => {
      try {
        // 1. 기존 데이터 삭제
        console.log("🧹 1. 기존 데이터 삭제 시작...");
        const querySnapshot = await getDocs(collection(db, "trainings"));

        const deletePromises = querySnapshot.docs.map((document) =>
          deleteDoc(doc(db, "trainings", document.id)),
        );
        await Promise.all(deletePromises);
        console.log("✅ 기존 데이터 삭제 완료!");

        // 2. 새 데이터 업로드 (자동 ID 생성)
        console.log("🚀 2. 새 데이터 업로드 시작...");
        for (let i = 0; i < trainData.length; i++) {
          const item = trainData[i];

          // ✨ 핵심: addDoc을 사용하면 Firebase가 ID를 자동으로 생성합니다.
          await addDoc(collection(db, "trainings"), item);

          console.log(`${i + 1}번 데이터 업로드 중...`);
        }

        console.log("✨ 모든 작업이 성공적으로 완료되었습니다!");
        alert("데이터 삭제 및 자동 ID로 재업로드 완료!");
      } catch (error) {
        console.error("❌ 작업 중 오류 발생:", error);
      }
    };

    resetAndUpload();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>데이터 초기화 및 자동 ID 업로드 중...</h2>
      <p>콘솔창(F12)을 확인하세요.</p>
    </div>
  );
}

export default UploadPage;
