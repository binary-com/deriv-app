import React from 'react';
import {
    Icon,
    Modal,
    Tabs,
    Button,
    Div100vhContainer,
    MultiStep,
    PageOverlay,
    ThemedScrollbars,
    UILoader,
    Text,
} from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { localize, Localize } from '@deriv/translations';
import { getCFDPlatformLabel, getErrorMessages, validMT5Password } from '@deriv/shared';
import { FormikErrors } from 'formik';
import CFDStore from '../Stores/Modules/CFD/cfd-store';
import TradingPasswordManager from './trading-password-manager';
import InvestorPasswordManager from './investor-password-manager';
import {
    TCountdownComponent,
    TCFDPasswordReset,
    TCFDPasswordManagerTabContentWrapper,
    TCFDPasswordManagerTabContent,
    TCFDPasswordManagerModal,
    TFormValues,
    TPasswordManagerModalFormValues,
} from './props.types';
import { observer, useStore } from '@deriv/stores';
import { useCfdStore } from '../Stores/Modules/CFD/Helpers/useCfdStores';
import { CFD_PLATFORMS } from '../Helpers/cfd-config';
import { validatePassword } from '../Helpers/constants';

const CountdownComponent = ({ count_from = 60, onTimeout }: TCountdownComponent) => {
    const [count, setCount] = React.useState<number>(count_from);

    React.useEffect(() => {
        let interval: ReturnType<typeof setTimeout>;

        if (count !== 0) {
            interval = setTimeout(() => {
                setCount(count - 1);
            }, 1000);
        } else {
            onTimeout();
        }

        return () => {
            clearTimeout(interval);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count]);
    return <span className='countdown'>{count}</span>;
};

const CFDPasswordReset = ({
    sendVerifyEmail,
    account_type,
    account_group,
    server,
    password_type,
}: TCFDPasswordReset) => {
    const [is_resend_verification_requested, setResendVerification] = React.useState<boolean>(false);
    const [is_resend_verification_sent, setResendVerificationSent] = React.useState<boolean>(false);

    React.useEffect(() => {
        localStorage.setItem('cfd_reset_password_intent', [server, account_group, account_type].join('.'));
        localStorage.setItem('cfd_reset_password_type', password_type);
        sendVerifyEmail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickVerification = () => {
        setResendVerification(true);
    };

    const resendVerification = () => {
        sendVerifyEmail();
        setResendVerificationSent(true);
    };

    return (
        <div className='cfd-verification-email-sent'>
            <Icon icon='IcEmailSent' size={128} />
            <h2 className='cfd-verification-email-sent__title'>
                <Localize i18n_default_text="We've sent you an email" />
            </h2>
            <Text as='p' size='xs' align='center'>
                <Localize i18n_default_text='Please click on the link in the email to reset your password.' />
            </Text>
            {!is_resend_verification_requested && (
                <Button className='cfd-verification-email-sent__resend-button' primary onClick={onClickVerification}>
                    <Localize i18n_default_text="Didn't receive the email?" />
                </Button>
            )}
            {is_resend_verification_requested && (
                <>
                    <Text
                        as='p'
                        size='xs'
                        align='center'
                        weight='bold'
                        className='cfd-verification-email-sent__title--sub'
                    >
                        <Localize i18n_default_text={"Didn't receive the email?"} />
                    </Text>
                    <Text as='p' size='xs' align='center'>
                        <Localize i18n_default_text="Check your spam or junk folder. If it's not there, try resending the email." />
                    </Text>
                    <Button
                        className='cfd-verification-email-sent__resend-button'
                        large
                        primary
                        disabled={is_resend_verification_sent}
                        onClick={resendVerification}
                    >
                        {!is_resend_verification_sent && <Localize i18n_default_text='Resend email' />}
                        {is_resend_verification_sent && (
                            <>
                                <Localize
                                    i18n_default_text='Resend in <0 /> seconds'
                                    components={[
                                        <CountdownComponent
                                            key={0}
                                            onTimeout={() => setResendVerificationSent(false)}
                                            count_from={60}
                                        />,
                                    ]}
                                />
                            </>
                        )}
                    </Button>
                </>
            )}
        </div>
    );
};

const CFDPasswordManagerTabContentWrapper = ({ multi_step_ref, steps }: TCFDPasswordManagerTabContentWrapper) => (
    <MultiStep ref={multi_step_ref} steps={steps} className='cfd-password-manager' lbl_previous={localize('Back')} />
);

const CFDPasswordManagerTabContent = ({
    toggleModal,
    selected_login,
    email,
    setPasswordType,
    multi_step_ref,
    platform,
    onChangeActiveTabIndex,
    account_group,
}: TCFDPasswordManagerTabContent) => {
    const { isDesktop } = useDevice();
    const [active_tab_index, setActiveTabIndex] = React.useState<number>(0);
    const [error_message_investor, setErrorMessageInvestor] = React.useState<string>('');
    const [is_submit_success_investor, setSubmitSuccessInvestor] = React.useState<boolean>(false);

    // view height - margin top and bottom of modal - modal title - modal content margin top and bottom - table title
    const container_height = 'calc(100vh - 84px - 5.6rem - 8.8rem - 4rem)';
    const validateNewPasswordPolicy = (values: TFormValues) => {
        const errors: FormikErrors<TFormValues> = {};

        if (!values.old_password) {
            errors.old_password = localize('This field is required');
        }
        if (!values.new_password) {
            errors.new_password = localize('This field is required');
        }

        if (platform === CFD_PLATFORMS.MT5 && !validMT5Password(values.new_password)) {
            errors.new_password = getErrorMessages().special_characters();
        } else if (validatePassword(values.new_password)) errors.new_password = validatePassword(values.new_password);

        return errors;
    };
    const showError = (error_message: string) => {
        setErrorMessageInvestor(error_message);
    };

    const hideError = () => {
        setErrorMessageInvestor('');
        setSubmitSuccessInvestor(true);
    };

    const onSubmit = React.useCallback(
        async (values: TPasswordManagerModalFormValues) => {
            if (!selected_login) {
                return;
            }

            const error = await CFDStore.changePassword({ login: selected_login, ...values });
            if (error) {
                showError(error);
            } else {
                hideError();
            }
        },
        [selected_login]
    );

    const updateAccountTabIndex = (index: number) => {
        setActiveTabIndex(index);
        onChangeActiveTabIndex(index);
        setErrorMessageInvestor('');
        setSubmitSuccessInvestor(false);
    };

    const trading_password_manager = (
        <React.Fragment>
            {isDesktop ? (
                <ThemedScrollbars height={container_height} is_bypassed={!isDesktop} autohide={false}>
                    <TradingPasswordManager
                        toggleModal={toggleModal}
                        platform={platform}
                        email={email}
                        account_group={account_group}
                    />
                </ThemedScrollbars>
            ) : (
                <Div100vhContainer className='cfd-password-manager__scroll-wrapper' height_offset='120px'>
                    <TradingPasswordManager
                        toggleModal={toggleModal}
                        platform={platform}
                        email={email}
                        account_group={account_group}
                    />
                </Div100vhContainer>
            )}
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
                {isDesktop ? (
                    <ThemedScrollbars height={container_height}>
                        <InvestorPasswordManager
                            is_submit_success_investor={is_submit_success_investor}
                            toggleModal={toggleModal}
                            error_message_investor={error_message_investor}
                            validatePassword={validateNewPasswordPolicy}
                            onSubmit={onSubmit}
                            setPasswordType={setPasswordType}
                            multi_step_ref={multi_step_ref}
                        />
                    </ThemedScrollbars>
                ) : (
                    <Div100vhContainer className='cfd-password-manager__scroll-wrapper' height_offset='120px'>
                        <InvestorPasswordManager
                            is_submit_success_investor={is_submit_success_investor}
                            toggleModal={toggleModal}
                            error_message_investor={error_message_investor}
                            validatePassword={validateNewPasswordPolicy}
                            onSubmit={onSubmit}
                            setPasswordType={setPasswordType}
                            multi_step_ref={multi_step_ref}
                        />
                    </Div100vhContainer>
                )}
            </div>
        </Tabs>
    );
};

const CFDPasswordManagerModal = observer(
    ({
        is_visible,
        platform,
        selected_login,
        toggleModal,
        selected_account_type,
        selected_account_group,
        selected_server,
    }: TCFDPasswordManagerModal) => {
        const { client, ui } = useStore();
        const { isDesktop } = useDevice();

        const { email } = client;
        const { enableApp, disableApp } = ui;

        const { sendVerifyEmail } = useCfdStore();

        const multi_step_ref: React.MutableRefObject<undefined> = React.useRef();
        const [index, setIndex] = React.useState<number>(0);

        const [password_type, setPasswordType] = React.useState('main');

        if (!selected_login) return null;

        const getTitle = () => {
            return localize('Manage {{platform}} password', {
                platform: getCFDPlatformLabel(platform),
            });
        };

        const getHeader = (i: number) => {
            if (i === 0) {
                return localize('Manage {{platform}} password', {
                    platform: getCFDPlatformLabel(platform),
                });
            }
            return localize('Manage password');
        };

        const onChangeActiveTabIndex = (i: number) => {
            setIndex(i);
        };

        const steps = [
            {
                component: (
                    <CFDPasswordManagerTabContent
                        email={email}
                        selected_login={selected_login}
                        toggleModal={toggleModal}
                        setPasswordType={setPasswordType}
                        multi_step_ref={multi_step_ref}
                        platform={platform}
                        onChangeActiveTabIndex={onChangeActiveTabIndex}
                        account_group={selected_account_group}
                    />
                ),
            },
            {
                component: (
                    <CFDPasswordReset
                        server={selected_server}
                        sendVerifyEmail={sendVerifyEmail}
                        account_type={selected_account_type}
                        account_group={selected_account_group}
                        password_type={password_type}
                    />
                ),
            },
        ];

        return (
            <React.Suspense fallback={<UILoader />}>
                {isDesktop ? (
                    <Modal
                        className='cfd-password-manager__modal'
                        disableApp={disableApp}
                        enableApp={enableApp}
                        is_open={is_visible}
                        title={getTitle()}
                        toggleModal={toggleModal}
                        height='688px'
                        width='90.4rem'
                        should_header_stick_body={false}
                    >
                        <CFDPasswordManagerTabContentWrapper steps={steps} multi_step_ref={multi_step_ref} />
                    </Modal>
                ) : (
                    <PageOverlay
                        is_open={is_visible}
                        portal_id='deriv_app'
                        header={getHeader(index)}
                        onClickClose={toggleModal}
                    >
                        <CFDPasswordManagerTabContentWrapper steps={steps} multi_step_ref={multi_step_ref} />
                    </PageOverlay>
                )}
            </React.Suspense>
        );
    }
);

export default CFDPasswordManagerModal;
