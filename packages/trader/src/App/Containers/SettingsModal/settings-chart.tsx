import React from 'react';
import { Checkbox, InlineMessage } from '@deriv/components';
import { Localize } from '@deriv/translations';
import MediaItem, { MediaHeading, MediaIcon, MediaDescription } from 'App/Components/Elements/Media';
import { observer, useStore } from '@deriv/stores';

// TODO: enable asset information
// import OHLCDisabledLightIcon             from 'Assets/SvgComponents/settings/OHLC-disabled.svg';
// import OHLCEnabledLightIcon              from 'Assets/SvgComponents/settings/OHLC-enabled.svg';
// import OHLCDisabledDarkIcon              from 'Assets/SvgComponents/settings/dark/OHLC-disabled.svg';
// import OHLCEnabledDarkIcon               from 'Assets/SvgComponents/settings/dark/OHLC-enabled.svg';

import IntervalDurationDisabledDarkIcon from 'Assets/SvgComponents/settings/dark/interval-disabled.svg';
import IntervalDurationEnabledDarkIcon from 'Assets/SvgComponents/settings/dark/interval-enabled.svg';
import IntervalDurationDisabledLightIcon from 'Assets/SvgComponents/settings/interval-disabled.svg';
import IntervalDurationEnabledLightIcon from 'Assets/SvgComponents/settings/interval-enabled.svg';

const ChartSettings = observer(() => {
    const { contract_trade, ui } = useStore();
    const {
        is_chart_countdown_visible: is_countdown_visible,
        is_dark_mode_on: is_dark_mode,
        setChartCountdown: setCountdown,
    } = ui;
    const { granularity } = contract_trade;

    return (
        <div className='settings-chart'>
            <MediaItem>
                <MediaHeading>
                    <Localize i18n_default_text='Interval duration' />
                    {granularity === 0 && (
                        <InlineMessage
                            type='information'
                            message={
                                <Localize i18n_default_text='This feature is unavailable for tick intervals. Switch to minutes, hours, or days.' />
                            }
                        />
                    )}
                </MediaHeading>
                <MediaDescription>
                    <MediaIcon
                        disabled={is_dark_mode ? IntervalDurationDisabledDarkIcon : IntervalDurationDisabledLightIcon}
                        enabled={is_dark_mode ? IntervalDurationEnabledDarkIcon : IntervalDurationEnabledLightIcon}
                        id='dt_settings_interval_image'
                        is_enabled={is_countdown_visible}
                    />
                    <div className='media__form'>
                        <Checkbox
                            id='dt_settings_interval_checkbox'
                            defaultChecked={is_countdown_visible}
                            disabled={granularity === 0}
                            label={<Localize i18n_default_text='Display remaining time for each interval' />}
                            onChange={e => {
                                if ('checked' in e.target) {
                                    setCountdown(e.target.checked);
                                }
                            }}
                        />
                    </div>
                </MediaDescription>
            </MediaItem>
        </div>
    );
});

export default ChartSettings;
