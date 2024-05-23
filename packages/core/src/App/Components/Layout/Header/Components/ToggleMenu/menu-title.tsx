import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { Icon, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';

const MenuTitle = observer(() => {
    const { client, common, ui } = useStore();
    const { has_wallet } = client;
    const { current_language } = common;
    const { is_mobile_language_menu_open, setMobileLanguageMenuOpen } = ui;

    return (
        <React.Fragment>
            <div>{localize('Menu')}</div>
            {!has_wallet && (
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
                            <Icon
                                icon={`IcFlag${current_language.replace('_', '-')}`}
                                data_testid='dt_icon'
                                className='ic-settings-language__icon'
                                size={22}
                            />
                            <Text weight='bold' size='xxs'>
                                <Localize i18n_default_text={current_language} />
                            </Text>
                        </React.Fragment>
                    )}
                </div>
            )}
        </React.Fragment>
    );
});

export default MenuTitle;
