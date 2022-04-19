import { useEffect, useState } from 'react';
import Head from 'next/head';

import Nav from '../shared/components/Nav';
import CanvasInformation from '../shared/components/CanvasInformation';
import CanvasLayerOne from '../shared/components/CanvasLayerOne';
import CanvasLayerTwo from '../shared/components/CanvasLayerTwo';

import useTimer from '../shared/hooks/useTimer';
import { useAuth } from '../shared/contexts/authUserContext';
import { usePixelsContext } from '../shared/contexts/pixelsContext';

import {
    arrayUnion,
    doc,
    getFirestore,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';

const COLORS = [
    '#222222',
    '#888888',
    '#E4E4E4',
    '#FFFFFF',
    '#E50000',
    '#A06A42',
    '#E59500',
    '#E5D900',
    '#02BE01',
    '#94E044',
    '#0000EA',
    '#0083C7',
    '#00D3DD',
    '#820080',
    '#CF6EE4',
    '#FFA7D1'
];

export default function Home() {
    const [selectedPixel, setSelectedPixel] = useState(null);
    const [selectedPixelColor, setSelectedPixelColor] = useState(COLORS[0]);
    const [isAttemptingToPlacePixel, setIsAttemptingToPlacePixel] =
        useState(false);

    const { pixels } = usePixelsContext();
    const { timer, setTimer } = useTimer();
    const handlePlacePixel = event => {
        event.preventDefault();

        if (!selectedPixel) return;
        setIsAttemptingToPlacePixel(true);
        const db = getFirestore();
        if (pixel.pixel === 0) {
            updateDoc(doc(db, 'pixels', pixel.id), {
                pixel: { ...selectedPixel, color: selectedPixelColor },
                previousPixels: arrayUnion(0),
                lastUpdated: serverTimestamp()
            }).then(() => {
                setIsAttemptingToPlacePixel(false);
            });
        } else {
            updateDoc(doc(db, 'pixels', pixel.id), {
                pixel: { ...selectedPixel, color: selectedPixelColor },
                previousPixels: arrayUnion({
                    ...pixel.pixel,
                    createdAt: pixel.lastUpdated
                }),
                lastUpdated: serverTimestamp()
            }).then(() => {
                setIsAttemptingToPlacePixel(false);
            });
        }

        setSelectedPixel(null);
    };

    const { authUser, pixel } = useAuth();
    useEffect(() => {
        if (pixel !== null && pixel.lastUpdated) {
            const amountOfTimeSinceLastPlace =
                new Date().getTime() / 1000 - pixel.lastUpdated.seconds;

            if (amountOfTimeSinceLastPlace >= 60) {
                setTimer(0);
            } else {
                setTimer(60 - Math.floor(amountOfTimeSinceLastPlace));
            }
        }
    }, [pixel]);

    return (
        <div>
            <Head>
                <title>place</title>
                <meta name="description" content="place" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="container">
                <Nav />

                <div className="app-container">
                    <CanvasInformation authUser={authUser} timer={timer} />

                    <div className="canvas-container">
                        <CanvasLayerTwo pixels={pixels} />
                        <CanvasLayerOne setSelectedPixel={setSelectedPixel} />
                    </div>

                    <form onSubmit={handlePlacePixel}>
                        <div className="colors-container mb-2">
                            {COLORS.map(color => {
                                return (
                                    <div key={color}>
                                        <input
                                            onClick={() =>
                                                setSelectedPixelColor(color)
                                            }
                                            className="d-none"
                                            type="radio"
                                            name="pixel-color"
                                            id={color}
                                            defaultChecked={
                                                color === selectedPixelColor
                                            }
                                        />
                                        <label
                                            style={{ backgroundColor: color }}
                                            className="color-square"
                                            htmlFor={color}
                                        ></label>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            className="place-button"
                            disabled={
                                isAttemptingToPlacePixel ||
                                timer !== 0 ||
                                authUser === null
                            }
                        >
                            place
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
