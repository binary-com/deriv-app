import PropTypes        from 'prop-types';
import React            from 'react';
import { connect }      from 'Stores/connect';
import CashierContainer from './Layout/cashier-container.jsx';

class Deposit extends React.Component {
    componentDidMount() {
        this.props.setActiveTab('deposit');
        this.props.onMount();
    }

    render() {
        return (
            <React.Fragment>
                {this.props.error_message ?
                    <p className='cashier__error'>{this.props.error_message}</p>
                    :
                    <CashierContainer
                        iframe_height={this.props.iframe_height}
                        iframe_url={this.props.iframe_url}
                        is_loading={this.props.is_loading}
                    />
                }
            </React.Fragment>
        );
    }
}

Deposit.propTypes = {
    error_message: PropTypes.string,
    iframe_height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    iframe_url  : PropTypes.string,
    is_loading  : PropTypes.bool,
    onMount     : PropTypes.func,
    setActiveTab: PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        error_message: modules.cashier.config.deposit.error_message,
        iframe_height: modules.cashier.config.deposit.iframe_height,
        iframe_url   : modules.cashier.config.deposit.iframe_url,
        is_loading   : modules.cashier.is_loading,
        onMount      : modules.cashier.onMountDeposit,
        setActiveTab : modules.cashier.setActiveTab,
    })
)(Deposit);
