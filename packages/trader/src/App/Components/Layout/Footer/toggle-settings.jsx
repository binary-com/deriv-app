import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Modal, VerticalTab, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import Lazy from 'App/Containers/Lazy';
import 'Sass/app/modules/settings.scss';

const ThemeSetting = () => (
    <Lazy
        ctor={() =>
            import(
                /* webpackChunkName: "settings-theme", webpackPrefetch: true */ 'App/Containers/SettingsModal/settings-theme.jsx'
            )
        }
        should_load={true}
        has_progress={true}
    />
);
const LanguageSettingContainer = () => (
    <Lazy
        ctor={() =>
            import(
                /* webpackChunkName: "settings-language", webpackPrefetch: true */ 'App/Containers/SettingsModal/settings-language.jsx'
            )
        }
        should_load={true}
        has_progress={true}
    />
);

const ChartSettingContainer = () => (
    <Lazy
        ctor={() =>
            import(
                /* webpackChunkName: "settings-chart", webpackPrefetch: true */ 'App/Containers/SettingsModal/settings-chart.jsx'
            )
        }
    />
);

ChartSettingContainer.displayName = 'ChartSettingContainer';
LanguageSettingContainer.displayName = 'LanguageSettingContainer';
ThemeSetting.displayName = 'ThemeSettingContainer';

const ModalContent = () => {
    const content = [
        {
            icon: 'IcTheme',
            label: localize('Themes'),
            // eslint-disable-next-line react/display-name
            value: ThemeSetting,
        },
        {
            icon: 'IcLanguage',
            label: localize('Language'),
            value: LanguageSettingContainer,
        },
        {
            icon: 'IcChart',
            label: localize('Charts'),
            value: ChartSettingContainer,
            // uncomment below lines to bring back purchase lock and purchase confirmation}
            // }, {
            //     icon : IconPurchase,
            //     label: localize('Purchase'),
            //     value: PurchaseSettings,
        },
    ];
    return <VerticalTab alignment='center' classNameHeader='modal__tab-header' id='modal' list={content} />;
};

const ToggleSettings = ({ enableApp, is_settings_visible, disableApp, toggleSettings }) => {
    const toggle_settings_class = classNames('ic-settings', 'footer__link', {
        'ic-settings--active': is_settings_visible,
    });
    return (
        <React.Fragment>
            <a id='dt_settings_toggle' onClick={toggleSettings} className={toggle_settings_class}>
                <Icon icon='IcGear' className='footer__icon ic-settings__icon' />
            </a>
            <React.Suspense fallback={<UILoader />}>
                <Modal
                    id='dt_settings_modal'
                    className='modal-settings'
                    enableApp={enableApp}
                    is_open={is_settings_visible}
                    disableApp={disableApp}
                    title={localize('Platform settings')}
                    toggleModal={toggleSettings}
                    height='616px'
                    width='736px'
                >
                    <ModalContent />
                </Modal>
            </React.Suspense>
        </React.Fragment>
    );
};

ToggleSettings.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_settings_visible: PropTypes.bool,
    toggleSettings: PropTypes.func,
};

export { ToggleSettings };
