import { auth, db, storage } from '../firebase/config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs, serverTimestamp, getDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const checkEmail = async (email) => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.error("이메일 중복 확인 오류: ", error);
        throw error;
    }
};

export const signupWithDetail = async (formData) => {
    try {
        // 회원가입
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
        );
        const user = userCredential.user;

        // 훈련사 자격증
        let certificationData = { fileName: null, fileUrl: null };

        if (formData.role === 'trainer' && formData.certificationFile) {
            const file = formData.certificationFile;
            const storageRef = ref(storage, `trainers/${user.uid}/certificationFile`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            certificationData = {
                fileName: file.name,
                fileUrl: downloadURL
            };
        }

        // 추가 정보
        const userData = {
            uid: user.uid,
            role: formData.role,
            name: formData.name,
            gender: formData.gender,
            birth: formData.birth,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            accountStatus: 'active',
            createdAt: serverTimestamp()
        };

        if (formData.role === 'trainer') {
            userData.approvalStatus = 'pending';
        }

        await setDoc(doc(db, "users", user.uid), userData);

        const subCollectionName = formData.role === 'owner' ? 'owner' : 'trainer';
        const subDocRef = doc(db, "users", user.uid, subCollectionName, "info_details");

        const detailData = {
            initialized: true,
            updatedAt: serverTimestamp()
        };

        if (formData.role === 'trainer') {
            detailData.certificationFileName = certificationData.fileName;
            detailData.certificationFileUrl = certificationData.fileUrl;
        }

        await setDoc(subDocRef, detailData);
        await signOut(auth);

        console.log('회원가입 성공 및 세션 종료');
        return user;
    } catch (error) {
        console.error('오류발생: ', error.code, error.message);
        throw error;
    }
}

export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
            const userData = userDoc.data();

            if (userData.accountStatus === 'inactive') {
                await signOut(auth);
                throw {code: 'auth/user-disabled-custom'};
            }

            if (userData.role === 'trainer' && userData.approvalStatus === 'pending') {
                await signOut(auth);
                throw { code : 'auth/not-approved'};
            }
            return userData;
        }
    } catch (error) {
        console.error('로그인 오류: ', error.code, error.message);
        throw error;
    }
}