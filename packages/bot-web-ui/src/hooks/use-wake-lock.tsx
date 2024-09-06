import React from 'react';

type WakeLockSentinel = any;

const log = (message: string, color: string, fontWeight = 'normal') => {
    // eslint-disable-next-line no-console
    console.log(
        `%cSCREEN WAKE: %c${message} ${new Date().toLocaleTimeString()}`,
        `color: ${color}; font-weight: ${fontWeight};`,
        `color: ${color};`
    );
};

const useWakeLock = (is_running: boolean) => {
    const [wake_lock, setWakeLock] = React.useState<WakeLockSentinel | null>(null);

    const requestWakeLock = React.useCallback(async () => {
        try {
            if ('wakeLock' in navigator) {
                const wake_lock_sentinel: WakeLockSentinel = await navigator.wakeLock.request('screen');
                setWakeLock(wake_lock_sentinel);
                log('Activated', 'green', 'bold');
            }
        } catch (error) {
            log('Something went wrong!', 'red', 'bold');
        }
    }, []);

    const releaseWakeLock = React.useCallback(async () => {
        try {
            if (wake_lock !== null) {
                await wake_lock.release();
                setWakeLock(null);
                log('Released', 'green', 'bold');
            }
        } catch (error) {
            log('Something went wrong when releasing!', 'red', 'bold');
        }
    }, [wake_lock]);

    React.useEffect(() => {
        if (is_running && !wake_lock) {
            requestWakeLock();
        } else {
            releaseWakeLock();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_running]);

    return {
        is_wake_lock_active: wake_lock !== null,
    };
};

export default useWakeLock;
