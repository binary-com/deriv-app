import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

class FormProgress extends React.PureComponent {
    constructor(props) {
        super(props);
        this.el_completed_bar = React.createRef();
    }

    componentDidMount() {
        this.animateCompleteBar();
    }

    componentDidUpdate() {
        this.animateCompleteBar();
    }

    animateCompleteBar() {
        const el_first_identifier = document.querySelector('.identifier') || {
            offsetLeft: 0,
            clientWidth: 1,
        };
        const each = 100 / this.props.steps.length;
        this.el_completed_bar.current.style.width = `${this.props.current_step * each}%`;
        this.el_completed_bar.current.style.transform = `translateX(${
            el_first_identifier.offsetLeft + el_first_identifier.clientWidth / 2
        }px)`;
    }

    render() {
        const { current_step, steps } = this.props;
        return (
            <div className='dc-form-progress'>
                <div className='dc-form-progress__header'>
                    <h2>{steps[current_step].header.active_title}</h2>
                    <div className='dc-form-progress__steps'>
                        <div
                            className='dc-form-progress__steps--before'
                            style={{
                                width: `calc(100% * ${steps.length - 1} / ${steps.length})`,
                            }}
                        />
                        {steps.map((item, idx) => (
                            <div
                                key={idx + 1}
                                className={classNames('dc-form-progress__step', {
                                    'dc-form-progress__step--active': idx <= current_step,
                                    'dc-form-progress__step--current': idx === current_step,
                                })}
                            >
                                <span className='identifier'>{idx + 1}</span>
                                <p className='title'>{item.header.title}</p>
                            </div>
                        ))}
                        <div ref={this.el_completed_bar} className='dc-form-progress__steps--after' />
                    </div>
                </div>
            </div>
        );
    }
}

FormProgress.propTypes = {
    current_step: PropTypes.any,
    nextStep: PropTypes.any,
    prevStep: PropTypes.any,
    steps: PropTypes.array,
};

FormProgress.defaultProps = { steps: [] };

export default FormProgress;
