import React, { Fragment, useState } from 'react';
import ReactModal from 'react-modal';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Text, useDevice } from '@deriv-com/ui';
import { DesktopProgressBar, MobileProgressBar } from '../../../components/ProgressBar';
import { TSteps } from '../../../components/ProgressBar/Stepper';
import { CUSTOM_STYLES } from '../../../helpers/signupModalHelpers';
import { useSignupWizardContext } from '../../../providers/SignupWizardProvider';
import ExitConfirmationDialog from '../ExitConfirmationDialog';
import WizardScreens from './WizardScreens';
import './index.scss';

const FORM_PROGRESS_STEPS: TSteps = ['Account currency', 'Personal details', 'Address', 'Terms of use'];

/**
 * @name SignupWizard
 * @description The SignupWizard component is used to render the signup wizard modal.
 * @example
 * return (
 *  <SignupWizard />
 * );
 */
const SignupWizard = () => {
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const { currentStep, isWizardOpen } = useSignupWizardContext();
    const { isDesktop } = useDevice();

    return (
        <Fragment>
            <ReactModal
                ariaHideApp={false}
                isOpen={isWizardOpen}
                onRequestClose={() => setIsConfirmationDialogOpen(true)}
                shouldCloseOnOverlayClick={false}
                style={CUSTOM_STYLES}
            >
                <div className='bg-background-primary-base md:max-h-[717px] md:max-w-[1040px] h-screen w-screen md:rounded-16 flex overflow-hidden'>
                    {isDesktop && (
                        <div className='min-w-[256px] bg-system-light-secondary-background p-24'>
                            <Text as='p' className='pt-32 pb-24 font-bold' size='sm'>
                                Add a Deriv Account
                            </Text>
                            <DesktopProgressBar activeStep={currentStep} steps={FORM_PROGRESS_STEPS} />
                            <StandaloneXmarkBoldIcon
                                className='absolute cursor-pointer right-24 top-24'
                                onClick={() => setIsConfirmationDialogOpen(true)}
                            />
                        </div>
                    )}
                    <div className='flex flex-col justify-between w-full'>
                        {!isDesktop && (
                            <MobileProgressBar
                                activeStep={currentStep}
                                onClickClose={() => setIsConfirmationDialogOpen(true)}
                                steps={FORM_PROGRESS_STEPS}
                            />
                        )}
                        <WizardScreens />
                    </div>
                </div>
            </ReactModal>
            <ExitConfirmationDialog
                isOpen={isConfirmationDialogOpen}
                onClose={() => setIsConfirmationDialogOpen(false)}
            />
        </Fragment>
    );
};

export default SignupWizard;
