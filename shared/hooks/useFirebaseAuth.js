import { useEffect, useState } from 'react';

import '../../firebase';
import {
    getAuth,
    onAuthStateChanged,
    getAdditionalUserInfo,
    signOut,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    addDoc,
    setDoc,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';

let unsubscribeFromPixel = null;

const useFirebaseAuth = () => {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pixel, setPixel] = useState(null);

    const subscribeToPixel = userUID => {
        const db = getFirestore();
        getDoc(doc(db, 'users', userUID)).then(userDoc => {
            if (!userDoc.exists()) {
                return;
            }

            unsubscribeFromPixel = onSnapshot(
                doc(db, 'pixels', userDoc.data().pixel),
                pixelDoc => {
                    setPixel({
                        id: pixelDoc.id,
                        ...pixelDoc.data()
                    });
                }
            );
        });
    };

    const auth = getAuth();
    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (unsubscribeFromPixel) {
                unsubscribeFromPixel();
                unsubscribeFromPixel = null;
            }

            if (!user) {
                setAuthUser(null);
                setLoading(false);
                return;
            }

            setAuthUser({
                uid: user.uid
            });

            subscribeToPixel(user.uid);

            setLoading(false);
        });
    }, []);

    const continueWithGoogle = () => {
        const provider = new GoogleAuthProvider();

        return signInWithPopup(auth, provider).then(result => {
            const isNewUser = getAdditionalUserInfo(result).isNewUser;
            if (!isNewUser) return;

            const db = getFirestore();
            return addDoc(collection(db, 'pixels'), {
                pixel: 0,
                previousPixels: [],
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            }).then(pixelDocRef => {
                return setDoc(doc(db, 'users', result.user.uid), {
                    pixel: pixelDocRef.id,
                    createdAt: serverTimestamp()
                }).then(() => {
                    subscribeToPixel(result.user.uid);
                });
            });
        });
    };

    const signOutUser = () => {
        if (unsubscribeFromPixel) {
            unsubscribeFromPixel();
            unsubscribeFromPixel = null;
        }

        return signOut(auth).then(() => {
            setAuthUser(null);
        });
    };

    return {
        authUser,
        pixel,
        loading,
        signOutUser,
        continueWithGoogle
    };
};

export default useFirebaseAuth;
