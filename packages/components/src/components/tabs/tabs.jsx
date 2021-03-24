import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Tab from './tab.jsx';
import { useConstructor } from '../../hooks';

const Tabs = ({
    active_icon_color,
    active_index,
    background_color,
    bottom,
    center,
    children,
    className,
    fit_content,
    has_active_line,
    has_bottom_line,
    header_fit_content,
    history,
    icon_color,
    icon_size,
    is_100vw,
    onTabItemClick,
    should_update_hash,
    single_tab_has_no_label,
    top,
}) => {
    const [active_line_style, updateActiveLineStyle] = React.useState({});
    const active_tab_ref = React.useRef();
    const tabs_wrapper_ref = React.useRef();
    const pushHash = hash => {
        history.replace(`${history.location.pathname}#${hash}`);
    };

    const setActiveLineStyle = React.useCallback(() => {
        const tabs_wrapper_bounds = tabs_wrapper_ref?.current?.getBoundingClientRect();
        const active_tab_bounds = active_tab_ref?.current?.getBoundingClientRect();
        if (tabs_wrapper_bounds && active_tab_bounds) {
            updateActiveLineStyle({
                left: active_tab_bounds.left - tabs_wrapper_bounds.left,
                width: active_tab_bounds.width,
            });
        } else {
            setTimeout(() => {
                setActiveLineStyle();
            }, 500);
        }
    }, []);

    let initial_index_to_show;
    useConstructor(() => {
        initial_index_to_show = active_index || 0;
        if (should_update_hash) {
            // if hash is in url, find which tab index correlates to it
            const hash = location.hash.slice(1);
            const hash_index = children.findIndex(child => child.props && child.props['data-hash'] === hash);
            const has_hash = hash_index > -1;

            if (has_hash) {
                initial_index_to_show = hash_index;
            } else {
                // if no hash is in url but component has passed data-hash prop, set hash of the tab shown
                const child_props = children[initial_index_to_show].props;
                const current_id = child_props && child_props['data-hash'];
                if (current_id) {
                    pushHash(current_id);
                }
            }
        }
        setActiveLineStyle();
    });

    const [active_tab_index, setActiveTabIndex] = React.useState(initial_index_to_show);

    React.useEffect(() => {
        if (active_tab_index >= 0 && active_index !== active_tab_index) {
            if (typeof onTabItemClick === 'function') {
                onTabItemClick(active_tab_index);
            }
        }
        setActiveLineStyle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active_tab_index, setActiveLineStyle]);

    React.useEffect(() => {
        if (active_index >= 0 && active_index !== active_tab_index) {
            setActiveTabIndex(active_index);
        }
    }, [active_index]);

    const onClickTabItem = index => {
        if (should_update_hash) {
            const hash = children[index].props['data-hash'];
            pushHash(hash);
        }
        setActiveTabIndex(index);
        setActiveLineStyle();
    };

    const valid_children = children.filter(child => child);
    const tab_width = fit_content ? '150px' : `${(100 / valid_children.length).toFixed(2)}%`;

    return (
        <div
            className={classNames('dc-tabs', {
                [`dc-tabs--${className}`]: className,
                'dc-tabs--top': top,
                'dc-tabs--100vw': is_100vw,
            })}
            style={{ '--tab-width': `${tab_width}`, background: background_color }}
        >
            <div className={classNames({ [`dc-tabs__list--header--${className}`]: className })}>
                <ul
                    className={classNames('dc-tabs__list', {
                        'dc-tabs__list--top': top,
                        'dc-tabs__list--border-bottom': has_bottom_line,
                        'dc-tabs__list--bottom': bottom,
                        'dc-tabs__list--center': center,
                        'dc-tabs__list--header-fit-content': header_fit_content,
                        [`dc-tabs__list--${className}`]: className,
                    })}
                    ref={tabs_wrapper_ref}
                >
                    {React.Children.map(children, (child, index) => {
                        if (!child) return null;
                        const { count, header_content, icon, label, id } = child.props;
                        return (
                            <Tab
                                active_icon_color={active_icon_color}
                                className={className}
                                count={count}
                                icon={icon}
                                icon_color={icon_color}
                                icon_size={icon_size}
                                is_active={index === active_tab_index}
                                key={label}
                                is_label_hidden={children.length === 1 && single_tab_has_no_label}
                                label={label}
                                id={id}
                                top={top}
                                bottom={bottom}
                                header_fit_content={header_fit_content}
                                active_tab_ref={index === active_tab_index ? active_tab_ref : null}
                                header_content={header_content}
                                onClick={() => onClickTabItem(index)}
                                setActiveLineStyle={setActiveLineStyle}
                            />
                        );
                    })}
                    {has_active_line && (
                        <span
                            className={classNames('dc-tabs__active-line', {
                                'dc-tabs__active-line--top': top,
                                'dc-tabs__active-line--bottom': bottom,
                                'dc-tabs__active-line--fit-content': fit_content,
                                'dc-tabs__active-line--header-fit-content': header_fit_content,
                                'dc-tabs__active-line--is-hidden': children.length === 1 && single_tab_has_no_label,
                            })}
                            style={active_line_style}
                        />
                    )}
                </ul>
            </div>
            <div
                className={classNames('dc-tabs__content', {
                    [`dc-tabs__content--${className}`]: className,
                })}
            >
                {React.Children.map(children, (child, index) => {
                    if (index !== active_tab_index) {
                        return undefined;
                    }
                    return child.props.children;
                })}
            </div>
        </div>
    );
};

Tabs.defaultProps = {
    has_active_line: true,
    has_bottom_line: true,
};

Tabs.propTypes = {
    active_icon_color: PropTypes.string,
    active_index: PropTypes.number,
    bottom: PropTypes.bool,
    center: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    fit_content: PropTypes.bool,
    has_bottom_line: PropTypes.bool,
    has_active_line: PropTypes.bool,
    header_fit_content: PropTypes.bool,
    history: PropTypes.object,
    icon_color: PropTypes.string,
    icon_size: PropTypes.number,
    is_100vw: PropTypes.bool,
    onTabItemClick: PropTypes.func,
    should_update_hash: PropTypes.bool,
    single_tab_has_no_label: PropTypes.bool,
    top: PropTypes.bool,
};

export default Tabs;
