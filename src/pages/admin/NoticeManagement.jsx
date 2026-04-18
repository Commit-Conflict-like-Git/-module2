import React from 'react'
import List from '../../components/admin/List'

function NoticeManagement() {
    const noticeColumns = [
        { key: "index", label: "No." },
        { key: "title", label: "제목" },
        { key: "date", label: "작성일" }
    ];

    const noticeData = [
        { index: 1, title: "임시제목", date: "2026-05-21" },
        { index: 2, title: "임시제목", date: "2026-05-21" }
    ];
    return (
        <div>
            <List data={noticeData} columns={noticeColumns} />
        </div>
    )
}

export default NoticeManagement
