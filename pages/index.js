import { useState } from 'react';
import Head from 'next/head';

import Nav from '../shared/components/Nav';
import CanvasLayerOne from '../shared/components/CanvasLayerOne';
import CanvasLayerTwo from '../shared/components/CanvasLayerTwo';

import useTimer from '../shared/hooks/useTimer';

const COLORS = [
    '#222222',
    '#E4E4E4',
    '#888888',
    '#E50000',
    '#E59500',
    '#A06A42',
    '#E5D900',
    '#02BE01',
    '#94E044',
    '#00D3DD',
    '#820080',
    '#0083C7',
    '#FFFFFF',
    '#FFA7D1',
    '#0000EA',
    '#CF6EE4'
];

export default function Home() {
    const [selectedPixel, setSelectedPixel] = useState(null);
    const [selectedPixelColor, setSelectedPixelColor] = useState(COLORS[0]);

    const [pixels, setPixels] = useState([]);
    const { timer, setTimer, timerIntervalFunction } = useTimer();
    const handlePlacePixel = event => {
        event.preventDefault();

        if (!selectedPixel) return;

        const clonePixels = JSON.parse(JSON.stringify(pixels));
        setPixels([
            ...clonePixels,
            { ...selectedPixel, color: selectedPixelColor }
        ]);
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
                <Nav />

                <div>{timer}</div>
                <div className="canvas-container">
                    <CanvasLayerTwo pixels={pixels} />
                    <CanvasLayerOne setSelectedPixel={setSelectedPixel} />
                </div>

                <form onSubmit={handlePlacePixel}>
                    {COLORS.map(color => {
                        return (
                            <div key={color}>
                                <input
                                    onClick={() => setSelectedPixelColor(color)}
                                    className="d-none"
                                    type="radio"
                                    name="pixel-color"
                                    id={color}
                                />
                                <label
                                    style={{ backgroundColor: color }}
                                    className="color-square"
                                    htmlFor={color}
                                ></label>
                            </div>
                        );
                    })}

                    <button disabled={timer !== 0}>place</button>
                </form>
            </div>
        </div>
    );
}
