import { useState } from 'react';

import { useAuth } from '../contexts/authUserContext';
import { getAdditionalUserInfo } from 'firebase/auth';
import {
    getFirestore,
    collection,
    doc,
    addDoc,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';

const Nav = () => {
    const [continueWithGoogleError, setContinueWithGoogleError] = useState('');
    const handleContinueWithGoogle = () => {
        const db = getFirestore();
        return continueWithGoogle()
            .then(result => {
                const isNewUser = getAdditionalUserInfo(result).isNewUser;
                if (!isNewUser) return;

                return addDoc(collection(db, 'pixels'), {
                    pixel: 0,
                    previousPixels: [],
                    createdAt: serverTimestamp(),
                    lastUpdated: serverTimestamp()
                }).then(pixelDocRef => {
                    return setDoc(doc(db, 'users', result.user.uid), {
                        pixel: pixelDocRef.id,
                        createdAt: serverTimestamp()
                    });
                });
            })
            .catch(() => {
                setContinueWithGoogleError(
                    'Unable to get profile information from Google.'
                );
            });
    };

    const { authUser, continueWithGoogle, signOutUser } = useAuth();

    return (
        <nav>
            {authUser ? (
                <button onClick={signOutUser}>sign out</button>
            ) : (
                <button onClick={handleContinueWithGoogle}>
                    continue with google
                </button>
            )}
        </nav>
    );
};

export default Nav;
