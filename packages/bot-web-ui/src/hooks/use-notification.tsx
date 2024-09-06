import React from 'react';

type NotificationOptions = {
    body?: string;
    icon?: string;
    onClick?: () => void;
};

const useNotification = () => {
    const [permission, setPermission] = React.useState(Notification.permission);

    const requestPermission = React.useCallback(async () => {
        if (permission === 'default') {
            const result = await Notification.requestPermission();
            setPermission(result);
        }
    }, [permission]);

    const showNotification = React.useCallback(
        (title: string, options?: NotificationOptions) => {
            if (permission === 'granted') {
                const notification = new Notification(title, options);
                if (options?.onClick) {
                    notification.onclick = options.onClick;
                }
            } else if (permission === 'default') {
                requestPermission().then(() => {
                    if (Notification.permission === 'granted') {
                        const notification = new Notification(title, options);

                        if (options?.onClick) {
                            notification.onclick = options.onClick;
                        }
                    }
                });
            }
        },
        [permission, requestPermission]
    );

    return {
        permission,
        requestPermission,
        showNotification,
    };
};

export default useNotification;
