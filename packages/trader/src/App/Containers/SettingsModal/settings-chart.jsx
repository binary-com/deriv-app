import {
    Checkbox,
    ImgToolbarBottomDark,
    ImgToolbarBottomLight,
    ImgToolbarLeftDark,
    ImgToolbarLeftLight,
    ImgIntervalDisabledDark,
    ImgIntervalDisabledLight,
    ImgIntervalEnabledDark,
    ImgIntervalEnabledLight }  from 'deriv-components';
// TODO: enable asset information
// import {
//     ImgOhlcDisabledDark,
//     ImgOhlcDisabledLight,
//     ImgOhlcEnabledDark,
//     ImgOhlcEnabledLight
// } from 'deriv-components';
import PropTypes               from 'prop-types';
import React                   from 'react';
import { localize }            from 'App/i18n';
import { connect }             from 'Stores/connect';
import Localize                from 'App/Components/Elements/localize.jsx';
import MediaItem, {
    MediaHeading,
    MediaIcon,
    MediaDescription }         from 'App/Components/Elements/Media';
import RadioGroup              from 'App/Components/Form/Radio';

const ChartSettings = ({
    // TODO: enable asset information
    // is_asset_visible,
    // toggleAsset,
    is_countdown_visible,
    is_dark_mode,
    is_layout_default,
    toggleCountdown,
    toggleLayout,
}) => (
    <div className='settings-chart'>
        <MediaItem>
            <MediaHeading>
                <Localize i18n_default_text='Toolbar position' />
            </MediaHeading>
            <MediaDescription>
                <MediaIcon
                    disabled={is_dark_mode ? ImgToolbarLeftDark : ImgToolbarLeftLight}
                    enabled={is_dark_mode ? ImgToolbarBottomDark : ImgToolbarBottomLight}
                    id='dt_settings_position_image'
                    is_enabled={is_layout_default}
                />
                <div className='media__form'>
                    <p><Localize i18n_default_text='Change the position of the toolbar' /></p>
                    <RadioGroup
                        items={[
                            {
                                label: <Localize i18n_default_text='Bottom' />,
                                value: true,
                                id   : 'dt_settings_bottom_radio',
                            },
                            {
                                label: <Localize i18n_default_text='Left' />,
                                value: false,
                                id   : 'dt_settings_left_radio',
                            },
                        ]}
                        selected={is_layout_default}
                        onToggle={toggleLayout}
                    />
                </div>
            </MediaDescription>
        </MediaItem>
        {/* TODO: enable asset information
            <MediaItem>
            <MediaHeading>
                <Localize
                    i18n_default_text='Open-high-low-close <0>(OHLC) information</0>'
                    components={[ <div key={0} /> ]}
                />
            </MediaHeading>
            <MediaDescription>
                <MediaIcon
                    disabled={is_dark_mode ? ImgOhlcDisabledDark : ImgOhlcDisabledLight }
                    enabled={is_dark_mode ? ImgOhlcEnabledDark : ImgOhlcEnabledLight}
                    is_enabled={is_asset_visible}
                />
                <div className='media__form'>
                    <Checkbox
                        value={is_asset_visible}
                        label={localize('Display open-high-low-close (OHLC) information for current chart')}
                        onClick={toggleAsset}
                    />
                </div>
            </MediaDescription>
        </MediaItem> */}
        <MediaItem>
            <MediaHeading>
                <Localize i18n_default_text='Interval duration' />
            </MediaHeading>
            <MediaDescription>
                <MediaIcon
                    disabled={is_dark_mode ? ImgIntervalDisabledDark : ImgIntervalDisabledLight}
                    enabled={is_dark_mode ? ImgIntervalEnabledDark : ImgIntervalEnabledLight}
                    id='dt_settings_interval_image'
                    is_enabled={is_countdown_visible}
                />
                <div className='media__form'>
                    <Checkbox
                        id='dt_settings_interval_checkbox'
                        value={is_countdown_visible}
                        label={localize('Display remaining time for each interval')}
                        onClick={toggleCountdown}
                    />
                </div>
            </MediaDescription>
        </MediaItem>
    </div>
);

ChartSettings.propTypes = {
    is_asset_visible    : PropTypes.bool,
    is_countdown_visible: PropTypes.bool,
    is_dark_mode        : PropTypes.bool,
    is_layout_default   : PropTypes.bool,
    toggleAsset         : PropTypes.func,
    toggleCountdown     : PropTypes.func,
    toggleLayout        : PropTypes.func,
};

export default connect(({ ui }) => (
    {
        is_asset_visible    : ui.is_chart_asset_info_visible,
        is_countdown_visible: ui.is_chart_countdown_visible,
        is_dark_mode        : ui.is_dark_mode_on,
        is_layout_default   : ui.is_chart_layout_default,
        toggleAsset         : ui.toggleChartAssetInfo,
        toggleCountdown     : ui.toggleChartCountdown,
        toggleLayout        : ui.toggleChartLayout,
    }
))(ChartSettings);
