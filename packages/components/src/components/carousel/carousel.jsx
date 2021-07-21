import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { Swipeable } from 'react-swipeable';
import Card from './carousel-card.jsx';
import Nav from './carousel-nav.jsx';
import Icon from '../icon';
import { useInterval } from '../../hooks';

const Carousel = ({
    active_bullet_color,
    autoplay_time,
    bullet_color,
    bullet_position,
    className,
    initial_index,
    is_mt5,
    item_per_window,
    list,
    nav_position,
    onItemSelect,
    show_bullet,
    show_nav,
    width,
}) => {
    const [active_index, setActiveIndex] = React.useState(initial_index);
    const computed_item_per_window = React.useMemo(() => {
        return Math.min(item_per_window, list.length);
    }, [item_per_window, list]);
    const sliced_list_length = list.slice(computed_item_per_window - 1).length;

    React.useEffect(() => {
        if (list.slice(computed_item_per_window - 1).length <= 1) {
            setActiveIndex(0);
        }
    }, [list]);

    const handleNextClick = () => {
        const next_idx = active_index + 1;
        const has_reached_end = next_idx === list.length - computed_item_per_window + 1;

        if (!has_reached_end) {
            setActiveIndex(next_idx);
        } else {
            setActiveIndex(0);
        }
    };

    const handlePrevClick = () => {
        const prev_idx = active_index - 1;

        if (prev_idx > -1) {
            setActiveIndex(prev_idx);
        } else {
            setActiveIndex(list.length - computed_item_per_window);
        }
    };

    useInterval(handleNextClick, autoplay_time);

    React.useEffect(() => {
        if (typeof onItemSelect === 'function') onItemSelect(active_index, list);
    }, [active_index, list, onItemSelect]);

    return (
        <Swipeable onSwipedLeft={handleNextClick} onSwipedRight={handlePrevClick} className={className}>
            <div className={classNames('dc-carousel', { 'dc-carousel--mt5': is_mt5 })}>
                {sliced_list_length > 1 && (
                    <Nav
                        active_index={active_index}
                        bullet_color={bullet_color}
                        active_bullet_color={active_bullet_color}
                        className='dc-carousel__nav--upper'
                        handleNextClick={handleNextClick}
                        handlePrevClick={handlePrevClick}
                        handleNavigationClick={setActiveIndex}
                        show_bullet={show_bullet && bullet_position === 'top'}
                        show_nav={show_nav && nav_position === 'top'}
                        list={list}
                        item_per_window={computed_item_per_window}
                    />
                )}
                <div className='dc-carousel__container'>
                    {show_nav && nav_position === 'middle' && sliced_list_length > 1 && (
                        <span
                            className={classNames('dc-carousel__icon', { 'dc-carousel__icon--mt5': is_mt5 })}
                            onClick={handlePrevClick}
                        >
                            <Icon
                                icon={is_mt5 ? 'IcChevronLeftBoldMt5' : 'IcChevronLeft'}
                                size={is_mt5 ? '28' : '24'}
                            />
                        </span>
                    )}

                    <div
                        className={classNames('dc-carousel__box', {
                            'dc-carousel__box--mt5': is_mt5 && sliced_list_length > 1,
                        })}
                        style={{
                            width: `${computed_item_per_window * width}px`,
                        }}
                    >
                        <div
                            className={classNames('dc-carousel__wrapper', { 'dc-carousel__wrapper--mt5': is_mt5 })}
                            style={{ transform: `translate3d(-${width * active_index}px, 0, 0)` }}
                        >
                            {list.map((type, idx) => (
                                <Card key={idx} width={width}>
                                    {list[idx]}
                                </Card>
                            ))}
                        </div>
                    </div>

                    {show_nav && nav_position === 'middle' && sliced_list_length > 1 && (
                        <span
                            className={classNames('dc-carousel__icon', { 'dc-carousel__icon--mt5': is_mt5 })}
                            onClick={handleNextClick}
                        >
                            <Icon
                                icon={is_mt5 ? 'IcChevronRightBoldMt5' : 'IcChevronRight'}
                                size={is_mt5 ? '28' : '24'}
                            />
                        </span>
                    )}
                </div>
                {sliced_list_length > 1 && (
                    <Nav
                        active_index={active_index}
                        bullet_color={bullet_color}
                        active_bullet_color={active_bullet_color}
                        className={classNames({ 'dc-carousel__nav--lower': list.length < 5 })}
                        handleNextClick={handleNextClick}
                        handlePrevClick={handlePrevClick}
                        handleNavigationClick={setActiveIndex}
                        show_bullet={show_bullet && bullet_position === 'bottom'}
                        show_nav={show_nav && nav_position === 'bottom'}
                        list={list}
                        item_per_window={computed_item_per_window}
                    />
                )}
            </div>
        </Swipeable>
    );
};

Carousel.defaultProps = {
    initial_index: 0,
    bullet_color: 'var(--text-less-prominent)',
    active_bullet_color: 'var(--text-prominent)',
    nav_position: 'bottom',
    bullet_position: 'bottom',
    show_bullet: true,
    show_nav: true,
    autoplay_time: null,
    width: 400,
    item_per_window: 1,
};
Carousel.propTypes = {
    className: PropTypes.string,
    onItemSelect: PropTypes.func,
    bullet_color: PropTypes.string,
    active_bullet_color: PropTypes.string,
    list: PropTypes.array,
    nav_position: PropTypes.oneOf(['top', 'middle', 'bottom']),
    show_nav: PropTypes.bool,
    bullet_position: PropTypes.oneOf(['top', 'bottom']),
    show_bullet: PropTypes.bool,
    autoplay_time: PropTypes.number,
    width: PropTypes.number,
};

export default Carousel;
