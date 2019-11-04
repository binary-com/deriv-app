import className       from 'classnames';
import {
    Money,
    Popover,
    ThemedScrollbars } from 'deriv-components';
import { PropTypes }   from 'prop-types';
import React           from 'react';
import {
    BuyPriceIcon,
    ExitSpotIcon,
    EntrySpotIcon,
    PendingIcon,
    RefrenceIdIcon,
    CompletedIcon }    from './Icons.jsx';
import IconTradeType   from './icon-trade-types.jsx';
import { connect }     from '../stores/connect';
import { translate }   from '../utils/tools';
import                      '../assets/sass/transactions.scss';

const Transaction = ({ contract }) => {
    return (
        <table className='transactions__item'>
            <tbody>
                <tr className='transactions__row'>
                    <td className='transactions__middle transactions__col'>
                        <Popover
                            className='transactions__inline transactions__top'
                            alignment='left'
                            message={contract.contract_type}
                        >
                            <IconTradeType
                                trade_type={contract.contract_type}
                            />
                        </Popover>
                        <div className='transactions__inline transactions__middle'>
                            <div className='transactions__margin-bottom'>
                                <Popover
                                    className='transactions__inline transactions__middle'
                                    alignment='left'
                                    message={translate('Refrence ID')}
                                >
                                    <RefrenceIdIcon className='transactions__middle' />
                                </Popover>
                                <div className='transactions__inline transactions__middle'>
                                    {contract.refrence_id}
                                </div>
                            </div>
                            <div>
                                <Popover
                                    className='transactions__inline transactions__middle'
                                    alignment='left'
                                    message={translate('Buy price')}
                                >
                                    <BuyPriceIcon className='transactions__middle' />
                                </Popover>

                                <Money
                                    amount={contract.buy_price}
                                    currency={contract.currency}
                                />
                            </div>
                        </div>
                    </td>
                    <td className='transactions__middle transactions__col'>
                        <div className='transactions__margin-bottom'>
                            <Popover
                                className='transactions__inline transactions__middle'
                                alignment='left'
                                message={translate('Entry spot')}
                            >
                                <EntrySpotIcon className='transactions__middle' />
                            </Popover>
                            <div className='transactions__inline transactions__middle'>
                                {contract.entry_spot}
                            </div>
                        </div>
                        <div>
                            <Popover
                                className='transactions__inline transactions__middle'
                                alignment='left'
                                message={translate('Exit spot')}
                            >
                                <ExitSpotIcon className='transactions__middle' />
                            </Popover>
                            <div className='transactions__inline transactions__middle'>
                                {contract.exit_spot}
                            </div>
                        </div>
                    </td>
                    <td className='transactions__col'>
                        <div
                            className={className(
                                'transactions__inline',
                                'transactions__middle',
                                [Math.sign(contract.profit) !== -1 ?
                                    'transactions__green' :
                                    'transactions__red'])}
                        >
                            <Money
                                amount={Math.abs(contract.profit)}
                                currency={contract.currency}
                            />
                        </div>

                    </td>
                    <td className='transactions__col'>
                        {
                            contract.is_completed ?
                                <Popover
                                    className='transactions__inline transactions__middle'
                                    alignment='left'
                                    message={translate('Completed')}
                                >
                                    <CompletedIcon className='transactions__middle' />
                                </Popover> :
                                <Popover
                                    className='transactions__inline transactions__middle'
                                    alignment='left'
                                    message={translate('Pending')}
                                >
                                    <PendingIcon className='transactions__middle' />
                                </Popover>}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

class Transactions extends React.PureComponent {
    componentWillUnmount() {
        this.props.onUnmount();
    }

    render() {
        const { contracts } = this.props;

        return (
            <div className='transactions'>
                <div className='transactions__header'>
                    <span className='transactions__header--col'>{translate('Trade information')}</span>
                    <span className='transactions__header--col'>{translate('Entry/Exit spot')}</span>
                    <span className='transactions__header--col'>{translate('Profit/Loss')}</span>
                </div>
                <div className='transactions__content'>
                    <ThemedScrollbars
                        autoHide
                        style={{ height: 'calc(100vh - 365px)' }}
                    >
                        {
                            contracts.map((contract, index) => {
                                return <Transaction
                                    key={`${contract.refrence_id}${index}`}
                                    contract={contract}
                                />;
                            })
                        }
                    </ThemedScrollbars>
                </div>
            </div>
        );
    }
}

Transactions.propTypes = {
    contracts: PropTypes.array,
    onUnmount: PropTypes.func,
};

export default connect(({ transactions }) => ({
    contracts: transactions.contracts,
    onUnmount: transactions.onUnmount,
}))(Transactions);
