import { useEffect, useRef } from 'react';

const PIXEL_SIZE = 10;

const CanvasLayerOne = () => {
    const canvasRef = useRef();
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const handleCanvasClick = event => {
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, canvas.width, canvas.height);

            const selectPixelIcon = new Image(10, 10);
            selectPixelIcon.src = '/select-icon.png';
            selectPixelIcon.onload = () => {
                context.drawImage(
                    selectPixelIcon,
                    Math.floor(event.offsetX / PIXEL_SIZE) * PIXEL_SIZE,
                    Math.floor(event.offsetY / PIXEL_SIZE) * PIXEL_SIZE
                );
            };
        };

        canvas.addEventListener('click', handleCanvasClick);

        return () => {
            canvas.removeEventListener('click', handleCanvasClick);
        };
    }, []);

    return <canvas ref={canvasRef} height="340" width="340"></canvas>;
};

export default CanvasLayerOne;
