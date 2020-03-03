import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@deriv/components';
import { localize } from 'Components/i18next';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { requestWS } from 'Utils/websocket';
import { RowComponent, BuySellRowLoader } from './row.jsx';

export class BuyTable extends React.Component {
    // TODO: Find a better solution for handling no-op instead of using is_mounted flags
    is_mounted = false;

    state = {
        api_error_message: '',
        is_loading: true,
        items: null,
    };

    componentDidMount() {
        this.is_mounted = true;

        requestWS({ p2p_advert_list: 1, counterparty_type: 'buy' }).then(response => {
            if (this.is_mounted) {
                if (!response.error) {
                    this.setState({ items: response, is_loading: false });
                } else {
                    this.setState({ is_loading: false, api_error_message: response.error.message });
                }
            }
        });
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    render() {
        const { api_error_message, is_loading, items } = this.state;
        const { setSelectedAd } = this.props;

        const Row = props => <RowComponent {...props} is_buy setSelectedAd={setSelectedAd} />;

        if (is_loading) return <Loading is_fullscreen={false} />;

        if (api_error_message) return <TableError message={api_error_message} />;

        return items.length ? (
            <InfiniteLoaderList
                // screen size - header size - footer size - page overlay header - page overlay content padding -
                // tabs height - padding+margin of tab content - toggle height - table header height
                initial_height={'calc(100vh - 48px - 36px - 41px - 2.4rem - 36px - 3.2rem - 40px - 52px)'}
                items={items}
                RenderComponent={Row}
                RowLoader={BuySellRowLoader}
            />
        ) : (
            <div className='deriv-p2p__empty'>
                {localize("No ads yet. If someone posts an ad, you'll see it here.")}
            </div>
        );
    }
}

BuyTable.propTypes = {
    setSelectedAd: PropTypes.func,
};
