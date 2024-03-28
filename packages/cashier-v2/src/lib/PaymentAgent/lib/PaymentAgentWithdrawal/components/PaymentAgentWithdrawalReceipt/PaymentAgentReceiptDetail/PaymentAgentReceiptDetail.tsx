import React, { Children } from 'react';
import { IconTypes } from '@deriv/quill-icons';
import { Text, useDevice } from '@deriv-com/ui';
import styles from './PaymentAgentReceiptDetail.module.scss';

type TProps = {
    action?: string;
    children: React.ReactNode;
    icon: IconTypes | React.ComponentType<React.SVGAttributes<SVGElement>>;
    shouldOpenInNewTab?: boolean;
};

const PaymentAgentReceiptDetail: React.FC<TProps> = ({ action, children, icon: Icon, shouldOpenInNewTab = false }) => {
    const { isMobile } = useDevice();

    return (
        <div className={styles.container}>
            <div className={styles['icon-wrapper']}>
                <Icon data-testid='dt_detail_icon' iconSize='sm' />
            </div>
            <div className={styles['details-wrapper']}>
                {Children.toArray(children).map((child, id, array) => {
                    const href = action ? `${action}:${child}` : `${child}`;
                    return (
                        <Text key={id} size={isMobile ? 'sm' : 'xs'}>
                            <a
                                href={href}
                                {...(shouldOpenInNewTab && {
                                    rel: 'noopener noreferrer',
                                    target: '_blank',
                                })}
                            >
                                {child}
                                {id === array.length - 1 ? '' : ', '}
                            </a>
                        </Text>
                    );
                })}
            </div>
        </div>
    );
};

export default PaymentAgentReceiptDetail;
