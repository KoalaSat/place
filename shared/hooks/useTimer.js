import { useEffect, useState, useRef } from 'react';

const useTimer = () => {
    const [timer, setTimer] = useState(60);
    const intervalID = useRef(null);
    useEffect(() => {
        if (intervalID.current === null && timer !== 0) {
            const timerInterval = setInterval(() => {
                setTimer(previousTimer => {
                    if (previousTimer === 0) {
                        intervalID.current = null;
                        clearInterval(timerInterval);
                        return 0;
                    }

                    return previousTimer - 1;
                });
            }, 1000);

            intervalID.current = timerInterval;
        }

        return () => {
            clearInterval(intervalID.current);
            intervalID.current = null;
        };
    }, [timer]);

    return {
        timer,
        setTimer
    };
};

export default useTimer;
