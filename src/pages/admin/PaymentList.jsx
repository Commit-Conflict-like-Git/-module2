import React from 'react'
import List from '../../components/admin/List'

function PaymentList() {
    const paymentColumns = [
        { key: "index", label: "No." },
        { key: "name", label: "이름" },
        { key: "phone", label: "금액" },
        { key: "state", label: "결제일" },
        { key: "file", label: "결제상태" },
    ];

    const paymentData = [
        { index: 1, name: "홍길동", phone: "010-1234-5678", email: "test@test.com" },
        { index: 2, name: "김철수", phone: "010-9999-8888", email: "kim@test.com" },
    ];
    return (
        <div>
            <List data={paymentData} columns={paymentColumns} />
        </div>
    )
}

export default PaymentList
