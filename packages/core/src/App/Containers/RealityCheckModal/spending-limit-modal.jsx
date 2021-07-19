import PropTypes from 'prop-types';
import React from 'react';
import { Formik } from 'formik';
import {
    AutoHeightWrapper,
    Div100vhContainer,
    Modal,
    FormSubmitButton,
    Text,
    RadioGroup,
    ThemedScrollbars,
} from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

const SpendingLimitModal = ({ disableApp, currency, enableApp, InputField, is_visible, onSubmit, validateForm }) => (
    <Modal
        className='reality-check'
        enableApp={enableApp}
        is_open={is_visible}
        disableApp={disableApp}
        has_close_icon={false}
        title={localize('Spending limit')}
        portalId='modal_root_absolute'
        width='588px'
    >
        <Formik
            initialValues={{
                spending_limit: '0',
                max_30day_turnover: '',
            }}
            validate={validateForm}
            onSubmit={onSubmit}
        >
            {({ handleSubmit, errors, isSubmitting, isValid, values, touched, handleChange, handleBlur }) => (
                <AutoHeightWrapper default_height={350} height_offset={isDesktop() ? 80 : null}>
                    {({ setRef }) => (
                        <form ref={setRef} onSubmit={handleSubmit}>
                            <Div100vhContainer
                                is_bypassed={!isDesktop()}
                                className='reality-check__wrapper'
                                height_offset='204px'
                                is_disabled={isDesktop()}
                            >
                                <ThemedScrollbars height={500} className='reality-check__scrollbar'>
                                    <div className='reality-check__section'>
                                        <Text
                                            as='p'
                                            size={isDesktop() ? 'xs' : 'xxs'}
                                            line_height='m'
                                            className='reality-check__text reality-check__text--description'
                                        >
                                            <Localize i18n_default_text='You can limit the total amount you spend in 30 days, trading on DTrader, DBot, and SmartTrader. This limit will get renewed automatically every 30 days. If you wish to remove the limit or increase your spending amount, please contact our Client Support team via live chat on our website.' />
                                        </Text>
                                        <div style={{ display: 'flex', marginBottom: isDesktop() ? 25 : 4 }}>
                                            <RadioGroup
                                                name='spending_limit'
                                                className='radio-group--spending_limit'
                                                selected={values.spending_limit}
                                                onToggle={e => {
                                                    e.persist();
                                                    handleChange({
                                                        target: {
                                                            name: 'spending_limit',
                                                            value: e.target.value,
                                                        },
                                                    });
                                                }}
                                            >
                                                {[
                                                    {
                                                        id: '1',
                                                        label: localize('Set a 30-day spending limit'),
                                                        value: '1',
                                                    },
                                                    { id: '0', label: localize('No spending limit'), value: '0' },
                                                ].map(item => (
                                                    <RadioGroup.Item
                                                        key={item.value}
                                                        label={item.label}
                                                        value={item.value}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        </div>
                                        <InputField
                                            values={values}
                                            touched={touched}
                                            errors={errors}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            disabled={values.spending_limit === '0'}
                                            currency={currency}
                                        />
                                        <Text
                                            as='p'
                                            size='xs'
                                            line_height='m'
                                            className='reality-check__text reality-check__text--description'
                                        >
                                            <Localize i18n_default_text='If you decide to set a spending limit later, you can always do so by going to “Self-exclusion” in your account settings.' />
                                        </Text>
                                    </div>
                                </ThemedScrollbars>
                            </Div100vhContainer>
                            <Modal.Footer has_separator>
                                <FormSubmitButton
                                    className='reality-check__submit'
                                    is_disabled={
                                        (values.spending_limit === '1' && !values.max_30day_turnover) ||
                                        !isValid ||
                                        isSubmitting
                                    }
                                    label={localize('Continue trading')}
                                />
                            </Modal.Footer>
                        </form>
                    )}
                </AutoHeightWrapper>
            )}
        </Formik>
    </Modal>
);

SpendingLimitModal.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_visible: PropTypes.bool,
    onSubmit: PropTypes.func,
    openStatement: PropTypes.func,
    validateForm: PropTypes.func,
};

export default SpendingLimitModal;
