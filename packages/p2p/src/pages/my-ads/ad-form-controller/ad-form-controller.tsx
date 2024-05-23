import React from 'react';
import { Button } from '@deriv/components';
import { Localize } from 'Components/i18next';

type TAdFormControllerProps = {
    action?: string;
    getCurrentStep: () => number;
    getTotalSteps: () => number;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    is_next_btn_disabled: boolean;
    is_save_btn_disabled: boolean;
    onCancel?: () => void;
};

const AdFormController = ({
    action,
    getCurrentStep,
    getTotalSteps,
    goToNextStep,
    goToPreviousStep,
    is_next_btn_disabled,
    is_save_btn_disabled,
    onCancel,
}: TAdFormControllerProps) => {
    const post_btn_text =
        action === 'edit' ? <Localize i18n_default_text='Save changes' /> : <Localize i18n_default_text='Post ad' />;

    return (
        <div className='ad-form-controller'>
            {getCurrentStep() === 1 && onCancel && (
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
                <Button disabled={is_save_btn_disabled} primary large>
                    {post_btn_text}
                </Button>
            )}
        </div>
    );
};

export default AdFormController;
