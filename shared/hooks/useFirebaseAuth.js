import { useEffect, useState } from 'react';

import '../../firebase';
import {
    getAuth,
    onAuthStateChanged,
    signOut,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';

const useFirebaseAuth = () => {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const auth = getAuth();
    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (!user) {
                setAuthUser(null);
                setLoading(false);
                return;
            }

            setAuthUser({
                uid: user.uid
            });

            setLoading(false);
        });
    }, []);

    const continueWithGoogle = () => {
        const provider = new GoogleAuthProvider();

        return signInWithPopup(auth, provider);
    };

    const signOutUser = () => {
        return signOut(auth).then(() => {
            setAuthUser(null);
        });
    };

    return {
        authUser,
        loading,
        signOutUser,
        continueWithGoogle
    };
};

export default useFirebaseAuth;
