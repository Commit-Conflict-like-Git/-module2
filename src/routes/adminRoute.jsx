import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase/config";

function adminRoute({ children }) {

    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {

            if (!user) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            const ref = doc(db, "users", user.uid);
            const snap = await getDoc(ref);

            if (snap.exists() && snap.data().role === "admin") {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default adminRoute;