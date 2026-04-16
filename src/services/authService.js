import { auth, db, storage } from '../firebase/config.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"

export const signupWithDetail = async (formData) => {
    try {
        // 회원가입
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
        );
        const user = userCredential.user;

        // 추가 정보
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
            uid: user.uid,
            role: formData.role,
            name: formData.name,
            gender: formData.gender,
            birth: formData.birth,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            signDate: new Date().toISOString()
        });

        const subCollectionName = formData.role === 'owner' ? 'owner' : 'trainer';
        const subDocRef = doc(db, "users", user.uid, subCollectionName, "info_details");

        await setDoc(subDocRef, {
            initialized: true,
            description: `${formData.role} 서브 컬렉션. 테스트중`,
            updatedAt: new Date().toISOString()
        })

        console.log('회원가입 성공');
        return user;
    } catch (error) {
        console.error('오류발생: ', error.code, error.message);
        throw error;
    }
}