import PropTypes            from 'prop-types';
import React                from 'react';
import { withRouter }       from 'react-router';
import { isEmptyObject }    from '_common/utility';
import ChartLoader          from 'App/Components/Elements/chart-loader.jsx';
import ContractDrawer       from 'App/Components/Elements/ContractDrawer';
import NotificationMessages from 'App/Containers/notification-messages.jsx';
import { connect }          from 'Stores/connect';
import Icon                 from 'Assets/icon.jsx';
import Localize             from 'App/Components/Elements/localize.jsx';
import AppRoutes            from 'Constants/routes';
import { localize }         from 'App/i18n';
import InfoBox              from './info-box.jsx';
import Digits               from './digits.jsx';

const SmartChart = React.lazy(() => import(/* webpackChunkName: "smart_chart" */'../../SmartChart'));

class ContractReplay extends React.Component {
    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    componentDidMount() {
        this.props.hidePositions();
        this.props.setChartLoader(true);
        this.props.showBlur();
        const url_contract_id = +/[^/]*$/.exec(location.pathname)[0];
        this.props.onMount(this.props.contract_id || url_contract_id);
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        this.props.hideBlur();
        this.props.onUnmount();
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)) {
            const classname_string = event.target.classList[0];
            if (/^.*(modal|btn|notification)/.test(classname_string)) {
                return;
            }
            this.props.history.push(AppRoutes.trade);
        }
    };

    render() {
        const action_bar_items = [
            {
                onClick: () => this.props.history.push(AppRoutes.trade),
                icon   : 'DialogIconClose',
                title  : localize('Close'),
            },
        ];

        const {
            config,
            contract_info,
            is_chart_loading,
            is_dark_theme,
            is_sell_requested,
            is_static_chart,
            onClickSell,
            status,
        } = this.props;

        return (
            <div className='trade-container__replay' ref={this.setWrapperRef}>
                <ContractDrawer
                    contract_info={contract_info}
                    heading={ <Localize i18n_default_text='Reports' /> }
                    is_dark_theme={is_dark_theme}
                    is_sell_requested={is_sell_requested}
                    onClickSell={onClickSell}
                    status={status}
                />
                <React.Suspense fallback={<div />}>
                    <div className='replay-chart__container'>
                        <div className='vertical-tab__action-bar'>
                            {
                                action_bar_items.map(({ icon, onClick, title }) => (
                                    <Icon
                                        className='vertical-tab__action-bar--icon'
                                        key={title}
                                        icon={icon}
                                        onClick={onClick}
                                    />
                                ))
                            }
                        </div>
                        <NotificationMessages />
                        <ChartLoader is_visible={is_chart_loading} />
                        {(!!(contract_info.underlying) && !isEmptyObject(config)) &&
                        <SmartChart
                            chartControlsWidgets={null}
                            Digits={<Digits />}
                            InfoBox={<InfoBox />}
                            is_contract_replay
                            is_static_chart={is_static_chart}
                            should_show_last_digit_stats={false}
                            symbol={contract_info.underlying}
                            {...config}
                        />
                        }
                    </div>
                </React.Suspense>
            </div>
        );
    }
}

ContractReplay.propTypes = {
    config          : PropTypes.object,
    contract_id     : PropTypes.number,
    contract_info   : PropTypes.object,
    hideBlur        : PropTypes.func,
    hidePositions   : PropTypes.func,
    history         : PropTypes.object,
    is_chart_loading: PropTypes.bool,
    is_dark_theme   : PropTypes.bool,
    is_static_chart : PropTypes.bool,
    location        : PropTypes.object,
    onMount         : PropTypes.func,
    onUnmount       : PropTypes.func,
    routes          : PropTypes.arrayOf(PropTypes.object),
    server_time     : PropTypes.object,
    setChartLoader  : PropTypes.func,
    showBlur        : PropTypes.func,
    status          : PropTypes.string,
};

export default withRouter(connect(
    ({ modules, ui }) => ({
        config           : modules.contract.replay_config,
        is_sell_requested: modules.contract.is_sell_requested,
        is_static_chart  : modules.contract.is_replay_static_chart,
        onClickSell      : modules.contract.onClickSell,
        onMount          : modules.contract.onMountReplay,
        onUnmount        : modules.contract.onUnmountReplay,
        contract_info    : modules.contract.replay_info,
        status           : modules.contract.replay_indicative_status,
        is_chart_loading : modules.smart_chart.is_chart_loading,
        setChartLoader   : modules.smart_chart.setIsChartLoading,
        hidePositions    : ui.hidePositionsFooterToggle,
        hideBlur         : ui.hideRouteBlur,
        is_dark_theme    : ui.is_dark_mode_on,
        showBlur         : ui.showRouteBlur,

    })
)(ContractReplay));
