import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { db, auth } from "../../firebase/config";
import {
    doc,
    getDoc,
    deleteDoc,
    collection,
    getDocs,
    query,
    orderBy
} from "firebase/firestore";

import "../../assets/css/adminNoticeDetail.css";

import ModalOneBtn from '../../components/public/modalOneBtn';
import ModalTwoBtn from '../../components/public/modalTwoBtn';

function NoticeDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [notice, setNotice] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const [prevNotice, setPrevNotice] = useState(null);
    const [nextNotice, setNextNotice] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultText, setResultText] = useState("");

    useEffect(() => {
        const fetchNotice = async () => {
            const ref = doc(db, "notices", id);
            const snap = await getDoc(ref);

            if (snap.exists()) {
                setNotice(snap.data());
            }
        };

        fetchNotice();
    }, [id]);

    useEffect(() => {
        const fetchList = async () => {
            const q = query(
                collection(db, "notices"),
                orderBy("uploadDate", "desc")
            );

            const snapshot = await getDocs(q);

            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const currentIndex = list.findIndex(item => item.id === id);

            if (currentIndex > 0) {
                setNextNotice(list[currentIndex - 1]);
            } else {
                setNextNotice(null);
            }

            if (currentIndex < list.length - 1) {
                setPrevNotice(list[currentIndex + 1]);
            } else {
                setPrevNotice(null);
            }
        };

        fetchList();
    }, [id]);

    useEffect(() => {
        const checkAdmin = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);

            if (snap.exists() && snap.data().role === "admin") {
                setIsAdmin(true);
            }
        };

        checkAdmin();
    }, []);

    const formatDate = (timestamp) => {
        if (timestamp?.toDate) {
            const date = timestamp.toDate();
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        }
        return "-";
    };

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "notices", id));
            setShowDeleteModal(false);
            setResultText("삭제되었습니다.");
            setShowResultModal(true);
        } catch (error) {
            console.error(error);
            setResultText("삭제 실패");
            setShowResultModal(true);
        }
    };

    if (!notice) return <div>로딩중...</div>;

    return (
        <div className="notice-detail-container">

            <div className="notice-header">
                <div className="notice-title">
                    {notice.noticeTitle}
                </div>
                <div className="notice-date">
                    {formatDate(notice.uploadDate)}
                </div>
            </div>

            <div className="notice-content">
                {notice.noticeContent}
            </div>

            <div className="notice-btn-area">

                <button
                    className="btn1"
                    onClick={() => navigate("/")}
                >
                    목록으로
                </button>

                {isAdmin && (
                    <div className="admin-btns">
                        <button
                            className="btn1"
                            onClick={() => navigate(`/notice/edit/${id}`)}
                        >
                            수정하기
                        </button>

                        <button
                            className="btn1"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            삭제하기
                        </button>
                    </div>
                )}
            </div>

            <div className="notice-nav">

                {/* 다음글 */}
                <div
                    className={`nav-item ${!nextNotice ? "disabled" : ""}`}
                    onClick={() => {
                        if (nextNotice) {
                            navigate(`/notice/${nextNotice.id}`);
                        }
                    }}
                >
                    <span>다음글</span>
                    <p>{nextNotice ? nextNotice.noticeTitle : "-"}</p>
                </div>

                {/* 이전글 */}
                <div
                    className={`nav-item ${!prevNotice ? "disabled" : ""}`}
                    onClick={() => {
                        if (prevNotice) {
                            navigate(`/notice/${prevNotice.id}`);
                        }
                    }}
                >
                    <span>이전글</span>
                    <p>{prevNotice ? prevNotice.noticeTitle : "-"}</p>
                </div>

            </div>

            <ModalTwoBtn
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                modalText="삭제하시겠습니까?"
            />

            <ModalOneBtn
                isOpen={showResultModal}
                onClose={() => {
                    setShowResultModal(false);
                    if (resultText.includes("삭제")) {
                        navigate("/");
                    }
                }}
                modalText={resultText}
            />

        </div>
    );
}

export default NoticeDetail;