import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

const ContractCardItem = ({ className, children, header, is_crypto, is_loss, is_won }) => {
    return (
        <div className={classNames('dc-contract-card-item', className)}>
            <div className='dc-contract-card-item__header'>{header}</div>
            <div
                className={classNames('dc-contract-card-item__body', {
                    'dc-contract-card-item__body--crypto': is_crypto,
                    'dc-contract-card-item__body--loss': is_loss,
                    'dc-contract-card-item__body--profit': is_won,
                })}
            >
                {children}
            </div>
        </div>
    );
};

ContractCardItem.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    header: PropTypes.string,
    is_crypto: PropTypes.bool,
    is_loss: PropTypes.bool,
    is_won: PropTypes.bool,
};

export default ContractCardItem;
