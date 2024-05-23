import React from 'react';
import { Dialog } from '@deriv/components';
import { getPlatformSettings } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';

type TMarketUnavailableModalProps = {
    is_loading?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

const MarketUnavailableModal = observer(({ is_loading, onCancel, onConfirm }: TMarketUnavailableModalProps) => {
    const { ui } = useStore();
    const { disableApp, enableApp, has_only_forward_starting_contracts: is_visible } = ui;

    return (
        <Dialog
            className='market-unavailable-modal'
            title={<Localize i18n_default_text='We’re working on it' />}
            confirm_button_text={localize('Stay on {{platform_name_trader}}', {
                platform_name_trader: getPlatformSettings('trader').name,
            })}
            cancel_button_text={localize('Go to {{platform_name_smarttrader}}', {
                platform_name_smarttrader: getPlatformSettings('smarttrader').name,
            })}
            onConfirm={onConfirm}
            onCancel={onCancel}
            is_mobile_full_width={false}
            is_visible={is_visible}
            disableApp={disableApp}
            enableApp={enableApp}
            is_loading={is_loading}
        >
            <Localize
                i18n_default_text='This market is not yet available on {{platform_name_trader}}, but it is on {{platform_name_smarttrader}}.'
                values={{
                    platform_name_trader: getPlatformSettings('trader').name,
                    platform_name_smarttrader: getPlatformSettings('smarttrader').name,
                }}
            />
        </Dialog>
    );
});

export default MarketUnavailableModal;
