import React from 'react';
import classNames from 'classnames';
import Text from '../text';

const Oval = ({ children }) => {
    return (
        <div className='dc-timeline__oval'>
            <Text color='colored-background' sizd='s' weight='bold' className='dc-timeline__number'>
                {children}
            </Text>
        </div>
    );
};

const Timeline = ({ children, disabled_items, ...props }) => {
    return (
        <div {...props}>
            {children.map((child, idx) => (
                <div
                    key={idx}
                    className={classNames('dc-timeline__flex', {
                        'dc-timeline__flex--no-border': children.length === idx + 1,
                        'dc-timeline__flex--disabled': disabled_items && disabled_items.includes(idx + 1),
                    })}
                >
                    <Oval>{idx + 1}</Oval>
                    <div className='dc-timeline__container'>
                        <Text as='h2' color='prominent' size='xs' className='dc-timeline__title'>
                            {child.props.item_title}
                        </Text>
                        <div className='dc-timeline__content'>{child}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Item = ({ children, ...props }) => <div {...props}>{children}</div>;

Timeline.Item = Item;

export default Timeline;
