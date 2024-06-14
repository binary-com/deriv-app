import React from 'react';
import { Tabs, DesktopWrapper, Div100vhContainer, MobileOrTabletWrapper, ThemedScrollbars } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobileOrTablet, validLength, validPassword, getErrorMessages, getCFDPlatformLabel } from '@deriv/shared';
import { useTradingPlatformInvestorPasswordChange, useTradingPlatformPasswordChange } from '@deriv/api';
import { FormikErrors } from 'formik';
import TradingPasswordManager from 'Containers/trading-password-manager';
import InvestorPasswordManager from 'Containers/investor-password-manager';
import { TCFDPasswordManagerTabContent, TFormValues, TPasswordManagerModalFormValues } from 'Containers/props.types';
import { CFD_PLATFORMS, QUERY_STATUS, PASSWORD_TYPE } from 'Helpers/cfd-config';
import { TStatus } from './cfd-password-manager-modal';

export const CFDPasswordManagerTabContent = ({
    toggleModal,
    selected_login,
    email,
    setPasswordType,
    multi_step_ref,
    platform,
    onChangeActiveTabIndex,
    account_group,
}: TCFDPasswordManagerTabContent) => {
    const {
        mutateAsync: changePassword,
        status: change_password_status,
        error: change_password_error,
    } = useTradingPlatformPasswordChange();
    const {
        mutateAsync: changeInvestorPassword,
        status: change_investor_password_status,
        error: change_investor_password_error,
    } = useTradingPlatformInvestorPasswordChange();
    const [active_tab_index, setActiveTabIndex] = React.useState<number>(0);
    const [error_message_investor, setErrorMessageInvestor] = React.useState<string>('');
    const [is_submit_success_investor, setIsSubmitSuccessInvestor] = React.useState<boolean>(false);

    // view height - margin top and bottom of modal - modal title - modal content margin top and bottom - table title
    const container_height = 'calc(100vh - 84px - 5.6rem - 8.8rem - 4rem)';
    const validatePassword = (values: TFormValues) => {
        const errors: FormikErrors<TFormValues> = {};

        if (
            !validLength(values.new_password, {
                min: 8,
                max: 25,
            })
        ) {
            errors.new_password = localize('You should enter {{min_number}}-{{max_number}} characters.', {
                min_number: 8,
                max_number: 25,
            });
        } else if (!validPassword(values.new_password)) {
            errors.new_password = getErrorMessages().password();
        } else if (values.new_password.toLowerCase() === email.toLowerCase()) {
            errors.new_password = localize('Your password cannot be the same as your email address.');
        }

        if (!values.old_password && values.old_password !== undefined) {
            errors.old_password = localize('This field is required');
        }

        return errors;
    };
    const showError = (error_message: string) => {
        setErrorMessageInvestor(error_message);
    };

    const hideError = () => {
        setErrorMessageInvestor('');
        setIsSubmitSuccessInvestor(true);
    };

    const handlePasswordErrorMessages = React.useCallback((status: TStatus, error: Error) => {
        if (status === QUERY_STATUS.ERROR && error) {
            showError((error as unknown as Error)?.message);
        }
        if (status === QUERY_STATUS.SUCCESS) {
            hideError();
        }
    }, []);

    React.useEffect(() => {
        handlePasswordErrorMessages(change_password_status, change_password_error as unknown as Error);
    }, [change_password_error, change_password_status, handlePasswordErrorMessages]);

    React.useEffect(() => {
        handlePasswordErrorMessages(
            change_investor_password_status,
            change_investor_password_error as unknown as Error
        );
    }, [change_investor_password_error, change_investor_password_status, handlePasswordErrorMessages]);

    const onSubmit = React.useCallback(
        async (values: TPasswordManagerModalFormValues) => {
            if (!selected_login) {
                return;
            }

            if (values.password_type === PASSWORD_TYPE.INVESTOR) {
                await changeInvestorPassword({
                    account_id: selected_login,
                    old_password: values.old_password,
                    new_password: values.new_password,
                    platform: CFD_PLATFORMS.MT5,
                });
            } else {
                await changePassword({
                    old_password: values.old_password,
                    new_password: values.new_password,
                    platform: CFD_PLATFORMS.MT5,
                });
            }
        },
        [changeInvestorPassword, changePassword, selected_login]
    );

    const updateAccountTabIndex = (index: number) => {
        setActiveTabIndex(index);
        onChangeActiveTabIndex(index);
        setErrorMessageInvestor('');
        setIsSubmitSuccessInvestor(false);
    };

    const trading_password_manager = (
        <React.Fragment>
            <DesktopWrapper>
                <ThemedScrollbars height={container_height} is_bypassed={isMobileOrTablet()} autohide={false}>
                    <TradingPasswordManager
                        toggleModal={toggleModal}
                        platform={platform}
                        email={email}
                        account_group={account_group}
                    />
                </ThemedScrollbars>
            </DesktopWrapper>
            <MobileOrTabletWrapper>
                <Div100vhContainer className='cfd-password-manager__scroll-wrapper' height_offset='120px'>
                    <TradingPasswordManager
                        toggleModal={toggleModal}
                        platform={platform}
                        email={email}
                        account_group={account_group}
                    />
                </Div100vhContainer>
            </MobileOrTabletWrapper>
        </React.Fragment>
    );

    if (platform === CFD_PLATFORMS.DXTRADE) return trading_password_manager;

    return (
        <Tabs active_index={active_tab_index} onTabItemClick={updateAccountTabIndex} top>
            <div
                label={localize('{{platform}} password', {
                    platform: getCFDPlatformLabel(platform),
                })}
            >
                {trading_password_manager}
            </div>
            <div label={localize('Investor password')}>
                <DesktopWrapper>
                    <ThemedScrollbars height={container_height}>
                        <InvestorPasswordManager
                            is_submit_success_investor={is_submit_success_investor}
                            toggleModal={toggleModal}
                            error_message_investor={error_message_investor}
                            validatePassword={validatePassword}
                            onSubmit={onSubmit}
                            setPasswordType={setPasswordType}
                            multi_step_ref={multi_step_ref}
                        />
                    </ThemedScrollbars>
                </DesktopWrapper>
                <MobileOrTabletWrapper>
                    <Div100vhContainer className='cfd-password-manager__scroll-wrapper' height_offset='120px'>
                        <InvestorPasswordManager
                            is_submit_success_investor={is_submit_success_investor}
                            toggleModal={toggleModal}
                            error_message_investor={error_message_investor}
                            validatePassword={validatePassword}
                            onSubmit={onSubmit}
                            setPasswordType={setPasswordType}
                            multi_step_ref={multi_step_ref}
                        />
                    </Div100vhContainer>
                </MobileOrTabletWrapper>
            </div>
        </Tabs>
    );
};
