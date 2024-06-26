import { TTradingAssessmentForm } from 'Types';
import TradingAssessmentForm from './trading-assessment-form';
import { useDevice } from '@deriv-com/ui';

type TradingAssessmentNewUserProps = {
    disabled_items: string[];
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    onSave: (current_step: number, values: TTradingAssessmentForm) => void;
    onCancel: (current_step: number, goToPreviousStep: () => void) => void;
    onSubmit: (
        current_step?: number,
        values?: TTradingAssessmentForm,
        goToNextStep?: () => void,
        action?: () => void,
        should_override?: boolean
    ) => void;
    getCurrentStep: () => number;
    value: TTradingAssessmentForm;
    setSubSectionIndex: (index: number) => void;
};

const TradingAssessmentNewUser = ({
    disabled_items,
    goToNextStep,
    goToPreviousStep,
    onSave,
    onCancel,
    onSubmit,
    getCurrentStep,
    value,
    setSubSectionIndex,
}: TradingAssessmentNewUserProps) => {
    const { isDesktop } = useDevice();
    const handleCancel = (values: TTradingAssessmentForm) => {
        const current_step = getCurrentStep() - 1;
        onSave(current_step, values);
        onCancel(current_step, goToPreviousStep);
    };

    const handleSubmit = (values?: TTradingAssessmentForm, should_override?: boolean) => {
        let process_form_values = { ...values };
        if (should_override) {
            // Remove the keys with no values
            process_form_values = Object.entries(process_form_values).reduce((accumulator, [key, val]) => {
                if (val) {
                    return { ...accumulator, [key]: val };
                }
                return { ...accumulator };
            }, {});
        }
        onSubmit(
            getCurrentStep() - 1,
            process_form_values as TTradingAssessmentForm,
            undefined,
            goToNextStep,
            should_override
        );
    };

    return (
        <TradingAssessmentForm
            form_value={value}
            getCurrentStep={getCurrentStep}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onSave={onSave}
            setSubSectionIndex={setSubSectionIndex}
            disabled_items={disabled_items}
            should_move_to_next={false}
            is_independent_section={false}
            is_responsive={!isDesktop}
        />
    );
};

export default TradingAssessmentNewUser;
