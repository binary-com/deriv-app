import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, Icon, MobileWrapper, Money, Popover, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { getCurrencyDisplayCode, getLocalizedBasis, isMobile, getGrowthRatePercentage } from '@deriv/shared';
import CancelDealInfo from './cancel-deal-info.jsx';
import { vanilla_financials } from 'Constants/trade-categories';

const ValueMovement = ({ has_error_or_not_loaded, proposal_info, currency, has_increased, is_vanilla }) => (
    <div className='strike--value-container'>
        <div className={classNames('trade-container__price-info-value', { 'strike--info': is_vanilla })}>
            {!has_error_or_not_loaded && (
                <Money
                    amount={proposal_info.obj_contract_basis.value}
                    className={classNames('trade-container__price-info-currency', {
                        'strike--info__value': is_vanilla,
                    })}
                    currency={currency}
                    show_currency
                    should_format={!is_vanilla}
                />
            )}
        </div>
        <div className='trade-container__price-info-movement'>
            {!has_error_or_not_loaded && has_increased !== null && has_increased ? (
                <Icon icon='IcProfit' />
            ) : (
                <Icon icon='IcLoss' />
            )}
        </div>
    </div>
);

const ContractInfo = ({
    basis,
    currency,
    has_increased,
    is_loading,
    is_accumulator,
    is_multiplier,
    is_vanilla,
    should_fade,
    proposal_info,
    type,
    symbol,
}) => {
    const localized_basis = getLocalizedBasis();
    const vanilla_payout_text = vanilla_financials.includes(symbol)
        ? localize('Payout per pip')
        : localize('Payout per point');

    const stakeOrPayout = () => {
        switch (basis) {
            case 'stake': {
                if (is_vanilla) {
                    return vanilla_payout_text;
                }
                return localized_basis.payout;
            }
            case 'payout': {
                return localized_basis.stake;
            }
            default:
                return basis;
        }
    };

    const setBasisText = () => {
        if (is_vanilla) {
            return vanilla_payout_text;
        }
        return proposal_info.obj_contract_basis?.text;
    };

    const has_error_or_not_loaded = proposal_info.has_error || !proposal_info.id;

    const basis_text = has_error_or_not_loaded ? stakeOrPayout() : setBasisText();

    const { message, obj_contract_basis, stake } = proposal_info;

    const setHintMessage = () => {
        if (['VANILLALONGCALL', 'VANILLALONGPUT'].includes(type)) {
            return (
                <Localize
                    i18n_default_text='<0>For {{title}}:</0> Your payout will grow by this amount for every {{unit}} {{trade_type}} your strike price. You will start making a profit when the payout is higher than your stake.'
                    components={[<strong key={0} />]}
                    values={{
                        trade_type: type === 'VANILLALONGCALL' ? localize('above') : localize('below'),
                        title: type === 'VANILLALONGCALL' ? localize('Call') : localize('Put'),
                        unit: vanilla_financials.includes(symbol) ? localize('pip') : localize('point'),
                    }}
                />
            );
        }
        return message;
    };

    return (
        <div className='trade-container__price'>
            <div
                id={`dt_purchase_${type.toLowerCase()}_price`}
                className={classNames('trade-container__price-info', {
                    'trade-container__price-info--disabled': has_error_or_not_loaded,
                    'trade-container__price-info--slide': is_loading && !should_fade,
                    'trade-container__price-info--fade': is_loading && should_fade,
                })}
            >
                {(is_multiplier || is_accumulator) && (
                    <React.Fragment>
                        {!is_accumulator && (
                            <DesktopWrapper>
                                <CancelDealInfo proposal_info={proposal_info} />
                            </DesktopWrapper>
                        )}
                        <MobileWrapper>
                            <div className='trade-container__price-info-wrapper'>
                                <div className='btn-purchase__text_wrapper'>
                                    <Text size='xs' weight='bold' color='colored-background'>
                                        {!is_accumulator ? (
                                            <Money amount={stake} currency={currency} show_currency />
                                        ) : (
                                            !is_loading && `${getGrowthRatePercentage(proposal_info?.growth_rate)}%`
                                        )}
                                    </Text>
                                </div>
                            </div>
                        </MobileWrapper>
                    </React.Fragment>
                )}
                {is_vanilla && isMobile() && (
                    <React.Fragment>
                        <MobileWrapper>
                            <div
                                className={classNames('trade-container__price-info-basis', {
                                    'trade-container__price-info-strike': is_vanilla,
                                })}
                            >
                                {basis_text}
                                <div className='trade-container__price-info-vanilla'>
                                    <div
                                        className={classNames('trade-container__price-info-wrapper', {
                                            'strike--info__wrapper': is_vanilla,
                                        })}
                                    >
                                        <ValueMovement
                                            has_error_or_not_loaded={has_error_or_not_loaded}
                                            proposal_info={proposal_info}
                                            currency={getCurrencyDisplayCode(currency)}
                                            has_increased={has_increased}
                                            is_vanilla={is_vanilla}
                                        />
                                    </div>
                                    <Popover
                                        alignment='left'
                                        classNameBubble='trade-container__price-info-modal--vanilla'
                                        classNameWrapper='trade-container__price-info-modal-wrapper'
                                        icon='info'
                                        id='dt_vanilla-stake__tooltip'
                                        zIndex={9999}
                                        message={
                                            <Localize
                                                i18n_default_text='<0>For {{title}}:</0> Your payout will grow by this amount for every {{unit}} {{trade_type}} your strike price. You will start making a profit when the payout is higher than your stake.'
                                                components={[<strong key={0} />]}
                                                values={{
                                                    trade_type:
                                                        type === 'VANILLALONGCALL'
                                                            ? localize('above')
                                                            : localize('below'),
                                                    title:
                                                        type === 'VANILLALONGCALL' ? localize('Call') : localize('Put'),
                                                    unit: vanilla_financials.includes(symbol) ? localize('pip') : localize('point'),
                                                }}
                                            />
                                        }
                                    />
                                </div>
                            </div>
                        </MobileWrapper>
                    </React.Fragment>
                )}
                {!is_multiplier && !is_accumulator && !(is_vanilla && isMobile()) && obj_contract_basis && (
                    <React.Fragment>
                        <div
                            className={classNames('trade-container__price-info-basis', {
                                'trade-container__price-info-strike': is_vanilla,
                            })}
                        >
                            {basis_text}
                        </div>
                        <DesktopWrapper>
                            <ValueMovement
                                has_error_or_not_loaded={has_error_or_not_loaded}
                                proposal_info={proposal_info}
                                currency={getCurrencyDisplayCode(currency)}
                                has_increased={has_increased}
                                is_vanilla={is_vanilla}
                            />
                        </DesktopWrapper>
                        <MobileWrapper>
                            <div
                                className={classNames('trade-container__price-info-wrapper', {
                                    'strike--info': is_vanilla,
                                })}
                            >
                                <ValueMovement
                                    has_error_or_not_loaded={has_error_or_not_loaded}
                                    proposal_info={proposal_info}
                                    currency={getCurrencyDisplayCode(currency)}
                                    has_increased={has_increased}
                                    is_vanilla={is_vanilla}
                                />
                            </div>
                        </MobileWrapper>
                    </React.Fragment>
                )}
            </div>
            {!is_multiplier && !is_accumulator && (
                <DesktopWrapper>
                    <Popover
                        alignment='left'
                        icon='info'
                        id={`dt_purchase_${type.toLowerCase()}_info`}
                        is_bubble_hover_enabled
                        margin={216}
                        message={has_error_or_not_loaded ? '' : setHintMessage()}
                        relative_render
                    />
                </DesktopWrapper>
            )}
        </div>
    );
};

ContractInfo.propTypes = {
    basis: PropTypes.string,
    currency: PropTypes.string,
    has_increased: PropTypes.bool,
    is_accumulator: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    is_vanilla: PropTypes.bool,
    is_loading: PropTypes.bool,
    proposal_info: PropTypes.object,
    should_fade: PropTypes.bool,
    type: PropTypes.string,
};

export default ContractInfo;
