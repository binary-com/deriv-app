import React from 'react';
import { LinearProgressBar } from '@deriv-com/ui';
import { QsSteps } from './trade-constants';
import { localize } from '@deriv/translations';

type TQSStepper = {
    current_step: QsSteps;
    is_mobile?: boolean;
};

const QSStepper = ({ current_step, is_mobile = false }: TQSStepper) => {
    const items = [
        { name: 'strategy_template', label: 'Strategy template' },
        { name: 'trade_parameters', label: 'Trade parameters' },
    ];

    const percentage = current_step === QsSteps.StrategyCompleted ? 100 : 50;

    return is_mobile ? (
        <LinearProgressBar percentage={percentage} label='' danger_limit={101} is_loading={false} warning_limit={0} />
    ) : (
        <React.Fragment>
            {items.map(item => (
                <label key={item.name}>{localize(item.label)}</label>
            ))}
            <div>{`current_step: ${current_step}`}</div>
        </React.Fragment>
    );
};

export default QSStepper;
