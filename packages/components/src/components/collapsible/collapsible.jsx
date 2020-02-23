import classNames from 'classnames';
import React, { useState, useEffect, Children } from 'react';
import { useSwipeable } from 'react-swipeable';
import { positionPropType } from './utils';
import ArrowButton from './arrow-button.jsx';

const swipe_config = {
    delta: 100,
    trackTouch: true,
    trackMouse: true,
};

const Collapsible = ({ as, is_collapsed, position = 'top', children }) => {
    const [is_open, expand] = useState(!is_collapsed);
    const [should_show_collapsible, setShouldShowCollapsible] = useState(false);
    const toggleExpand = () => expand(!is_open);
    const arrow_button = <ArrowButton is_open={is_open} position={position} onClick={toggleExpand} />;
    const CustomTag = as || 'div';
    const swipe_handlers = useSwipeable({
        onSwipedUp: () => !is_open && should_show_collapsible && expand(true),
        onSwipedDown: () => is_open && should_show_collapsible && expand(false),
        ...swipe_config,
    });

    useEffect(() => setShouldShowCollapsible(Children.toArray(children).some(({ props }) => 'collapsible' in props)));

    return (
        <CustomTag
            {...swipe_handlers}
            className={classNames('dc-collapsible', {
                'dc-collapsible--is-expanded': is_open,
                'dc-collapsible--is-collapsed': !is_open,
            })}
        >
            {should_show_collapsible && position === 'top' && arrow_button}
            <div className='dc-collapsible__content'>
                {Children.map(children, element => {
                    if (!element) return element;
                    const collapsed_class = classNames('dc-collapsible__item', element.props.className, {
                        'dc-collapsible__item--collapsed': 'collapsible' in element.props && !is_open,
                    });

                    const no_collapsible_props = { ...element.props };
                    if ('collapsible' in no_collapsible_props) delete no_collapsible_props.collapsible;

                    const props = {
                        ...no_collapsible_props,
                        className: collapsed_class,
                    };

                    return React.cloneElement(element, props);
                })}
            </div>
            {should_show_collapsible && position === 'bottom' && arrow_button}
        </CustomTag>
    );
};

Collapsible.propTypes = {
    ...positionPropType,
};

Collapsible.displayName = 'Collapsible';

export default Collapsible;
