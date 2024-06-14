import React from 'react';
import { observer } from 'mobx-react';
import OnboardingTourDesktop from './onboarding-tour-desktop';
import OnboardingTourMobile from './onboarding-tour-mobile';

type TOnboardTourHandler = {
    is_mobile_or_tablet: boolean;
};

const OnboardTourHandler: React.FC<TOnboardTourHandler> = observer(({ is_mobile_or_tablet }) => {
    return <>{is_mobile_or_tablet ? <OnboardingTourMobile /> : <OnboardingTourDesktop />}</>;
});

export default OnboardTourHandler;
