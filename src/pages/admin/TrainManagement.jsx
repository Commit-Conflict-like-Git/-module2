import React from 'react'
import List from '../../components/admin/List'

function TrainManagement() {
    const ownerColumns = [
        { key: "index", label: "No." },
        { key: "name", label: "이름" },
        { key: "phone", label: "훈련명" },
        { key: "date", label: "등록일" },
    ];

    const ownerData = [
        { index: 1, name: "홍길동", phone: "010-1234-5678", email: "test@test.com" },
        { index: 2, name: "김철수", phone: "010-9999-8888", email: "kim@test.com" },
    ];
    return (
        <div>
            <List data={ownerData} columns={ownerColumns} />
        </div>
    )
}

export default TrainManagement
