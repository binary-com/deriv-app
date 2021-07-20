import React from 'react';
import { withRouter } from 'react-router-dom';
import { AutoHeightWrapper, Button } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getPlatformRedirect, PlatformContext, WS } from '@deriv/shared';
import { connect } from 'Stores/connect';
import DemoMessage from 'Components/demo-message';
import MissingPersonalDetails from 'Components/poi-missing-personal-details';
import ProofOfIdentityContainer from './proof-of-identity-container.jsx';

class ProofOfIdentity extends React.Component {
    static contextType = PlatformContext;
    routeBackTo = redirect_route => {
        this.props.routeBackInApp(this.props.history, [redirect_route]);
    };

    componentDidMount() {
        WS.wait('get_account_status').then(() => {
            if (!this.props.should_allow_authentication) {
                const from_platform = getPlatformRedirect(this.props.app_routing_history);
                this.props.routeBackInApp(this.props.history, [from_platform]);
            }
        });
    }

    render() {
        const from_platform = getPlatformRedirect(this.props.app_routing_history);
        const should_show_redirect_btn = from_platform.name === 'P2P';

        if (this.props.is_virtual) return <DemoMessage />;
        if (this.props.has_missing_required_field) return <MissingPersonalDetails />;

        return (
            <AutoHeightWrapper default_height={200}>
                {({ setRef, height }) => (
                    <div ref={setRef} className='proof-of-identity'>
                        <ProofOfIdentityContainer
                            account_status={this.props.account_status}
                            serviceToken={WS.serviceToken}
                            notificationEvent={WS.notificationEvent}
                            getAccountStatus={WS.authorized.getAccountStatus}
                            addNotificationByKey={this.props.addNotificationByKey}
                            is_mx_mlt={this.props.is_mx_mlt}
                            is_nigeria={this.props.is_nigeria}
                            removeNotificationByKey={this.props.removeNotificationByKey}
                            removeNotificationMessage={this.props.removeNotificationMessage}
                            refreshNotifications={this.props.refreshNotifications}
                            height={height}
                            redirect_button={
                                should_show_redirect_btn && (
                                    <Button
                                        primary
                                        className='proof-of-identity__redirect'
                                        onClick={() => this.routeBackTo(from_platform.route)}
                                    >
                                        <Localize
                                            i18n_default_text='Back to {{platform_name}}'
                                            values={{ platform_name: from_platform.name }}
                                        />
                                    </Button>
                                )
                            }
                            is_description_enabled
                        />
                    </div>
                )}
            </AutoHeightWrapper>
        );
    }
}

export default connect(({ client, ui, common }) => ({
    account_status: client.account_status,
    has_missing_required_field: client.has_missing_required_field,
    is_virtual: client.is_virtual,
    is_mx_mlt: client.landing_company_shortcode === 'iom' || client.landing_company_shortcode === 'malta',
    is_nigeria: client.residence === 'ng',
    refreshNotifications: client.refreshNotifications,
    addNotificationByKey: ui.addNotificationMessageByKey,
    removeNotificationByKey: ui.removeNotificationByKey,
    removeNotificationMessage: ui.removeNotificationMessage,
    routeBackInApp: common.routeBackInApp,
    app_routing_history: common.app_routing_history,
    should_allow_authentication: client.should_allow_authentication,
}))(withRouter(ProofOfIdentity));
