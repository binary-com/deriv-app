import classNames            from 'classnames';
import React                 from 'react';
import PropTypes             from 'prop-types';
import { connect }           from 'Stores/connect';
import ContractResultOverlay from './contract-result-overlay.jsx';
import '../assets/sass/trade-animation.scss';

const CircularWrapper = ({ className }) => (
    <div className={classNames(
        'circular-wrapper',
        className
    )}
    >
        <span className='static-circle' />
        <span className='dynamic-circle' />
    </div>
);

const TradeAnimation = ({
    className,
    contract_stage,
    is_contract_completed,
    profit,
    should_show_overlay,
}) => {
    const { index, text } = contract_stage;
    const status_classes  = ['', '', ''];
    let progress_status   = index - ((index === 2 || index === 3) ? 2 : 3);

    if (progress_status >= 0) {
        if (progress_status < status_classes.length) {
            status_classes[progress_status] =  'active';
        }

        if (is_contract_completed) {
            progress_status += 1;
        }
    
        for (let i = 0; i < progress_status; i++) {
            status_classes[i] = 'completed';
        }
    }
        
    return (
        <div className={classNames(
            'animation__container',
            className,
            {
                'animation--running'  : index > 0,
                'animation--completed': should_show_overlay && is_contract_completed,
            },
        )}
        >
            { should_show_overlay && is_contract_completed && <ContractResultOverlay profit={profit} /> }
            <span className='animation__text'>
                { text }
            </span>
            <div className='animation__progress'>
                <div className='animation__progress-line' >
                    <div className={`animation__progress-bar animation__progress-${index}`} />
                </div>
                {
                    status_classes.map((status_class, i) =>
                        <CircularWrapper key={i} className={status_class} />
                    )
                }
            </div>
        </div>
    );
    
};

TradeAnimation.propTypes = {
    className            : PropTypes.string,
    contract_stage       : PropTypes.object,
    is_contract_completed: PropTypes.bool,
    profit               : PropTypes.number,
    should_show_overlay  : PropTypes.bool,
};

export default connect(({ run_panel, contract_card }) => ({
    contract_stage       : run_panel.contract_stage,
    is_contract_completed: contract_card.is_contract_completed,
    profit               : contract_card.profit,
    should_show_overlay  : run_panel.should_show_overlay,
}))(TradeAnimation);
