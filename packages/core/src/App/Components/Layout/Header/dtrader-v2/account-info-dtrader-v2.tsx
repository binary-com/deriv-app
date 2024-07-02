import React from 'react';
import classNames from 'classnames';
import { Localize } from '@deriv/translations';
import { Skeleton } from '@deriv/components';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { LabelPairedChevronDownCaptionRegularIcon, LabelPairedLockCaptionRegularIcon } from '@deriv/quill-icons';
import { CaptionText, Heading, ActionSheet } from '@deriv-com/quill-ui';
import { TAccountInfoDTraderV2 } from './account-actions-dtrader-v2';
import AccountSwitcherDTraderV2 from './account-switcher-dtrader-v2';
import { getAccountIcon } from './Utils/account-switcher-dtrader-v2-utils';
import AccountInfoWrapper from '../account-info-wrapper';

const AccountInfoDTraderV2 = ({
    acc_switcher_disabled_message,
    account_switcher_title,
    balance,
    currency,
    is_dialog_on,
    is_virtual,
    is_disabled,
    toggleDialog,
}: TAccountInfoDTraderV2) => {
    const action_icon = is_disabled ? (
        <LabelPairedLockCaptionRegularIcon />
    ) : (
        <LabelPairedChevronDownCaptionRegularIcon
            className={classNames('header-v2__acc-info__select-arrow', {
                'header-v2__acc-info__select-arrow--up': is_dialog_on,
            })}
        />
    );

    const account_balance = currency ? (
        `${balance} ${getCurrencyDisplayCode(currency)}`
    ) : (
        <Localize i18n_default_text='No currency assigned' />
    );

    return (
        <React.Fragment>
            <AccountInfoWrapper
                disabled_message={acc_switcher_disabled_message}
                is_disabled={is_disabled}
                is_mobile
                is_dtrader_v2
            >
                {account_switcher_title ? (
                    <button
                        className='header-v2__acc-info__wrapper'
                        onClick={is_disabled ? undefined : () => toggleDialog()}
                    >
                        {getAccountIcon({ currency, is_virtual, size: 'md' })}
                        <div className='header-v2__acc-info'>
                            <div className='header-v2__acc-info__name'>
                                <CaptionText color='quill-typography__color--default'>
                                    {account_switcher_title}
                                </CaptionText>
                                {action_icon}
                            </div>
                            {(balance ?? !currency) && (
                                <Heading.H5 className='header-v2__acc-info__balance'>{account_balance}</Heading.H5>
                            )}
                        </div>
                    </button>
                ) : (
                    <Skeleton width={144} height={36} />
                )}
            </AccountInfoWrapper>
            <ActionSheet.Root isOpen={is_dialog_on} onClose={() => toggleDialog(false)} position='left'>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <ActionSheet.Content>
                        <AccountSwitcherDTraderV2 />
                    </ActionSheet.Content>
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
};

export default AccountInfoDTraderV2;
