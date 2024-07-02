import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { Icon, Modal, Popover, Text } from '@deriv/components';
import { useTranslations, Localize } from '@deriv-com/translations';
import 'Sass/app/modules/settings.scss';
import LanguageSettings from '../../../Containers/SettingsModal/settings-language';
import { TranslationFlag } from '@deriv/shared';

const ToggleLanguageSettings = observer(({ showPopover }: { showPopover?: boolean }) => {
    const { common, ui } = useStore();
    const { localize, currentLang, switchLanguage } = useTranslations();
    const { is_language_settings_modal_on, toggleLanguageSettingsModal } = ui;
    const { is_language_changing, current_language } = common;

    React.useEffect(() => {
        switchLanguage(current_language);
    }, [current_language, switchLanguage]);

    const toggle_settings_class = classNames('ic-language', 'footer__link', {
        'ic-settings--active': is_language_settings_modal_on,
        'ic-settings--disabled': is_language_changing,
    });
    const content = (
        <React.Fragment>
            {TranslationFlag[currentLang] ? (
                TranslationFlag[currentLang](18, 12)
            ) : (
                //TODOs: remove this when Korean flag is included in quill-icons
                <Icon icon={`IcFlag${currentLang}`} data_testid='dt_icon' size={18} />
            )}

            <Text weight='bold' size='xxs' className='ic-settings-language__text'>
                <Localize i18n_default_text={currentLang} />
            </Text>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <a
                id='dt_language_settings_toggle'
                data-testid='dt_toggle_language_settings'
                onClick={toggleLanguageSettingsModal}
                className={toggle_settings_class}
            >
                {showPopover ? (
                    <Popover alignment='top' message={localize('Language')} zIndex='9999'>
                        {content}
                    </Popover>
                ) : (
                    content
                )}
            </a>
            <Modal
                id='dt_settings_modal'
                is_open={is_language_settings_modal_on}
                title={localize('Select Language')}
                toggleModal={toggleLanguageSettingsModal}
                width='616px'
                should_header_stick_body={false}
            >
                <LanguageSettings />
            </Modal>
        </React.Fragment>
    );
});

export { ToggleLanguageSettings };
