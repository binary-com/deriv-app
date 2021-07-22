import React from 'react';
import classNames from 'classnames';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { Text, Icon, FormSubmitButton } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { CFD_PLATFORMS, getCFDPlatformLabel } from '@deriv/shared';

const ChangePasswordConfirmation = ({ className, platform, onConfirm, onCancel }) => (
    <Formik initialValues={{}} onSubmit={onConfirm}>
        {({ isSubmitting, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
                <div
                    className={classNames('cfd-change-password-confirmation__wrapper', {
                        [`${className}-wrapper`]: className,
                    })}
                >
                    <div className={classNames('cfd-change-password-confirmation', className)}>
                        <Icon
                            className='cfd-change-password__icon'
                            icon={platform === CFD_PLATFORMS.MT5 ? 'IcMt5OnePassword' : 'IcDxtradeOnePassword'}
                            width='122'
                            height='108'
                        />
                        <Text as='p' align='center' size='s' weight='bold'>
                            <Localize
                                i18n_default_text='Confirm to change your {{platform}} password'
                                values={{
                                    platform: getCFDPlatformLabel(platform),
                                }}
                            />
                        </Text>
                        <Text
                            className='cfd-change-password-confirmation__description'
                            as='p'
                            align='center'
                            color='loss-danger'
                            size='xs'
                        >
                            <Localize
                                i18n_default_text='This will change the password to all of your {{platform}} accounts.'
                                values={{
                                    platform: getCFDPlatformLabel(platform),
                                }}
                            />
                        </Text>
                        <FormSubmitButton
                            is_center={true}
                            label={localize('Confirm')}
                            cancel_label={localize('Cancel')}
                            is_loading={isSubmitting}
                            has_cancel={true}
                            onCancel={onCancel}
                        />
                    </div>
                </div>
            </form>
        )}
    </Formik>
);

ChangePasswordConfirmation.propTypes = {
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    platform: PropTypes.string,
};

export default ChangePasswordConfirmation;
