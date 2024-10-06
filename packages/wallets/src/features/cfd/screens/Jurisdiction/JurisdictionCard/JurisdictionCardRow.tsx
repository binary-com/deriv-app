import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv-com/ui';
import './JurisdictionCardRow.scss';

type TJurisdictionCardRowProps = {
    className: string;
    description?: React.ReactNode | string;
    renderTag?: () => React.ReactNode;
    title: string;
};

const JurisdictionCardRow: React.FC<TJurisdictionCardRowProps> = ({ className, description, renderTag, title }) => {
    return (
        <div className={classNames('wallets-jurisdiction-card-row', className)}>
            <div className='wallets-jurisdiction-card-row__header'>
                <Text align='start' size='sm' weight='bold'>
                    {title}
                </Text>
                {renderTag && <div className='wallets-jurisdiction-card-row__header-tag'>{renderTag()}</div>}
            </div>
            {description && (
                <Text align='start' size='xs'>
                    {description}
                </Text>
            )}
        </div>
    );
};

export default JurisdictionCardRow;
