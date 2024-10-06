import { useState, useEffect } from 'react';
import { Analytics } from '@deriv-com/analytics';
import { useRemoteConfig } from '@deriv/api';

const useIsGrowthbookIsLoaded = () => {
    const [isGBLoaded, setIsGBLoaded] = useState(false);
    const { data } = useRemoteConfig(true);

    useEffect(() => {
        let analytics_interval: NodeJS.Timeout;
        if (data?.marketing_growthbook) {
            let checksCounter = 0;
            analytics_interval = setInterval(() => {
                // Check if the analytics instance is available for 10 seconds before setting the feature flag value
                if (checksCounter > 20) {
                    // If the analytics instance is not available after 10 seconds, clear the interval
                    clearInterval(analytics_interval);
                    return;
                }
                checksCounter += 1;
                if (Analytics?.getInstances()?.ab) {
                    setIsGBLoaded(true);
                    clearInterval(analytics_interval);
                }
            }, 500);
        }
        return () => {
            clearInterval(analytics_interval);
        };
    }, [data.marketing_growthbook]);

    return isGBLoaded;
};

export default useIsGrowthbookIsLoaded;
