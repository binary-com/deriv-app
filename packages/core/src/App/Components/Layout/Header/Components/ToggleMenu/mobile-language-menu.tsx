import React from 'react';
import classNames from 'classnames';
import { MobileDrawer } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { getAllowedLanguages } from '@deriv-com/translations';
import { localize } from '@deriv/translations'; // [TODO:] Remove this once deriv-app is configured to use the new translation lib
import { LanguageLink } from 'App/Components/Routes';
import { UNSUPPORTED_LANGUAGES } from '@deriv/shared';

type TMobileLanguageMenu = {
    expandSubMenu: (prop: boolean) => void;
    toggleDrawer: () => void;
};

const MobileLanguageMenu = observer(({ expandSubMenu, toggleDrawer }: TMobileLanguageMenu) => {
    const { client, common, ui } = useStore();
    const { is_language_changing } = common;
    const { has_wallet } = client;
    const { is_mobile_language_menu_open, setMobileLanguageMenuOpen } = ui;

    const allowed_languages = Object.keys(getAllowedLanguages(UNSUPPORTED_LANGUAGES));

    const filtered_languages = has_wallet
        ? allowed_languages.filter(lang => lang === 'EN' || lang === 'AR')
        : allowed_languages;

    return (
        <MobileDrawer.SubMenu
            is_expanded={is_mobile_language_menu_open}
            has_subheader
            submenu_title={localize('Select language')}
            onToggle={is_expanded => {
                expandSubMenu(is_expanded);
                setMobileLanguageMenuOpen(false);
            }}
            submenu_toggle_class='dc-mobile-drawer__submenu-toggle--hidden'
        >
            <div
                className={classNames('settings-language__language-container', {
                    'settings-language__language-container--disabled': is_language_changing,
                })}
            >
                {filtered_languages.map(lang => (
                    <LanguageLink
                        key={lang}
                        is_clickable
                        lang={lang}
                        toggleModal={() => {
                            toggleDrawer();
                            setMobileLanguageMenuOpen(false);
                        }}
                    />
                ))}
            </div>
        </MobileDrawer.SubMenu>
    );
});

export default MobileLanguageMenu;
