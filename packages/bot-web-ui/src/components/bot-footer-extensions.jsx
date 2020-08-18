import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getDerivComLink } from '@deriv/shared';
import { tabs_title } from '../constants/bot-contents';
import { connect } from '../stores/connect';
import '../assets/sass/footer-extensions.scss';

const FooterTabs = ({ active_tab, setActiveTab }) => (
    <div className='footer_extensions'>
        {Object.keys(tabs_title).map(key => {
            const tab_title = tabs_title[key];
            return (
                <span
                    key={key}
                    className={classNames('footer_extensions__button', {
                        'footer_extensions__button--active': active_tab === tab_title,
                    })}
                    onClick={() => setActiveTab(tab_title)}
                >
                    {tab_title === tabs_title.WORKSPACE && <Localize i18n_default_text='Workspace' />}
                    {tab_title === tabs_title.CHART && <Localize i18n_default_text='Chart' />}
                </span>
            );
        })}
    </div>
);

const SecurityAndPrivacy = () => (
    <a
        className='footer__link'
        href={getDerivComLink('tnc/security-and-privacy.pdf')}
        rel='noopener noreferrer'
        target='_blank'
    >
        <Icon icon='IcSecurityAndPrivacy' />
    </a>
);

const BotFooterExtensions = ({ active_tab, populateFooterExtensions, setActiveTab }) => {
    React.useEffect(() => populateFooter());
    React.useEffect(() => () => populateFooterExtensions([]), []);

    const populateFooter = () => {
        populateFooterExtensions([
            {
                position: 'left',
                Component: () => <FooterTabs active_tab={active_tab} setActiveTab={setActiveTab} />,
            },
            {
                position: 'right',
                Component: SecurityAndPrivacy,
                has_right_separator: true,
            },
        ]);
    };

    return null;
};

BotFooterExtensions.propTypes = {
    active_tab: PropTypes.string,
    populateFooterExtensions: PropTypes.func,
    setActiveTab: PropTypes.func,
};

export default connect(({ ui, main_content }) => ({
    active_tab: main_content.active_tab,
    populateFooterExtensions: ui.populateFooterExtensions,
    setActiveTab: main_content.setActiveTab,
}))(BotFooterExtensions);
