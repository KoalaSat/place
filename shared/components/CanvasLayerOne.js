import { useEffect, useRef } from 'react';

const PIXEL_SIZE = 10;

const CanvasLayerOne = ({ setSelectedPixel, canvasLayerTwoRef }) => {
    const canvasRef = useRef();
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const selectPixelIcon = new Image(10, 10);
        selectPixelIcon.src = '/select-icon.png';

        const selectPixelIconWhite = new Image(10, 10);
        selectPixelIconWhite.src = '/select-icon-white.png';
        const handleCanvasClick = event => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            const pixelX = Math.floor(event.offsetX / PIXEL_SIZE) * PIXEL_SIZE;
            const pixelY = Math.floor(event.offsetY / PIXEL_SIZE) * PIXEL_SIZE;

            setSelectedPixel({
                x: pixelX,
                y: pixelY
            });

            const canvasLayerTwoRefContext =
                canvasLayerTwoRef.current.getContext('2d');
            const pixelData = canvasLayerTwoRefContext.getImageData(
                pixelX,
                pixelY,
                1,
                1
            ).data;
            const isPixelBlack =
                pixelData[0] + pixelData[1] + pixelData[2] + pixelData[3] ===
                357;

            if (isPixelBlack) {
                context.drawImage(selectPixelIconWhite, pixelX, pixelY);
            } else {
                context.drawImage(selectPixelIcon, pixelX, pixelY);
            }
        };

        canvas.addEventListener('click', handleCanvasClick);

        return () => {
            canvas.removeEventListener('click', handleCanvasClick);
        };
    }, []);

    return <canvas ref={canvasRef} height="340" width="340"></canvas>;
};

export default CanvasLayerOne;
