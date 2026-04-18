import React from 'react'
import List from '../../components/admin/List'

function TrainerManagement() {
    const trainerColumns = [
        { key: "index", label: "No." },
        { key: "name", label: "이름" },
        { key: "phone", label: "전화번호" },
        { key: "date", label: "가입일" },
        { key: "state", label: "상태" },
    ];

    const trainerData = [
        { index: 1, name: "홍길동", phone: "010-1234-5678", email: "test@test.com" },
        { index: 2, name: "김철수", phone: "010-9999-8888", email: "kim@test.com" },
    ];
    return (
        <div>
            <List data={trainerData} columns={trainerColumns} />
        </div>
    )
}

export default TrainerManagement
