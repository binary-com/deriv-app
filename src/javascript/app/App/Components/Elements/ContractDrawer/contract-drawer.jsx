import classNames            from 'classnames';
import PropTypes             from 'prop-types';
import React, { Component }  from 'react';
import { withRouter }        from 'react-router';
<<<<<<< HEAD
import Localize              from 'App/Components/Elements/localize.jsx';
import Icon                  from 'Assets/Common';
import routes                from 'Constants/routes';
=======
import { Icon, IconBack }    from 'Assets/Common';
import Localize              from 'App/Components/Elements/localize.jsx';
import { UnderlyingIcon }    from 'App/Components/Elements/underlying-icon.jsx';
import ContractAudit         from 'App/Components/Elements/PositionsDrawer/result-details.jsx';
import ContractTypeCell      from 'App/Components/Elements/PositionsDrawer/contract-type-cell.jsx';
>>>>>>> e79bd60f02f95b61175386c2f75292b1bb035f9e
import ProfitLossCardContent from 'Modules/Reports/Components/profit-loss-card-content.jsx';
import ContractCardBody      from './contract-card-body.jsx';
import ContractCardFooter    from './contract-card-footer.jsx';
import ContractCardHeader    from './contract-card-header.jsx';
import ContractCard          from './contract-card.jsx';
import {
    getDurationPeriod,
    getDurationTime,
    getDurationUnitText }    from '../../../../Stores/Modules/Portfolio/Helpers/details';
import {
    getEndTime,
    isUserSold }             from '../../../../Stores/Modules/Contract/Helpers/logic';
import Money                 from '../money.jsx';

class ContractDrawer extends Component {
    state = {
        is_shade_on: false,
    }

    handleShade = (shade) => {
        this.setState({ is_shade_on: shade });
    }

    getBodyContent () {
        const {
            buy_price,
            currency,
            exit_tick,
            is_sold,
            profit,
            sell_price,
        } = this.props.contract_info;
        const { contract_info } = this.props;
        const exit_spot = isUserSold(contract_info) ? '-' : exit_tick;
        return (
            <ContractCard contract_info={contract_info}>
                <ContractCardHeader>
                    <div className={classNames(
                        'contract-card__grid',
                        'contract-card__grid-underlying-trade'
                    )}
                    >
                        <div className='contract-card__underlying-name'>
                            <UnderlyingIcon market={contract_info.underlying} />
                            <span className='contract-card__symbol'>
                                {contract_info.display_name}
                            </span>
                        </div>
                        <div className='contract-card__type'>
                            <ContractTypeCell type={contract_info.contract_type} />
                        </div>
                    </div>
                </ContractCardHeader>
                <ContractCardBody>
                    <ProfitLossCardContent
                        pl_value={+profit}
                        payout={+sell_price}
                        currency={currency}
                    />
                </ContractCardBody>
                <ContractCardFooter>
                    <div className='purchase-price-container'>
                        <Localize str='Purchase Price:' />&nbsp;
                        <span className='purchase-price' >
                            <Money
                                currency={currency}
                                amount={buy_price}
                            />
                        </span>
                    </div>
                    <ContractAudit
                        contract_info={contract_info}
                        contract_end_time={getEndTime(contract_info)}
                        is_open={true}
                        is_shade_visible={this.handleShade}
                        duration={getDurationTime(contract_info)}
                        duration_unit={getDurationUnitText(getDurationPeriod(contract_info))}
                        exit_spot={exit_spot}
                        has_result={!!(is_sold)}
                    />
                </ContractCardFooter>
            </ContractCard>
        );
    }

    render() {
        if (!this.props.contract_info) return null;
        const body_content = this.getBodyContent();
        return (
            <div className={classNames('contract-drawer', {})}>
                <div
                    className='contract-drawer__heading'
                    onClick={() => this.props.history.goBack()}
                >
                    <Icon icon='IconBack' />
                    <h2><Localize str={this.props.heading || 'Contract'} /></h2>
                </div>
                <div className='contract-drawer__body'>{body_content}</div>
            </div>
        );
    }
}

ContractDrawer.propTypes = {
    contract_info: PropTypes.object,
    heading      : PropTypes.string,
};

export default withRouter(ContractDrawer);
