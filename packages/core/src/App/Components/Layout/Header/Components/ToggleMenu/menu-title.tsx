import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { Icon, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { TranslationFlag } from '@deriv/shared';

const MenuTitle = observer(() => {
    const { common, ui } = useStore();
    const { current_language } = common;
    const { is_mobile_language_menu_open, setMobileLanguageMenuOpen } = ui;

    return (
        <React.Fragment>
            <div>{localize('Menu')}</div>
            <div
                className='settings-language__language-button_wrapper'
                onClick={() => {
                    if (!is_mobile_language_menu_open) {
                        setMobileLanguageMenuOpen(true);
                    }
                }}
            >
                {!is_mobile_language_menu_open && (
                    <React.Fragment>
                        {TranslationFlag[current_language] ? (
                            TranslationFlag[current_language](22, 16)
                        ) : (
                            //TODOs: remove this when Korean flag is added to quill-icons
                            <Icon icon={`IcFlag${current_language}`} data_testid='dt_icon' size={18} />
                        )}
                        <Text weight='bold' size='xxs' className='ic-settings-language__text'>
                            <Localize i18n_default_text={current_language} />
                        </Text>
                    </React.Fragment>
                )}
            </div>
        </React.Fragment>
    );
});

export default MenuTitle;
