import React, { useLayoutEffect, useRef } from 'react';
import ReactModal from 'react-modal';
import { useSignupWizardContext } from '../../context/SignupWizardContext';
import Actions from './Actions';
import { CUSTOM_STYLES } from './helpers';
import './index.scss';

const SignupWizard: React.FC = () => {
    const { isWizardOpen, setIsWizardOpen } = useSignupWizardContext();
    const nodeRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        ReactModal.setAppElement('#v2_modal_root');
    }, []);
    return (
        <ReactModal
            isOpen={isWizardOpen}
            onRequestClose={() => setIsWizardOpen(false)}
            shouldCloseOnOverlayClick
            style={CUSTOM_STYLES}
        >
            <div
                className='bg-background-primary-base h-[71.7rem] w-[104rem] rounded-800 flex overflow-hidden'
                ref={nodeRef}
            >
                <div className='min-w-[25.6rem] bg-[#f2f3f4] p-800'>Timeline</div>
                <div className='flex flex-col p-800 w-[100%] justify-between'>
                    Content
                    <Actions />
                </div>
            </div>
        </ReactModal>
    );
};

export default SignupWizard;
