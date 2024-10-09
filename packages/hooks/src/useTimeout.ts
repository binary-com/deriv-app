import { useEffect, useState } from 'react';

/**
 * Custom hook that tracks a countdown based on an initial timeout in seconds.
 *
 * @param {number} initialSeconds - The initial timeout duration in seconds.
 * @returns {{ isTimeout: boolean, timeRemaining: number }}
 *          - isTimeout: Indicates whether the timeout has completed.
 *          - timeRemaining: The remaining time in seconds until the timeout.
 */
const useTimeout = (initialSeconds: number) => {
    const [isTimeout, setIsTimeout] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(initialSeconds);

    useEffect(() => {
        const targetTime = Date.now() + initialSeconds * 1000; // Convert to milliseconds

        const interval = setInterval(() => {
            const currentTime = Date.now();
            const remainingTime = Math.max(0, Math.ceil((targetTime - currentTime) / 1000));

            setTimeRemaining(remainingTime);

            if (remainingTime === 0) {
                setIsTimeout(true);
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [initialSeconds]);

    return { isTimeout, timeRemaining };
};

export default useTimeout;
