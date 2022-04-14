import { useEffect, useState } from 'react';

import '../../firebase';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';

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

    return {
        pixels
    };
};

export default usePixels;
