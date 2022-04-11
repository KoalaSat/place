import { useEffect, useState } from 'react';
import Head from 'next/head';

import CanvasLayerOne from '../shared/components/CanvasLayerOne';
import CanvasLayerTwo from '../shared/components/CanvasLayerTwo';

import useTimer from '../shared/hooks/useTimer';

export default function Home() {
    const [selectedPixel, setSelectedPixel] = useState(null);

    const [pixels, setPixels] = useState([]);
    const { timer, setTimer, timerIntervalFunction } = useTimer();
    const handlePlacePixel = () => {
        if (!selectedPixel) return;

        const clonePixels = JSON.parse(JSON.stringify(pixels));
        setPixels([...clonePixels, selectedPixel]);
        setSelectedPixel(null);
        setTimer(60);
        const timerInterval = setInterval(() => {
            timerIntervalFunction(timerInterval);
        }, 1000);
    };

    return (
        <div>
            <Head>
                <title>place</title>
                <meta name="description" content="place" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div>
                <div>{timer}</div>
                <div className="canvas-container">
                    <CanvasLayerTwo pixels={pixels} />
                    <CanvasLayerOne setSelectedPixel={setSelectedPixel} />
                </div>

                <button disabled={timer !== 0} onClick={handlePlacePixel}>
                    place
                </button>
            </div>
        </div>
    );
}
