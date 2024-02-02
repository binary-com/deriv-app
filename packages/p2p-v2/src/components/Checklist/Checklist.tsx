import React from 'react';
import { Button, Text, useDevice } from '@deriv-com/ui';
import ArrowRightIcon from '../../public/ic-arrow-right.svg';
import CheckmarkIcon from '../../public/ic-checkmark.svg';
import './Checklist.scss';

type TChecklistItem = {
    isDisabled?: boolean;
    onClick?: () => void;
    status: string;
    text: string;
};

const Checklist = ({ items }: { items: TChecklistItem[] }) => {
    const { isMobile } = useDevice();
    return (
        <div className='p2p-v2-checklist'>
            {items.map(item => (
                <div className='p2p-v2-checklist__item' key={item.text}>
                    <Text color={item.isDisabled ? 'less-prominent' : 'general'} size={isMobile ? 'md' : 'sm'}>
                        {item.text}
                    </Text>
                    {item.status === 'done' ? (
                        <div className='p2p-v2-checklist__item-checkmark'>
                            <CheckmarkIcon className='p2p-v2-checklist__item-checkmark-icon' />
                        </div>
                    ) : (
                        <Button
                            className='p2p-v2-checklist__item-button'
                            disabled={item.isDisabled}
                            icon={<ArrowRightIcon className='p2p-v2-checklist__item-button-icon' />}
                            onClick={item.onClick}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default Checklist;
