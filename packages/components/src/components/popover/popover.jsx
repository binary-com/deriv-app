import classNames                      from 'classnames';
import PropTypes                       from 'prop-types';
import React                           from 'react';
import TinyPopover, { ArrowContainer } from 'react-tiny-popover';
import Icon                            from '../icon';

class Popover extends React.PureComponent {
    constructor (props) {
        super(props);
        this.state = { is_open: false };
    }

    componentDidMount () {
        this.setState({ is_open: this.props.has_error });
    }

    toggleOpen = () => this.setState({ is_open: Boolean(this.props.message) });

    toggleClose = () => this.setState({ is_open: false });

    render () {
        const {
            alignment,
            children,
            className,
            classNameBubble,
            classNameTarget,
            classNameTargetIcon,
            counter,
            disable_message_icon,
            disable_target_icon,
            has_error,
            icon,
            id,
            is_open,
            margin,
            message,
            zIndex,
        } = this.props;

        const has_external_open_state = is_open !== undefined;
        const icon_class_name         = classNames(classNameTargetIcon, icon);
        return (
            <TinyPopover
                isOpen={has_external_open_state ? is_open : this.state.is_open}
                position={alignment}
                transitionDuration={0.25}
                padding={margin + 8}
                containerStyle={{ zIndex: (zIndex || 1) }}
                content={({ position, targetRect, popoverRect }) => (
                    <ArrowContainer
                        position={position}
                        targetRect={targetRect}
                        popoverRect={popoverRect}
                        arrowColor={has_error ? 'var(--status-danger)' : 'var(--general-active)'}
                        arrowSize={5}
                    >
                        <div
                            id={id}
                            className={classNames(
                                classNameBubble,
                                'dc-popover__bubble',
                                { 'dc-popover__bubble--error': has_error },
                            )}
                        >
                            { !disable_message_icon && icon === 'info' &&
                                <i className='dc-popover__bubble__icon'>
                                    <Icon icon='IcInfoBlue' />
                                </i>
                            }
                            <span className={classNames('dc-popover__bubble__text',{
                                'dc-popover__bubble__text--error': has_error,
                            })}
                            >
                                { message }
                            </span>
                        </div>
                    </ArrowContainer>
                )}
            >
                <div
                    className={classNames('dc-popover', className)}
                    id={id}
                    onMouseEnter={has_external_open_state ? undefined : this.toggleOpen}
                    onMouseLeave={has_external_open_state ? undefined : this.toggleClose}
                >
                    <div className={classNames(classNameTarget, 'dc-popover__target')}>
                        {!disable_target_icon &&
                        <i className={message ? 'dc-popover__target__icon' : 'dc-popover__target__icon--disabled'}>
                            {(icon === 'info')     && <Icon icon='IcInfoOutline' className={icon_class_name} />}
                            {(icon === 'question') && <Icon icon='IcUnknown' className={icon_class_name} />}
                            {(icon === 'dot')      && <Icon icon='IcCircle' className={icon_class_name} size={4} />}
                            {(icon === 'counter')  && <span className={icon_class_name}>{ counter }</span>}
                        </i>
                        }

                        {children}
                    </div>
                </div>
            </TinyPopover>
        );
    }
}

Popover.defaultProps = {
    portal_container: 'deriv_app',
    margin          : 0,
};

Popover.propTypes = {
    alignment           : PropTypes.string,
    children            : PropTypes.node,
    className           : PropTypes.string,
    classNameBubble     : PropTypes.string,
    classNameTarget     : PropTypes.string,
    classNameTargetIcon : PropTypes.string,
    counter             : PropTypes.number,
    disable_message_icon: PropTypes.bool,
    disable_target_icon : PropTypes.bool,
    has_error           : PropTypes.bool,
    icon                : PropTypes.oneOf(['info', 'question', 'dot', 'counter']),
    id                  : PropTypes.string,
    is_open             : PropTypes.bool,
    margin              : PropTypes.number,
    message             : PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    portal_container    : PropTypes.string,
};

export default Popover;
