import React from 'react';
import { Button } from '@deriv/components';
import { Localize } from 'Components/i18next';

type TAdFormControllerProps = {
    getCurrentStep: () => number;
    getTotalSteps: () => number;
    goToFirstStep: () => void;
    goToStep: () => void;
    goToLastStep: () => void;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    is_next_btn_disabled: boolean;
    onCancel: () => void;
};

const AdFormController = ({
    getCurrentStep,
    getTotalSteps,
    goToFirstStep,
    goToStep,
    goToLastStep,
    goToNextStep,
    goToPreviousStep,
    is_next_btn_disabled,
    onCancel,
}: TAdFormControllerProps) => {
    return (
        <div className='ad-form-controller'>
            {getCurrentStep() === 1 && (
                <Button secondary large type='button' onClick={onCancel}>
                    <Localize i18n_default_text='Cancel' />
                </Button>
            )}
            {getCurrentStep() > 1 && (
                <Button
                    secondary
                    large
                    type='button'
                    onClick={() => {
                        goToPreviousStep();
                    }}
                >
                    <Localize i18n_default_text='Previous' />
                </Button>
            )}

            {getCurrentStep() < getTotalSteps() ? (
                <Button
                    primary
                    large
                    is_disabled={is_next_btn_disabled}
                    onClick={() => {
                        goToNextStep();
                    }}
                >
                    <Localize i18n_default_text='Next' />
                </Button>
            ) : (
                <Button primary large>
                    <Localize i18n_default_text='Post ad' />
                </Button>
            )}
        </div>
    );
};

export default AdFormController;
