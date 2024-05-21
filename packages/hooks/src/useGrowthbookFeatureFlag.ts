import { useState, useEffect } from 'react';
import { Analytics } from '@deriv-com/analytics';
import { useRemoteConfig } from '@deriv/api';

interface UseGrowthbookFeatureFlagArgs {
    featureFlag: string;
    defaultValue?: boolean;
}

const useGrowthbookFeatureFlag = ({ featureFlag, defaultValue = false }: UseGrowthbookFeatureFlagArgs) => {
    const [featureFlagValue, setFeatureFlagValue] = useState(
        Analytics?.getFeatureValue(featureFlag, defaultValue) ?? false
    );
    const [isGBLoaded, setIsGBLoaded] = useState(false);
    const { data } = useRemoteConfig();

    useEffect(() => {
        let analytics_interval: NodeJS.Timeout;
        if (data?.marketing_growthbook) {
            let timeout = 0;
            analytics_interval = setInterval(() => {
                // Check if the analytics instance is available for 10 seconds before setting the feature flag value
                if (timeout > 20) {
                    // If the analytics instance is not available after 10 seconds, clear the interval
                    clearInterval(analytics_interval);
                    return;
                }
                timeout += 1;
                if (Analytics?.getInstances()?.ab) {
                    setIsGBLoaded(true);
                    const setFeatureValue = () => {
                        const value = Analytics?.getFeatureValue(featureFlag, defaultValue);
                        setFeatureFlagValue(value);
                    };
                    setFeatureValue();
                    Analytics?.getInstances()?.ab?.GrowthBook?.setRenderer(() => {
                        // this will be called whenever the feature flag value changes and acts as a event listener
                        setFeatureValue();
                    });
                    clearInterval(analytics_interval);
                }
            }, 500);
        }
        return () => {
            clearInterval(analytics_interval);
        };
    }, []);

    return [featureFlagValue, isGBLoaded];
};

export default useGrowthbookFeatureFlag;
