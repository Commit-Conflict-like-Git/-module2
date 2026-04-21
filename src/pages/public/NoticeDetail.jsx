import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { db } from "../../firebase/config";
import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    orderBy
} from "firebase/firestore";

import "../../assets/css/notice.css";
import "../../assets/css/noticeDetail.css";

function NoticeDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [notice, setNotice] = useState(null);
    const [prevNotice, setPrevNotice] = useState(null);
    const [nextNotice, setNextNotice] = useState(null);

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

    const formatDate = (timestamp) => {
        if (timestamp?.toDate) {
            const date = timestamp.toDate();
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        }
        return "-";
    };

    if (!notice) return <div>로딩중...</div>;

    return (
        <div className="notice-page-wrapper">
            <div className="notice-box">

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
                            onClick={() => navigate("/notice")}
                        >
                            목록으로
                        </button>

                    </div>

                    <div className="notice-nav">

                        {/* 다음글 */}
                        <div
                            className={`nav-item ${!nextNotice ? "disabled" : ""}`}
                            onClick={() => nextNotice && navigate(`/notice/${nextNotice.id}`)}
                        >
                            <span>다음글</span>
                            <p>{nextNotice ? nextNotice.noticeTitle : "-"}</p>
                        </div>

                        {/* 이전글 */}
                        <div
                            className={`nav-item ${!prevNotice ? "disabled" : ""}`}
                            onClick={() => prevNotice && navigate(`/notice/${prevNotice.id}`)}
                        >
                            <span>이전글</span>
                            <p>{prevNotice ? prevNotice.noticeTitle : "-"}</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default NoticeDetail;