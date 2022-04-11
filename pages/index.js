import { useState } from 'react';
import Head from 'next/head';

import CanvasLayerOne from '../shared/components/CanvasLayerOne';
import CanvasLayerTwo from '../shared/components/CanvasLayerTwo';

export default function Home() {
    const [selectedPixel, setSelectedPixel] = useState(null);

    const [pixels, setPixels] = useState([]);
    const handlePlacePixel = () => {
        if (!selectedPixel) return;

        const clonePixels = JSON.parse(JSON.stringify(pixels));
        setPixels([...clonePixels, selectedPixel]);
        setSelectedPixel(null);
    };

    return (
        <div>
            <Head>
                <title>place</title>
                <meta name="description" content="place" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div>
                <div className="canvas-container">
                    <CanvasLayerTwo pixels={pixels} />
                    <CanvasLayerOne setSelectedPixel={setSelectedPixel} />
                </div>

                <button onClick={handlePlacePixel}>place</button>
            </div>
        </div>
    );
}
