import React         from 'react';
import Localize      from 'App/Components/Elements/localize.jsx';
import { localize }  from 'App/i18n';
import Icon          from 'Assets/icon.jsx';
import Button        from 'deriv-components/src/components/button';

const FinishedSetCurrency = ({
    current,
    onCancel,
    onSubmit,
    prev,
}) => {
    const IconPrevCurrency = () => <Icon
        icon='IconAccountsCurrency'
        type={prev.toLowerCase()}
    />;
    const IconNextCurrency = () => <Icon
        icon='IconAccountsCurrency'
        type={current.toLowerCase()}
    />;
    const IconArrow        = () => <Icon
        icon='IconRedArrow'
    />;

    const IconWon          = ({ className }) => <Icon
        className={className}
        icon='IconWon'
    />;

    return (
        <div className='success-change'>
            <div className='success-change__icon-area'>
                <IconPrevCurrency />
                <IconArrow />
                <IconNextCurrency />
                <IconWon className='bottom-right-overlay' />
            </div>
            <div className='success-change__body-area'>
                <h2>
                    <Localize
                        i18n_default_text='Success!'
                    />
                </h2>
                <p>
                    <Localize
                        i18n_default_text={`You have successfully changed your currency to ${current}.<br />Make a deposit now to start trading.`}
                    />
                </p>
            </div>
            <div className='success-change__btn-area'>
                <Button
                    onClick={onCancel}
                    className='btn--secondary--default'
                    text={localize('Maybe later')}
                />
                <Button
                    onClick={onSubmit}
                    className='btn--primary--default'
                    text={localize('Deposit now')}
                />
            </div>
        </div>
    );
};

export default FinishedSetCurrency;
