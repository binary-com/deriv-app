import classNames from 'classnames';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { usePrevious } from '../../hooks';
import Icon from '../icon/icon.jsx';

const SideNotes = ({ side_notes }) => {
    return (
        <div className='dc-vertical-tab__content-side-note'>
            {side_notes?.map((note, i) => (
                <div className='dc-vertical-tab__content-side-note-item' key={i}>
                    {note}
                </div>
            ))}
        </div>
    );
};

const ContentWrapper = ({ children, has_side_note }) => {
    if (has_side_note) {
        return <div className='dc-vertical-tab__content-inner'>{children}</div>;
    }
    return children;
};

const Content = ({ is_routed, items, selected }) => {
    const selected_item = items.find(item => item.label === selected.label);
    const previous_selected_item = usePrevious(selected_item);
    const TabContent = selected_item.value;
    const [side_notes, setSideNotes] = React.useState(null);

    let notes_array = [];

    const addToNotesQueue = notes => {
        notes_array.unshift(notes);
        setSideNotes(notes);
    };

    React.useEffect(() => {
        if (selected_item?.label !== previous_selected_item?.label) {
            if (selected_item?.label === 'Fiat onramp') {
                notes_array = [side_notes];
            } else {
                setSideNotes(notes_array[0] ?? null);
                notes_array.splice(0, notes_array.length);
            }
        }
    }, [selected_item]);

    return (
        <React.Fragment>
            {is_routed ? (
                <Switch>
                    {items.map(({ value, component, path, icon }, idx) => {
                        const Component = value || component;
                        return (
                            <Route
                                key={idx}
                                path={path}
                                render={() => <Component component_icon={icon} setSideNotes={addToNotesQueue} />}
                            />
                        );
                    })}
                </Switch>
            ) : (
                <TabContent key={selected_item.label} className='item-id' setSideNotes={addToNotesQueue} />
            )}
            {selected.has_side_note && (
                // for components that have side note, even if no note is passed currently,
                // we want to keep the column space for side note
                <SideNotes selected_item={selected_item} side_notes={side_notes} />
            )}
        </React.Fragment>
    );
};

const VerticalTabContentContainer = ({
    action_bar,
    action_bar_classname,
    className,
    id,
    is_floating,
    is_routed,
    items,
    selected,
    tab_container_classname,
}) => {
    return (
        <div
            className={classNames('dc-vertical-tab__content', {
                'dc-vertical-tab__content--floating': is_floating,
                [`dc-vertical-tab__content--${className}`]: className,
            })}
        >
            {!is_floating && action_bar && (
                <div
                    className={classNames('dc-vertical-tab__action-bar', {
                        [action_bar_classname]: !!action_bar_classname,
                    })}
                >
                    {action_bar.map(({ component, icon, onClick }, idx) => {
                        const Component = component;
                        return component ? (
                            <Component key={idx} />
                        ) : (
                            <div
                                id={`dt_${id}_close_icon`}
                                className='dc-vertical-tab__action-bar-wrapper'
                                key={idx}
                                onClick={onClick}
                            >
                                <Icon className='dc-vertical-tab__action-bar--icon' icon={icon} />
                            </div>
                        );
                    })}
                </div>
            )}
            <div className={classNames('dc-vertical-tab__content-container', tab_container_classname)}>
                <ContentWrapper has_side_note={selected.has_side_note}>
                    <Content is_routed={is_routed} items={items} selected={selected} />
                </ContentWrapper>
            </div>
        </div>
    );
};

export default VerticalTabContentContainer;
