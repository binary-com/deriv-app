import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import Icon from '../icon';

const MultiStep = React.forwardRef(({ className, lbl_previous, steps }, ref) => {
    const [step, setStep] = React.useState(0);
    const [component, setComponent] = React.useState(steps[0].component);

    React.useEffect(() => {
        setComponent(steps[step].component);
    }, [step, steps]);

    React.useImperativeHandle(ref, () => ({
        goNextStep,
        goPrevStep,
    }));

    const goNextStep = () => setStep(step + 1);
    const goPrevStep = () => setStep(step - 1);

    const prev_btn = (
        <div className='multi-step__header'>
            <a onClick={goPrevStep} className='multi-step__btn'>
                <Icon icon='IcArrowLeftBold' className='multi-step__btn-icon' />
                {lbl_previous}
            </a>
        </div>
    );

    return (
        <div className={classNames('multi-step', className)}>
            {step !== 0 && lbl_previous && prev_btn}
            <div className='multi-step__component'>{component}</div>
        </div>
    );
});

MultiStep.displayName = 'MultiStep';

MultiStep.propTypes = {
    className: PropTypes.string,
    lbl_previous: PropTypes.string,
    steps: PropTypes.array,
};

export default MultiStep;
