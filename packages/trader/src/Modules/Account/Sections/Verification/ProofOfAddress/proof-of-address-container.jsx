// // import PropTypes            from 'prop-types';
import React              from 'react';
import { WS }             from 'Services';
import ProofOfAddressForm from './proof-of-address-form.jsx';
import {
    Expired,
    NeedsReview,
    Submitted,
    Verified,
    Unverified }          from './proof-of-address-messages.jsx';
import Loading            from '../../../../../templates/app/components/loading.jsx';

const poa_status_codes = {
    none     : 'none',
    pending  : 'pending',
    rejected : 'rejected',
    verified : 'verified',
    expired  : 'expired',
    suspected: 'suspected',
};

class ProofOfAddressContainer extends React.Component {
    state = {
        is_loading   : true,
        has_poi      : false,
        submitted_poa: false,
        resubmit_poa : false,
    };

    componentDidMount(){
        WS.authorized.getAccountStatus().then(response => {
            const { get_account_status } = response;
            const { document, identity } = get_account_status.authentication;
            const has_poi = !!(identity && identity.status === 'none');
            this.setState({ status: document.status, has_poi, is_loading: false });
            this.props.refreshNotifications();
        });
    }

    handleResubmit = () => {
        this.setState({ resubmit_poa: true });
    }

    onSubmit = ({ has_poi }) => {
        this.setState({ submitted_poa: true, has_poi });
    }

    render() {
        const {
            is_loading,
            has_poi,
            resubmit_poa,
            status,
            submitted_poa,
        } = this.state;

        if (is_loading)    return <Loading is_fullscreen={false} className='account___intial-loader' />;
        if (resubmit_poa)  return <ProofOfAddressForm onSubmit={this.onSubmit} />;
        if (submitted_poa) return <Submitted has_poi={has_poi} />;

        switch (status) {
            case poa_status_codes.none:
                return <ProofOfAddressForm onSubmit={this.onSubmit} />;
            case poa_status_codes.pending:
                return <NeedsReview />;
            case poa_status_codes.verified:
                return <Verified has_poi={has_poi} />;
            case poa_status_codes.expired:
                return <Expired onClick={this.handleResubmit} />;
            case poa_status_codes.rejected:
                return <Unverified />;
            case poa_status_codes.suspected:
                return <Unverified />;
            default:
                return null;
        }
    }
}

export default ProofOfAddressContainer;
