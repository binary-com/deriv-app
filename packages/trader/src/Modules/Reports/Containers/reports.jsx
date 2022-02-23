import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import {
    Div100vhContainer,
    VerticalTab,
    DesktopWrapper,
    MobileWrapper,
    FadeWrapper,
    PageOverlay,
    SelectNative,
    Loading,
} from '@deriv/components';
import { getSelectedRoute, platforms } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import 'Sass/app/modules/reports.scss';

const Reports = ({
    history,
    is_logged_in,
    is_logging_in,
    is_visible,
    location,
    platform,
    routeBackInApp,
    routes,
    setTabIndex,
    setVisibilityRealityCheck,
    tab_index,
    toggleReports,
}) => {
    React.useEffect(() => {
        toggleReports(true);

        return () => {
            setVisibilityRealityCheck(1);
            toggleReports(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickClose = () => routeBackInApp(history);

    const handleRouteChange = e => history.push(e.target.value);

    const menu_options = () => {
        const options = [];

        routes.forEach(route => {
            options.push({
                default: route.default,
                icon: route.icon_component,
                label: route.getTitle(),
                value: route.component,
                path: route.path,
            });
        });

        return options;
    };

    const selected_route = getSelectedRoute({ routes, pathname: location.pathname });

    if (!is_logged_in && is_logging_in) {
        return <Loading is_fullscreen />;
    }
    return (
        <FadeWrapper is_visible={is_visible} className='reports-page-wrapper' keyname='reports-page-wrapper'>
            <div className='reports'>
                <PageOverlay
                    header={localize('Reports')}
                    onClickClose={onClickClose}
                    is_from_app={!!platforms[platform]}
                >
                    <DesktopWrapper>
                        <VerticalTab
                            alignment='center'
                            id='report'
                            is_floating
                            classNameHeader='reports__tab-header'
                            current_path={location.pathname}
                            is_routed
                            is_full_width
                            setVerticalTabIndex={setTabIndex}
                            vertical_tab_index={selected_route.default ? 0 : tab_index}
                            list={menu_options()}
                        />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <Div100vhContainer className='reports__mobile-wrapper' height_offset='80px'>
                            <SelectNative
                                className='reports__route-selection'
                                list_items={menu_options().map(option => ({
                                    text: option.label,
                                    value: option.path,
                                }))}
                                value={selected_route.path}
                                should_show_empty_option={false}
                                onChange={handleRouteChange}
                            />
                            {selected_route && (
                                <selected_route.component component_icon={selected_route.icon_component} />
                            )}
                        </Div100vhContainer>
                    </MobileWrapper>
                </PageOverlay>
            </div>
        </FadeWrapper>
    );
};

Reports.propTypes = {
    history: PropTypes.object,
    is_logged_in: PropTypes.bool,
    is_logging_in: PropTypes.bool,
    is_visible: PropTypes.bool,
    location: PropTypes.object,
    platform: PropTypes.string,
    routeBackInApp: PropTypes.func,
    routes: PropTypes.arrayOf(PropTypes.object),
    setTabIndex: PropTypes.func,
    setVisibilityRealityCheck: PropTypes.func,
    tab_index: PropTypes.number,
    toggleReports: PropTypes.func,
};

export default connect(({ client, common, ui }) => ({
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
    is_visible: ui.is_reports_visible,
    platform: common.platform,
    routeBackInApp: common.routeBackInApp,
    setVisibilityRealityCheck: client.setVisibilityRealityCheck,
    setTabIndex: ui.setReportsTabIndex,
    tab_index: ui.reports_route_tab_index,
    toggleReports: ui.toggleReports,
}))(withRouter(Reports));
