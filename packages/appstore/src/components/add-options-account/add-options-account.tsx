import React from 'react';
import { DesktopWrapper, MobileWrapper, Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import './add-options-account.scss';
import { useStore, observer } from '@deriv/stores';
import { isMobile, ContentFlag } from '@deriv/shared';
import { Analytics } from '@deriv-com/analytics';

const AddOptions = observer(() => {
    const { client, traders_hub, ui } = useStore();
    const { is_real, content_flag, selected_account_type } = traders_hub;
    const { setShouldShowCooldownModal, openRealAccountSignup } = ui;
    const { real_account_creation_unlock_date } = client;

    const add_deriv_account_text = localize('To trade CFDs, get a Deriv Apps account first.');
    const add_deriv_account_btn = localize('Get a Deriv account');

    const eu_user = content_flag === ContentFlag.LOW_RISK_CR_EU || content_flag === ContentFlag.EU_REAL;

    return (
        <React.Fragment>
            <div className='add-options-account__title'>
                <Text size={isMobile() ? 'xxs' : 's'} weight='bold'>
                    <Localize i18n_default_text={add_deriv_account_text} />
                </Text>
            </div>
            <div className='add-options-account__button'>
                <Button
                    className='add-options-account__button'
                    type='submit'
                    has_effect
                    onClick={() => {
                        Analytics.trackEvent('ce_tradershub_dashboard_form', {
                            action: 'account_get',
                            form_name: 'traders_hub_default',
                            account_mode: selected_account_type,
                            account_name: 'cfd_banner',
                        });
                        if (is_real && eu_user) {
                            if (real_account_creation_unlock_date) {
                                setShouldShowCooldownModal(true);
                            } else {
                                openRealAccountSignup('maltainvest');
                            }
                        } else {
                            openRealAccountSignup('svg');
                        }
                    }}
                    is_disabled={false}
                    is_loading={false}
                    text={add_deriv_account_btn}
                    medium
                    primary
                />
            </div>
        </React.Fragment>
    );
});

const AddOptionsAccount = observer(() => {
    return (
        <React.Fragment>
            <div className='add-options-account'>
                <DesktopWrapper>
                    <AddOptions />
                </DesktopWrapper>
                <MobileWrapper>
                    <AddOptions />
                </MobileWrapper>
            </div>
        </React.Fragment>
    );
});

export default AddOptionsAccount;
