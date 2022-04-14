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
        const context = canvasRef.current.getContext('2d');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, 340, 340);
    }, []);

    useEffect(() => {
        const allPixels = [];
        for (let i = 0; i < pixels.length; i++) {
            const pixel = pixels[i].pixel;

            if (pixel === 0) {
                continue;
            }

            allPixels.push({ ...pixel, createdAt: pixels[i].lastUpdated });
            allPixels.push(...pixels[i].previousPixels);
        }

        allPixels = allPixels.filter(pixel => pixel !== 0);
        allPixels.sort((a, b) => {
            if (a.createdAt === null || b.createdAt === null) {
                return -1;
            }

            return a.createdAt.seconds - b.createdAt.seconds;
        });

        for (let i = 0; i < allPixels.length; i++) {
            placePixel(allPixels[i]);
        }
    }, [pixels]);

    return <canvas ref={canvasRef} height="340" width="340"></canvas>;
};

export default CanvasLayerTwo;
