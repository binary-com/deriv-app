import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Text } from '@deriv/components';

const CashierDefaultDetail = ({ detail_click, detail_contents, detail_description, detail_header, is_mobile }) => {
    return (
        <div className='cashier-default-detail'>
            <Text size='sm' weight='bold'>
                {detail_header}
            </Text>
            <div className='cashier-default-detail__div' onClick={detail_click}>
                <div className='cashier-default-detail__content'>
                    <Text size='xs' className='cashier-default-detail__text'>
                        {detail_description}
                    </Text>
                    <Icon icon='IcChevronRight' size={16} />
                </div>
                {detail_contents.map(content => (
                    <div key={content.title} className='cashier-default-detail__array'>
                        <Text size='xxs' weight='bold' color='less-prominent'>
                            {content.title}
                        </Text>
                        <div className={classNames({ 'cashier-default-detail__icons-array': !is_mobile })}>
                            {content.icons?.map(icon => (
                                <div key={icon} className='cashier-default-detail__icon'>
                                    <Icon icon={icon} height={40} width={40} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

CashierDefaultDetail.propTypes = {
    detail_click: PropTypes.func,
    detail_contents: PropTypes.array,
    detail_description: PropTypes.string,
    detail_header: PropTypes.string,
    is_mobile: PropTypes.bool,
};

export default CashierDefaultDetail;
