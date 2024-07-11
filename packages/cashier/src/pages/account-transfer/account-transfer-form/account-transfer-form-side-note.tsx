import React, { useCallback } from 'react';

import { GetLimits } from '@deriv/api-types';
import { Text } from '@deriv-lib/components';
import { getCurrencyDisplayCode, getPlatformSettings } from '@deriv-lib/shared';
import { Localize } from '@deriv-lib/translations';

type TAccountTransferNoteProps = {
    allowed_transfers_count: GetLimits['daily_transfers'];
    currency: string;
    is_crypto_to_crypto_transfer?: boolean;
    is_ctrader_transfer?: boolean;
    is_dxtrade_allowed: boolean;
    is_dxtrade_transfer?: boolean;
    is_mt_transfer?: boolean;
    minimum_fee: string | null;
    transfer_fee?: number | null;
};

const AccountTransferBullet = ({ children }: React.PropsWithChildren) => (
    <div className='account-transfer-form__bullet-wrapper'>
        <div className='account-transfer-form__bullet' />
        <Text size='xxs'>{children}</Text>
    </div>
);

const AccountTransferNote = ({
    allowed_transfers_count,
    currency,
    is_crypto_to_crypto_transfer,
    is_dxtrade_allowed,
    is_dxtrade_transfer,
    is_mt_transfer,
    minimum_fee,
    transfer_fee,
}: TAccountTransferNoteProps) => {
    const platform_name_dxtrade = getPlatformSettings('dxtrade').name;
    const platform_name_mt5 = getPlatformSettings('mt5').name;
    const platform_name_ctrader = getPlatformSettings('ctrader').name;

    const getTransferFeeNote = useCallback(() => {
        if (transfer_fee === 0) {
            return is_dxtrade_allowed ? (
                <Localize
                    i18n_default_text='We do not charge a transfer fee for transfers in the same currency between your Deriv fiat and {{platform_name_mt5}} accounts, between your Deriv fiat and {{platform_name_ctrader}} accounts, and between your Deriv fiat and {{platform_name_dxtrade}} accounts.'
                    values={{ platform_name_dxtrade, platform_name_mt5, platform_name_ctrader }}
                />
            ) : (
                <Localize
                    i18n_default_text='You’ll not be charged a transfer fee for transfers in the same currency between your Deriv fiat and {{platform_name_mt5}} accounts.'
                    values={{ platform_name_mt5 }}
                />
            );
        } else if (transfer_fee === 1) {
            return is_dxtrade_allowed ? (
                <Localize
                    i18n_default_text='We’ll charge a 1% transfer fee for transfers in different currencies between your Deriv fiat and {{platform_name_mt5}} accounts and between your Deriv fiat and {{platform_name_dxtrade}} accounts.'
                    values={{ platform_name_dxtrade, platform_name_mt5 }}
                />
            ) : (
                <Localize
                    i18n_default_text='We’ll charge a 1% transfer fee for transfers in different currencies between your Deriv fiat and {{platform_name_mt5}} accounts.'
                    values={{ platform_name_mt5 }}
                />
            );
        } else if (transfer_fee === 2 && is_crypto_to_crypto_transfer) {
            return (
                <Localize
                    i18n_default_text='We’ll charge a 2% transfer fee or {{minimum_fee}} {{currency}}, whichever is higher, for transfers between your Deriv cryptocurrency accounts.'
                    values={{
                        minimum_fee,
                        currency: getCurrencyDisplayCode(currency),
                    }}
                />
            );
        } else if (transfer_fee === 2 && (is_mt_transfer || is_dxtrade_transfer)) {
            return is_dxtrade_allowed ? (
                <Localize
                    i18n_default_text='We’ll charge a 2% transfer fee or {{minimum_fee}} {{currency}}, whichever is higher, for transfers between your Deriv cryptocurrency and Deriv MT5 accounts and between your Deriv cryptocurrency and {{platform_name_dxtrade}} accounts.'
                    values={{
                        minimum_fee,
                        currency: getCurrencyDisplayCode(currency),
                        platform_name_dxtrade,
                    }}
                />
            ) : (
                <Localize
                    i18n_default_text='We’ll charge a 2% transfer fee or {{minimum_fee}} {{currency}}, whichever is higher, for transfers between your Deriv cryptocurrency and Deriv MT5 accounts.'
                    values={{
                        minimum_fee,
                        currency: getCurrencyDisplayCode(currency),
                    }}
                />
            );
        } else if (transfer_fee === 2 && !is_mt_transfer && !is_dxtrade_transfer) {
            return (
                <Localize
                    i18n_default_text='We’ll charge a 2% transfer fee or {{minimum_fee}} {{currency}}, whichever is higher, for transfers between your Deriv fiat and Deriv cryptocurrency accounts.'
                    values={{
                        minimum_fee,
                        currency: getCurrencyDisplayCode(currency),
                    }}
                />
            );
        }
        return null;
    }, [
        currency,
        is_crypto_to_crypto_transfer,
        is_dxtrade_allowed,
        is_dxtrade_transfer,
        is_mt_transfer,
        minimum_fee,
        platform_name_dxtrade,
        platform_name_mt5,
        platform_name_ctrader,
        transfer_fee,
    ]);

    const getDxtradeAllowedNotes = useCallback(() => {
        if (is_dxtrade_allowed) {
            return (
                <React.Fragment>
                    <AccountTransferBullet>
                        <Localize
                            i18n_default_text='You may transfer between your Deriv fiat, cryptocurrency, {{platform_name_mt5}}, {{platform_name_ctrader}}, and {{platform_name_dxtrade}} accounts.'
                            values={{ platform_name_dxtrade, platform_name_mt5, platform_name_ctrader }}
                        />
                    </AccountTransferBullet>
                    <AccountTransferBullet>
                        <Localize
                            i18n_default_text='Each day, you can make up to {{ allowed_internal }} transfers between your Deriv accounts, up to {{ allowed_mt5 }} transfers between your Deriv and {{platform_name_mt5}} accounts, up to {{ allowed_ctrader }} transfers between your Deriv and {{platform_name_ctrader}} accounts, and up to {{ allowed_dxtrade }} transfers between your Deriv and {{platform_name_dxtrade}} accounts.'
                            values={{
                                allowed_internal: allowed_transfers_count?.internal,
                                allowed_mt5: allowed_transfers_count?.mt5,
                                allowed_dxtrade: allowed_transfers_count?.dxtrade,
                                allowed_ctrader: allowed_transfers_count?.ctrader,
                                platform_name_dxtrade,
                                platform_name_mt5,
                                platform_name_ctrader,
                            }}
                        />
                    </AccountTransferBullet>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <AccountTransferBullet>
                    <Localize
                        i18n_default_text='You may transfer between your Deriv fiat, cryptocurrency, and {{platform_name_mt5}} accounts.'
                        values={{ platform_name_mt5 }}
                    />
                </AccountTransferBullet>
                <AccountTransferBullet>
                    <Localize
                        i18n_default_text='Each day, you can make up to {{ allowed_internal }} transfers between your Deriv accounts and up to {{ allowed_mt5 }} transfers between your Deriv and {{platform_name_mt5}} accounts.'
                        values={{
                            allowed_internal: allowed_transfers_count?.internal,
                            allowed_mt5: allowed_transfers_count?.mt5,
                            platform_name_mt5,
                        }}
                    />
                </AccountTransferBullet>
            </React.Fragment>
        );
    }, [
        allowed_transfers_count?.dxtrade,
        allowed_transfers_count?.internal,
        allowed_transfers_count?.ctrader,
        allowed_transfers_count?.mt5,
        is_dxtrade_allowed,
        platform_name_dxtrade,
        platform_name_mt5,
        platform_name_ctrader,
    ]);

    return (
        <div className='account-transfer-form__notes'>
            {getDxtradeAllowedNotes()}
            <AccountTransferBullet>
                <Localize i18n_default_text='Transfer limits may vary depending on the exchange rates.' />
            </AccountTransferBullet>
            <AccountTransferBullet>
                {getTransferFeeNote()}{' '}
                <Localize i18n_default_text='Please bear in mind that some transfers may not be possible.' />
            </AccountTransferBullet>
            <AccountTransferBullet>
                <Localize i18n_default_text='Transfers may be unavailable due to high volatility or technical issues and when the exchange markets are closed.' />
            </AccountTransferBullet>
        </div>
    );
};

export default AccountTransferNote;
