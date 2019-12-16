import classNames           from 'classnames';
import PropTypes            from 'prop-types';
import React                from 'react';
import ReactDOM             from 'react-dom';
import posed, { PoseGroup } from 'react-pose';
import IconInfoBlue         from '../icon-info-blue.jsx';
import Text                 from '../text'

const FadeIn = posed.span({
    enter: {
        opacity   : 1,
        transition: {
            duration: 150,
        },
    },
    exit: {
        opacity   : 0,
        transition: {
            duration: 150,
        },
    },
});

class PopoverBubble extends React.PureComponent {
    calculatePosition = () => {
        const { alignment, target_rectangle, margin = 0 } = this.props;

        switch (alignment) {
            case 'top': return {
                left     : (target_rectangle.width / 2) + target_rectangle.left,
                bottom   : (window.innerHeight - target_rectangle.top) + margin,
                transform: 'translateX(-50%)',
            };
            case 'bottom': return {
                left     : (target_rectangle.width / 2) + target_rectangle.left,
                top      : target_rectangle.bottom + margin,
                transform: 'translateX(-50%)',
            };
            case 'left': return {
                right    : (window.innerWidth - target_rectangle.left) + margin,
                top      : (target_rectangle.height / 2) + target_rectangle.top,
                transform: 'translateY(-50%)',
            };
            case 'right': return {
                left     : target_rectangle.right + margin,
                top      : (target_rectangle.height / 2) + target_rectangle.top,
                transform: 'translateY(-50%)',
            };
            default: return {
                left: target_rectangle.left,
                top : target_rectangle.top,
            };
        }
    };

    render() {
        const {
            alignment,
            className,
            has_error,
            icon,
            id,
            is_open,
            message,
            target_rectangle,
            portal_container,
        } = this.props;

        if (!target_rectangle) return null;

        const popover_bubble = (
            <PoseGroup>
                { is_open &&
                <FadeIn key='fade_in' initialPose='exit' style={{ position: 'fixed', zIndex: 99999 }}>
                    <Text
                        as='span'
                        style={ target_rectangle ? this.calculatePosition() : {}}
                        data-popover-pos={alignment}
                        className={classNames(
                            className,
                            'dc-popover__bubble',
                            { 'dc-popover__bubble--error': has_error },
                        )}
                        id={id}
                        color='prominent'
                        small
                    >
                        { icon === 'info' &&
                            <i className='dc-popover__bubble__icon'>
                                <IconInfoBlue />
                            </i>
                        }
                        <Text className='dc-popover__bubble__text' small>
                            { message }
                        </Text>
                        <span className='dc-popover__bubble__arrow' />
                    </Text>
                </FadeIn>
                }
            </PoseGroup>
        );

        return ReactDOM.createPortal(
            popover_bubble,
            document.getElementById(portal_container)
        );
    }
}

PopoverBubble.propTypes = {
    alignment       : PropTypes.string,
    children        : PropTypes.node,
    className       : PropTypes.string,
    has_error       : PropTypes.bool,
    icon            : PropTypes.string,
    id              : PropTypes.string,
    is_open         : PropTypes.bool,
    margin          : PropTypes.number,
    message         : PropTypes.string.isRequired,
    target_rectangle: PropTypes.object,
};

export default PopoverBubble;
