import React, { useState } from 'react';
import { Button, DesktopWrapper, Icon, Text } from '@deriv/components';
import { motion } from 'framer-motion';

export const variants = {
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            ease: 'easeOut',
            duration: 0.3,
        },
    },
    hide: {
        y: -30,
        opacity: 0,
        scale: 0.8,
    },
};

const WheelPicker = ({ options, onBarrierClick }) => {
    const [selectedIndex, setSelectedIndex] = useState(3);

    const handleIncrease = () => {
        if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
            onBarrierClick(options[selectedIndex - 1]);
        }
    };

    const handleDecrease = () => {
        if (selectedIndex < options.length - 1) {
            setSelectedIndex(selectedIndex + 1);
            onBarrierClick(options[selectedIndex + 1]);
        }
    };

    const getVisibleValues = () => {
        if (selectedIndex === 0) {
            return [null, options[0], options[1]];
        } else if (selectedIndex === options.length - 1) {
            return [options[options.length - 2], options[options.length - 1], null];
        }
        return options.slice(selectedIndex - 1, selectedIndex + 2);
    };

    const visibleValues = getVisibleValues();

    return (
        <DesktopWrapper>
            <div className='wheel-picker'>
                <div className='digits'>
                    {visibleValues.map((value: string, index: number) => (
                        <motion.div
                            key={value}
                            variants={variants}
                            initial='initial'
                            animate={selectedIndex === 1 ? 'animate' : 'initial'}
                        >
                            <Text
                                size={index === 1 ? 'xxs' : 'xxxs'}
                                line_height='l'
                                weight={index === 1 ? 'bolder' : 'bold'}
                                color={index === 1 ? 'default' : 'disabled-1'}
                                align='center'
                                as='p'
                                className={index === 1 ? 'selected-value' : ''}
                            >
                                {value !== null ? `${Number(value)} USD` : ''}
                            </Text>
                        </motion.div>
                    ))}
                </div>
                <div className='actions'>
                    <Button small className='icons' icon={<Icon icon='IcChevronUp' />} onClick={handleIncrease} />
                    <Button
                        small
                        className='icons'
                        icon={<Icon icon='IcChevronUp' className='chevron-up' />}
                        onClick={handleDecrease}
                    />
                </div>
            </div>
        </DesktopWrapper>
    );
};

export default WheelPicker;
