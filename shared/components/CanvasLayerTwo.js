import { useEffect, useRef } from 'react';

const PIXEL_SIZE = 10;

const CanvasLayerTwo = ({ pixels }) => {
    const canvasRef = useRef();
    const placePixel = pixel => {
        const context = canvasRef.current.getContext('2d');
        const pixelX = Math.floor(pixel.x / PIXEL_SIZE) * PIXEL_SIZE;
        const pixelY = Math.floor(pixel.y / PIXEL_SIZE) * PIXEL_SIZE;
        context.fillStyle = pixel.color;
        context.fillRect(pixelX, pixelY, PIXEL_SIZE, PIXEL_SIZE);
    };

    useEffect(() => {
        for (let i = 0; i < pixels.length; i++) {
            const pixel = pixels[i].pixel;

            if (pixel === 0) {
                continue;
            }

            placePixel(pixel);

            for (let j = 0; j < pixels[i].previousPixels.length; j++) {
                const pixel = pixels[i].previousPixels[j];
                if (pixel === 0) {
                    continue;
                }

                placePixel(pixel);
            }
        }
    }, [pixels]);

    return <canvas ref={canvasRef} height="340" width="340"></canvas>;
};

export default CanvasLayerTwo;
