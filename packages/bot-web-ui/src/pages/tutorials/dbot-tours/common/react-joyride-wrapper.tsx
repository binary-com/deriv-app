import React from 'react';
import ReactJoyride, { CallBackProps, Step, Styles } from 'react-joyride';
import { localize } from '@deriv/translations';

const common_tour_button_properties = {
    fontWeight: '700',
    fontSize: '1.4rem',
    height: '4rem',
    padding: '1rem 1.6rem',
};

interface IReactJoyrideWrapperProps {
    steps: Step[];
    styles: Styles;
    handleCallback: (data: CallBackProps) => void;
}

const ReactJoyrideWrapper: React.FC<IReactJoyrideWrapperProps> = ({ steps, styles, handleCallback, ...props }) => {
    return (
        <ReactJoyride
            steps={steps}
            continuous
            callback={handleCallback}
            locale={{ back: localize('Previous'), next: localize('Next') }}
            {...props}
            styles={{
                options: {
                    arrowColor: 'var(--general-main-2)',
                    backgroundColor: 'var(--general-main-2)',
                    primaryColor: 'var(--brand-red-coral)',
                    textColor: 'var(--text-general)',
                    spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
                    width: 440,
                },
                buttonBack: {
                    border: '0.2rem solid var(--text-less-prominent)',
                    marginInlineEnd: '1rem',
                    borderRadius: '0.4rem',
                    color: 'var(--text-general)',
                    ...common_tour_button_properties,
                },
                buttonNext: {
                    ...common_tour_button_properties,
                },
                buttonClose: {
                    insetInlineEnd: '0px',
                    right: 'unset',
                },
                overlay: {
                    height: '100%',
                },
                ...styles,
            }}
        />
    );
};

export default ReactJoyrideWrapper;
