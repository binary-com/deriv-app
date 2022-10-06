import React from 'react';
import { localize } from '@deriv/translations';
import { isMobile, isDesktop } from '@deriv/shared';
import { Button, Text, Icon, ProgressBarOnboarding } from '@deriv/components';
import WalletIcon from 'Assets/svgs/wallet';

type TOnboardingProps = {
    contents: Record<
        string,
        {
            component: React.ReactNode;
            footer_header: string;
            footer_text: string;
            next_content?: string;
            has_next_content: boolean;
        }
    >;
    setIsTourOpen: (is_tour_open: boolean) => void;
};

const Onboarding = ({ contents, setIsTourOpen }: TOnboardingProps) => {
    const number_of_steps = Object.keys(contents);

    const [step, setStep] = React.useState<number>(1);

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const nextStep = () => {
        if (step < number_of_steps.length) setStep(step + 1);
        if (step === number_of_steps.length) {
            setIsTourOpen(true);
        }
    };

    const onboarding_step = number_of_steps[step - 1];

    return (
        <div className='onboarding-wrapper'>
            <div className='onboarding-header'>
                <WalletIcon icon={'DerivLogo'} />
                <Icon icon='IcCross' custom_color='var(--general-main-1)' className='onboarding-header__cross-icon' />
            </div>
            <div className='onboarding-body'>
                <Text as='h2' weight='bold' align='center' color='white'>
                    {contents[onboarding_step as keyof typeof contents]?.component}
                </Text>
            </div>
            <div className='onboarding-footer'>
                <div className='onboarding-footer-wrapper'>
                    <Text as='h2' weight='bold' size='sm' align='center' className='onboarding-footer-header'>
                        {contents[onboarding_step as keyof typeof contents]?.footer_header}
                    </Text>
                    <Text as='p' size='xs' align='center' className='onboarding-footer-text'>
                        {contents[onboarding_step as keyof typeof contents]?.footer_text}
                    </Text>
                    {isDesktop() && (
                        <div className='onboarding-footer-buttons'>
                            <Button secondary onClick={prevStep} style={step === 1 ? { visibility: 'hidden' } : {}}>
                                {localize('Back')}
                            </Button>
                            <ProgressBarOnboarding step={step} amount_of_steps={number_of_steps} setStep={setStep} />
                            <Button primary onClick={nextStep} className='onboarding-footer-buttons--full-size'>
                                {contents[onboarding_step as keyof typeof contents]?.has_next_content
                                    ? contents[onboarding_step as keyof typeof contents]?.next_content
                                    : localize('Next')}
                            </Button>
                        </div>
                    )}
                    {isMobile() && (
                        <React.Fragment>
                            <div className='onboarding-footer__progress-bar'>
                                <ProgressBarOnboarding
                                    step={step}
                                    amount_of_steps={number_of_steps}
                                    setStep={setStep}
                                />
                            </div>
                            <div
                                className='onboarding-footer-buttons'
                                style={step === 1 ? { justifyContent: 'start' } : {}}
                            >
                                <Button
                                    secondary
                                    className={step !== 1 ? 'onboarding-footer-buttons--mobile' : ''}
                                    onClick={prevStep}
                                    style={step === 1 ? { display: 'none' } : {}}
                                >
                                    {localize('Back')}
                                </Button>
                                <Button
                                    primary
                                    onClick={nextStep}
                                    className={
                                        step === 1
                                            ? 'onboarding-footer-buttons--full-size'
                                            : 'onboarding-footer-buttons--mobile'
                                    }
                                >
                                    {contents[onboarding_step as keyof typeof contents]?.has_next_content
                                        ? contents[onboarding_step as keyof typeof contents]?.next_content
                                        : localize('Next')}
                                </Button>
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
