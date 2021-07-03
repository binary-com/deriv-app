import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Wizard from 'Components/wizard';
import Button from 'Components/button';
import { FlexWrapper, ButtonWrapper, Text } from '../button/shared-style';
import Theme from '../shared/theme';

const stories = storiesOf('Data Entry|Form Wizard/Wizard', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

const Controller = ({
    getCurrentStep,
    getTotalSteps,
    goToFirstStep,
    goToStep,
    goToLastStep,
    goToNextStep,
    goToPreviousStep,
}) => (
    <React.Fragment>
        <ButtonWrapper>
            {getCurrentStep() > 1 && (
                <Button has_effect secondary small onClick={() => goToPreviousStep()}>
                    Go Back
                </Button>
            )}
            <Button has_effect primary small onClick={() => goToNextStep()}>
                {getCurrentStep() < getTotalSteps() ? 'Continue' : 'Finish'}
            </Button>
        </ButtonWrapper>
        <hr />
        <div>
            <Text size='1.4rem'>Other Functions</Text>
            <Text size='1.2rem'>Current Step: {getCurrentStep()}</Text>
            <Text size='1.2rem'>Total Steps: {getTotalSteps()}</Text>
            <div>
                <Button has_effect secondary small onClick={() => goToFirstStep()}>
                    First Step
                </Button>
                <Button has_effect secondary small onClick={() => goToLastStep()}>
                    Last Step
                </Button>
                {getCurrentStep() !== 2 && (
                    <Button has_effect secondary small onClick={() => goToStep(2)}>
                        Go to Step 2
                    </Button>
                )}
            </div>
        </div>
    </React.Fragment>
);

const StepOne = props => {
    return (
        <div>
            <Text size='1.6rem'>Customized Contents {props.getCurrentStep()}</Text>
            <Controller {...props} />
        </div>
    );
};

const StepTwo = props => {
    return (
        <div>
            <Text size='1.6rem'>Customized Contents {props.getCurrentStep()}</Text>
            <Controller {...props} />
        </div>
    );
};

const StepThree = props => {
    return (
        <div>
            <Text size='1.6rem'>Customized Contents {props.getCurrentStep()}</Text>
            <Controller {...props} />
        </div>
    );
};

stories.add('Basic Usage', () => {
    return (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <Wizard>
                    <StepOne />
                    <StepTwo />
                    <StepThree />
                </Wizard>
            </FlexWrapper>
        </Theme>
    );
});
