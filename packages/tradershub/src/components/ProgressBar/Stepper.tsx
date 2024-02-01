import React from 'react';
import { qtMerge } from '@deriv/quill-design';
import { StandaloneCheckBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { desktopStyle, stepperVariants } from './ProgressBar.classnames';
import StepConnector from './StepConnector';

export type TStep = { isFilled: boolean; title: string };

type TStepperProps = {
    isActive: boolean;
    step: TStep;
    stepCount: number;
};

const Stepper = ({ isActive, step, stepCount }: TStepperProps) => (
    <div aria-current={isActive} className={qtMerge('group relative justify-center', desktopStyle.stepper)}>
        <div className='flex flex-col items-center'>
            {stepCount !== 0 && <StepConnector isActive={isActive} />}
            <span className={stepperVariants({ isActive, isFilled: step.isFilled })}>
                {step.isFilled ? <StandaloneCheckBoldIcon fill={isActive ? '#fff' : '#000'} /> : null}
            </span>
        </div>
        <Text className='relative top-200' size='sm' weight={isActive ? 'bold' : 'normal'}>
            {step.title}
        </Text>
    </div>
);

export default Stepper;
