import { useEffect, useRef } from 'react';

const PIXEL_SIZE = 10;

const CanvasLayerOne = ({ setSelectedPixel }) => {
    const canvasRef = useRef();
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const selectPixelIcon = new Image(10, 10);
        selectPixelIcon.src = '/select-icon.png';
        const handleCanvasClick = event => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            const pixelX = Math.floor(event.offsetX / PIXEL_SIZE) * PIXEL_SIZE;
            const pixelY = Math.floor(event.offsetY / PIXEL_SIZE) * PIXEL_SIZE;

            setSelectedPixel({
                x: pixelX,
                y: pixelY
            });

            context.drawImage(selectPixelIcon, pixelX, pixelY);
        };

        canvas.addEventListener('click', handleCanvasClick);

        return () => {
            canvas.removeEventListener('click', handleCanvasClick);
        };
    }, []);

    return <canvas ref={canvasRef} height="340" width="340"></canvas>;
};

export default CanvasLayerOne;
