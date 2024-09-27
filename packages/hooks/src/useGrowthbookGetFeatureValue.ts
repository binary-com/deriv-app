import { useState, useEffect } from 'react';
import { Analytics } from '@deriv-com/analytics';
import useIsGrowthbookIsLoaded from './useIsGrowthbookLoaded';

type featureValueTypes = Record<string, boolean> | boolean | string | [];

interface UseGrowthbookGetFeatureValueArgs<T> {
    featureFlag: string;
    defaultValue?: T;
}

const useGrowthbookGetFeatureValue = <T>({
    featureFlag,
    defaultValue,
}: UseGrowthbookGetFeatureValueArgs<T>): [T, boolean] => {
    const resolvedDefaultValue: featureValueTypes = (
        defaultValue !== undefined ? defaultValue : false
    ) as featureValueTypes;
    const [featureFlagValue, setFeatureFlagValue] = useState<T>(
        (Analytics?.getFeatureValue(featureFlag, resolvedDefaultValue) ?? resolvedDefaultValue) as T
    );
    const isGBLoaded = useIsGrowthbookIsLoaded();

    useEffect(() => {
        if (isGBLoaded) {
            if (Analytics?.getInstances()?.ab) {
                const setFeatureValue = () => {
                    const value = Analytics?.getFeatureValue(featureFlag, resolvedDefaultValue) as T;
                    setFeatureFlagValue(value);
                };
                setFeatureValue();
                Analytics?.getInstances()?.ab?.GrowthBook?.setRenderer(() => {
                    // this will be called whenever the feature flag value changes and acts as a event listener
                    setFeatureValue();
                });
            }
        }
    }, [isGBLoaded, resolvedDefaultValue, featureFlag]);

    return [featureFlagValue, isGBLoaded];
};

export default useGrowthbookGetFeatureValue;
