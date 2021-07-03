import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import notes from './README.md';
import Wrapper from '../shared/wrapper';
import FormProgress from 'Components/form-progress';
import Button from 'Components/button';

storiesOf('Data Entry|Form Wizard/FormProgress', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const steps = [
                { header: { active_title: 'This is the first step', title: 'step 1' } },
                { header: { active_title: 'This is the second step', title: 'step 2' } },
                { header: { active_title: 'This is the third step', title: 'step 3' } },
                { header: { active_title: 'This is the fourth step', title: 'step 4' } },
            ];

            const [currentStep, setCurrentStep] = React.useState(0);
            const increment = () => setCurrentStep((currentStep + 1) % steps.length);
            const decrement = () => setCurrentStep(currentStep - 1 < 0 ? 3 : currentStep - 1);

            return (
                <Wrapper inner_styles={{}} is_dark={boolean('Dark Theme', false)}>
                    <div style={{ height: '100px', width: '100%' }}>
                        <FormProgress steps={steps} current_step={currentStep} />

                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Button onClick={decrement} text={'Prev Step'} primary medium />
                            <Button onClick={increment} text={'Next Step'} primary medium />
                        </div>
                    </div>
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
