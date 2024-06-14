import React from 'react';
import { Modal, DesktopWrapper, MobileOrTabletWrapper, MultiStep, PageOverlay, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import { VerifyEmailResponse } from '@deriv/api-types';
import { getCFDPlatformLabel } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useVerifyEmail } from '@deriv/api';
import { TCFDPasswordManagerTabContentWrapper, TCFDPasswordManagerModal } from 'Containers/props.types';
import { QUERY_STATUS } from 'Helpers/cfd-config';
import { CFDPasswordReset } from './cfd-password-reset';
import { CFDPasswordManagerTabContent } from './cfd-password-manager-tab-content';

// Temporary type because of build failing. Confirm with Accounts team
type TSendVerifyEmail = () => Promise<VerifyEmailResponse>;

export type TStatus = typeof QUERY_STATUS[keyof typeof QUERY_STATUS];

const CFDPasswordManagerTabContentWrapper = ({ multi_step_ref, steps }: TCFDPasswordManagerTabContentWrapper) => (
    <MultiStep ref={multi_step_ref} steps={steps} className='cfd-password-manager' lbl_previous={localize('Back')} />
);

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

        const { email } = client;
        const { enableApp, disableApp } = ui;

        const { mutate } = useVerifyEmail();

        const sendVerifyEmail = () => mutate({ verify_email: email, type: 'trading_platform_investor_password_reset' });

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
                        sendVerifyEmail={sendVerifyEmail as unknown as TSendVerifyEmail}
                        account_type={selected_account_type}
                        account_group={selected_account_group}
                        password_type={password_type}
                    />
                ),
            },
        ];

        return (
            <React.Suspense fallback={<UILoader />}>
                <DesktopWrapper>
                    <Modal
                        className='cfd-password-manager__modal'
                        disableApp={disableApp}
                        enableApp={enableApp}
                        is_open={is_visible}
                        title={getTitle()}
                        toggleModal={toggleModal}
                        height='688px'
                        width='904px'
                        should_header_stick_body={false}
                    >
                        <CFDPasswordManagerTabContentWrapper steps={steps} multi_step_ref={multi_step_ref} />
                    </Modal>
                </DesktopWrapper>
                <MobileOrTabletWrapper>
                    <PageOverlay
                        is_open={is_visible}
                        portal_id='deriv_app'
                        header={getHeader(index)}
                        onClickClose={toggleModal}
                    >
                        <CFDPasswordManagerTabContentWrapper steps={steps} multi_step_ref={multi_step_ref} />
                    </PageOverlay>
                </MobileOrTabletWrapper>
            </React.Suspense>
        );
    }
);

export default CFDPasswordManagerModal;
