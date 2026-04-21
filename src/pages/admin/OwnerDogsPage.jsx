import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import { db } from '../../firebase/config.js';
import {
    collection,
    getDocs,
    query,
    where
} from "firebase/firestore";

import "../../assets/css/ownerDogsPage.css";

function OwnerDogsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [dogs, setDogs] = useState([]);

    useEffect(() => {
        const fetchDogs = async () => {
            const q = query(
                collection(db, "dogs"),
                where("userId", "==", id)
            );

            const snap = await getDocs(q);

            const result = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setDogs(result);
        };

        fetchDogs();
    }, [id]);

    return (
        <div className="dogs-page">

            <div className="dogs-header">
                <h2>등록된 반려견</h2>

                <button
                    className="btn1"
                    onClick={() => navigate(-1)}
                >
                    이전으로
                </button>
            </div>

            {/* 리스트 */}
            <div className="dogs-list">
                {dogs.map((dog) => (
                    <div key={dog.id} className="admin-dog-card">

                        <div className="dog-left">

                            <img
                                src={dog.photo}
                                alt="dog"
                                className="admin-dog-image"
                            />

                            <div className="admin-dog-info">
                                <h3>{dog.name}</h3>
                                <p>생년월일: {dog.birth}</p>
                                <p>성별: {dog.gender === "male" ? "남아" : "여아"}</p>
                                <p>견종: {dog.breed}</p>
                                <p>몸무게: {dog.weight}kg</p>
                            </div>

                        </div>

                        <div className="admin-dog-note">
                            <h4>특이사항:</h4>
                            <p>{dog.note || "내용 없음"}</p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default OwnerDogsPage;