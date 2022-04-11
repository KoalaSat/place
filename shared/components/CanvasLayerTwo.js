import { useEffect, useRef } from 'react';

const PIXEL_SIZE = 10;

const CanvasLayerTwo = ({ pixels }) => {
    const canvasRef = useRef();
    useEffect(() => {
        const context = canvasRef.current.getContext('2d');
        for (let i = 0; i < pixels.length; i++) {
            const pixel = pixels[i];
            const pixelX = Math.floor(pixel.x / PIXEL_SIZE) * PIXEL_SIZE;
            const pixelY = Math.floor(pixel.y / PIXEL_SIZE) * PIXEL_SIZE;
            context.fillStyle = pixel.color;
            context.fillRect(pixelX, pixelY, PIXEL_SIZE, PIXEL_SIZE);
        }
    }, [pixels]);

    return <canvas ref={canvasRef} height="340" width="340"></canvas>;
};

export default CanvasLayerTwo;
