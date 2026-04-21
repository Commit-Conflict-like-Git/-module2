import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../../assets/css/noticeForm.css";

import ModalOneBtn from '../../components/public/modalOneBtn';
import ModalTwoBtn from '../../components/public/modalTwoBtn';

import { db, auth } from "../../firebase/config";
import {
    collection,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";

function NoticeUpload() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultText, setResultText] = useState("");

    const isEditMode = Boolean(id);

    useEffect(() => {
        if (!id) return;

        const fetchNotice = async () => {
            const ref = doc(db, "notices", id);
            const snap = await getDoc(ref);

            if (snap.exists()) {
                const data = snap.data();
                setTitle(data.noticeTitle);
                setContent(data.noticeContent);
            }
        };

        fetchNotice();
    }, [id]);

    const handleOpenConfirm = () => {
        if (!title.trim()) {
            setResultText("제목을 입력해주세요.");
            setShowResultModal(true);
            return;
        }

        if (!content.trim()) {
            setResultText("내용을 입력해주세요.");
            setShowResultModal(true);
            return;
        }

        setShowConfirmModal(true);
    };

    const handleSubmit = async () => {
        const user = auth.currentUser;

        if (!user) {
            setResultText("로그인 상태를 확인해주세요.");
            setShowResultModal(true);
            return;
        }

        try {
            setLoading(true);

            if (isEditMode) {
                await updateDoc(doc(db, "notices", id), {
                    noticeTitle: title,
                    noticeContent: content,
                    updateDate: serverTimestamp(),
                });
                setResultText("수정되었습니다.");
            } else {
                await addDoc(collection(db, "notices"), {
                    noticeTitle: title,
                    noticeContent: content,
                    uid: user.uid,
                    uploadDate: serverTimestamp(),
                    updateDate: null,
                });
                setResultText("등록되었습니다.");
            }

            setShowConfirmModal(false);
            setShowResultModal(true);

        } catch (error) {
            console.error(error);
            setResultText("처리 중 오류가 발생했습니다.");
            setShowConfirmModal(false);
            setShowResultModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="notice-container">

            <h2 className="notice-title">
                {isEditMode ? "공지사항 수정" : "공지사항 등록"}
            </h2>

            <div className="notice-form">

                <div className="form-group">
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        maxLength={100}
                    />
                </div>

                <div className="form-group">
                    <label>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                        maxLength={2000}
                    />
                </div>

                <div className="btn-area">
                    <button
                        className="btn1"
                        onClick={handleOpenConfirm}
                        disabled={loading}
                    >
                        {isEditMode ? "수정하기" : "등록하기"}
                    </button>

                    <button
                        className="btn1"
                        onClick={() => navigate(-1)}
                    >
                        취소
                    </button>
                </div>

            </div>

            <ModalTwoBtn
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleSubmit}
                modalText={isEditMode ? "수정하시겠습니까?" : "등록하시겠습니까?"}
            />

            <ModalOneBtn
                isOpen={showResultModal}
                onClose={() => {
                    setShowResultModal(false);

                    if (resultText.includes("되었습니다")) {
                        navigate("/admin");
                    }
                }}
                modalText={resultText}
            />

        </div>
    );
}

export default NoticeUpload;