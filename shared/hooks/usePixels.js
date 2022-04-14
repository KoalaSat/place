import { useEffect, useState } from 'react';

import '../../firebase';
import {
    collection,
    doc,
    getDoc,
    getFirestore,
    onSnapshot
} from 'firebase/firestore';
import { useAuth } from '../contexts/authUserContext';

const usePixels = () => {
    const [pixels, setPixels] = useState([]);
    useEffect(() => {
        const db = getFirestore();
        const unsubscribeFromPixels = onSnapshot(
            collection(db, 'pixels'),
            querySnapshot => {
                const pixelsFromFirestore = [];
                querySnapshot.forEach(doc => {
                    pixelsFromFirestore.push(doc.data());
                });
                setPixels(pixelsFromFirestore);
            }
        );

        return () => {
            unsubscribeFromPixels();
        };
    }, []);

    const { authUser } = useAuth();
    const [pixel, setPixel] = useState(null);
    useEffect(() => {
        let unsubscribeFromPixel;
        if (authUser !== null) {
            const db = getFirestore();
            getDoc(doc(db, 'users', authUser.uid)).then(userDoc => {
                if (!userDoc.exists()) {
                    return;
                }

                unsubscribeFromPixel = onSnapshot(
                    doc(db, 'pixels', userDoc.data().pixel),
                    pixelDoc => {
                        setPixel({ id: pixelDoc.id, ...pixelDoc.data() });
                    }
                );
            });
        }
        return () => {
            if (unsubscribeFromPixel) {
                unsubscribeFromPixel();
            }
        };
    }, [authUser]);

    return {
        pixel,
        pixels
    };
};

export default usePixels;
