import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../icon';
import Text from '../../text';

const AppCardHeader = ({ card_labels, is_swap_free, onAddRealClick }) => (
    <div className='dc-app-card-header__wrapper'>
        <div className='dc-app-card-header__container'>
            <div className={classNames('dc-app-card__badge', 'dc-app-card-header__badge--demo')}>
                <Text color='general' size='xxxxs' weight='bold'>
                    {card_labels.DEMO}
                </Text>
            </div>
            {is_swap_free && (
                <div className={classNames('dc-app-card__badge', 'dc-app-card-header__badge--swap-free')}>
                    <Text color='colored-background' size='xxxxs' weight='bold'>
                        {card_labels.SWAP_FREE}
                    </Text>
                </div>
            )}
        </div>
        <div
            className={classNames('dc-app-card__badge', 'dc-app-card-header__badge--add-real')}
            onClick={onAddRealClick}
        >
            <Icon
                className='dc-app-card-header__badge--add-real-icon'
                icon='IcAddRounded'
                custom_color='var(--icon-dark-background)'
                size={8}
            />
            <Text
                className='dc-app-card-header__badge--add-real-text'
                color='colored-background'
                size='xxxs'
                weight='bold'
            >
                {card_labels.ENABLE}
            </Text>
        </div>
    </div>
);

AppCardHeader.propTypes = {
    card_labels: PropTypes.object,
    is_swap_free: PropTypes.bool,
    onAddRealClick: PropTypes.func,
};

export default AppCardHeader;
