import React, { useEffect, useState } from 'react';
import { Text } from '@deriv-com/quill-ui';
import clsx from 'clsx';

const StatsRow = ({
    rows,
    animation_class,
    is_moving_transaction,
    className,
}: {
    rows: number[];
    animation_class?: string;
    is_moving_transaction: boolean;
    className: string;
}) => {
    const [animationKey, setAnimationKey] = useState<number>(0);

    useEffect(() => {
        setAnimationKey(prevKey => prevKey + 1);
    }, [animation_class]);

    return (
        <>
            <div className={`${className}__stat`}>
                <Text
                    size='sm'
                    bold
                    className={animation_class}
                    data-testid='accumulator-first-stat'
                    color='quill-typography__color--prominent'
                    key={animationKey}
                >
                    {rows[0]}
                </Text>
            </div>
            {rows.slice(1)?.map((el: number, i: number) => (
                <div
                    key={i + 1}
                    className={clsx(`${className}__stat`, {
                        'slide-right': is_moving_transaction && i == 0,
                    })}
                >
                    <Text size='sm'>{el}</Text>
                </div>
            ))}
        </>
    );
};

export default StatsRow;
