import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Icon, Checklist, Text } from '@deriv/components';
import { isMobile, routes } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import Dp2pBlocked from 'Components/dp2p-blocked';
import { Localize } from 'Components/i18next';
import './verification.scss';

const VerificationWrapper = ({ should_wrap, children }) => {
    if (should_wrap) {
        return (
            <div
                className={classNames('dp2p-verification__wrapper', {
                    'dp2p-verification__wrapper--mobile': isMobile(),
                })}
            >
                {children}
            </div>
        );
    }

    return children;
};

const Verification = ({ should_wrap }) => {
    const { general_store } = useStores();

    if (!general_store.is_advertiser && general_store.poi_status === 'verified' && general_store.nickname) {
        return <Dp2pBlocked />;
    }

    const checklist_items = [
        {
            content: general_store.nickname || <Localize i18n_default_text='Choose your nickname' />,
            status: general_store.nickname ? 'done' : 'action',
            onClick: general_store.nickname ? () => {} : general_store.toggleNicknamePopup,
        },
        {
            content: general_store.poiStatusText(general_store.poi_status),
            is_disabled: general_store.poi_status !== 'verified' && !general_store.nickname,
            status: general_store.poi_status === 'verified' ? 'done' : 'action',
            onClick:
                general_store.poi_status === 'verified'
                    ? () => {}
                    : () => {
                          window.location.href = `${general_store.props.poi_url}?ext_platform_url=${routes.cashier_p2p}`;
                      },
        },
    ];

    return (
        <VerificationWrapper should_wrap={should_wrap}>
            <div className='dp2p-verification'>
                <Icon icon='IcCashierSendEmail' className='dp2p-verification__icon' size={102} />
                <div className='dp2p-verification__text'>
                    <div className='dp2p-verification__text-title'>
                        <Localize i18n_default_text='Please register with us!' />
                    </div>
                    <div className='dp2p-verification__text-description'>
                        <Text as='p' size='xs' line_height='s' align='center'>
                            <Localize i18n_default_text='To use Deriv P2P, you need to choose a display name (a nickname) and verify your identity.' />
                        </Text>
                    </div>
                </div>
                <Checklist className='dp2p-verification__checklist' items={checklist_items} />
            </div>
        </VerificationWrapper>
    );
};

Verification.propTypes = {
    should_wrap: PropTypes.bool,
};

export default observer(Verification);
