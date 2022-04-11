import { useEffect, useState } from 'react';

const useTimer = () => {
    const [timer, setTimer] = useState(60);
    const timerIntervalFunction = timerInterval => {
        setTimer(previousTimer => {
            if (previousTimer === 0) {
                clearInterval(timerInterval);
                return 0;
            }

            return previousTimer - 1;
        });
    };

    useEffect(() => {
        const timerInterval = setInterval(() => {
            timerIntervalFunction(timerInterval);
        }, 1000);

        return () => {
            clearInterval(timerInterval);
        };
    }, []);

    return {
        timer,
        setTimer,
        timerIntervalFunction
    };
};

export default useTimer;
