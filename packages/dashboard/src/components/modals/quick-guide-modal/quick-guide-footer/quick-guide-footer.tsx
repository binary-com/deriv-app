import React from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { TStepProps } from '../types';

const QuickGuideFooter: React.FC<TStepProps> = ({
    closeModal,
    getCurrentStep,
    getTotalSteps,
    goToNextStep,
    goToPreviousStep,
}) => {
    const handleSubmit = () => {
        if (getCurrentStep() < getTotalSteps()) {
            goToNextStep();
        } else {
            closeModal();
        }
    };

    return (
        <div className='dw-quick-guide-footer'>
            <Button large secondary onClick={getCurrentStep() > 1 ? goToPreviousStep : closeModal}>
                {getCurrentStep() > 1 ? localize('Back') : localize('Close')}
            </Button>
            <Button className='dw-quick-guide-footer__submit-btn' large primary onClick={handleSubmit}>
                {getCurrentStep() < getTotalSteps() ? localize('Next') : localize('Ok, got it')}
            </Button>
        </div>
    );
};

export default QuickGuideFooter;
