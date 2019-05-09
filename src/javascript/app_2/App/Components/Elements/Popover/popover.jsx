import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { Icon }            from 'Assets/Common/icon.jsx';
import { IconInfoOutline } from 'Assets/Common/icon-info-outline.jsx';
import { IconQuestion }    from 'Assets/Common/icon-question.jsx';
import { IconRedDot }      from 'Assets/Common/icon-red-dot.jsx';
import PopoverBubble       from './popover-bubble.jsx';

class Popover extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_open         : false,
            target_rectangle: null,
        };
        this.target_reference = React.createRef();
    }

    componentDidMount() {
        this.setState({ target_rectangle: this.target_reference.current.getBoundingClientRect() });
    }

    toggleIsOpen = () => {
        this.setState({
            is_open         : !this.state.is_open,
            target_rectangle: this.target_reference.current.getBoundingClientRect(),
        });
    }

    render() {
        const {
            alignment,
            children,
            classNameBubble,
            classNameTarget,
            classNameTargetIcon,
            has_error,
            icon,
            margin,
            message,
        } = this.props;

        return (
            <div
                className='popover'
                onMouseEnter={this.toggleIsOpen}
                onMouseLeave={this.toggleIsOpen}
            >
                <div className={classNames(classNameTarget, 'popover__target')} ref={this.target_reference}>
                    {(icon === 'info') && <Icon icon={IconInfoOutline} className={classNames(classNameTargetIcon, icon)} /> }
                    {(icon === 'question') && <Icon icon={IconQuestion} className={classNames(classNameTargetIcon, icon)} />}
                    {(icon === 'dot')      && <Icon icon={IconRedDot} className={classNames(classNameTargetIcon, icon)} />}

                    { children }
                </div>

                { message &&
                    <PopoverBubble
                        alignment={alignment}
                        className={classNameBubble}
                        has_error={has_error}
                        icon={icon}
                        is_open={(has_error || this.state.is_open) && Boolean(this.state.target_rectangle)}
                        target_rectangle={this.state.target_rectangle}
                        margin={margin}
                        message={message}
                    />
                }
            </div>
        );
    }
}

Popover.propTypes = {
    alignment          : PropTypes.string,
    children           : PropTypes.node,
    classNameBubble    : PropTypes.string,
    classNameTarget    : PropTypes.string,
    classNameTargetIcon: PropTypes.string,
    has_error          : PropTypes.bool,
    icon               : PropTypes.string,
    margin             : PropTypes.number,
    message            : PropTypes.string.isRequired,
};

export default Popover;
