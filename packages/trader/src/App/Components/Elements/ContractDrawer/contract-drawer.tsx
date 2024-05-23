import classNames from 'classnames';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import { DesktopWrapper, MobileWrapper, Div100vhContainer } from '@deriv/components';
import {
    isMobile,
    isEmptyObject,
    getDurationPeriod,
    getDurationTime,
    getDurationUnitText,
    getEndTime,
    mobileOSDetect,
    TContractStore,
    TContractInfo,
} from '@deriv/shared';
import ContractAudit from 'App/Components/Elements/ContractAudit';
import { PositionsCardLoader } from 'App/Components/Elements/ContentLoader';
import ContractDrawerCard from './contract-drawer-card';
import { SwipeableContractAudit } from './swipeable-components';
import { observer, useStore } from '@deriv/stores';

type TContractDrawerCardProps = React.ComponentProps<typeof ContractDrawerCard>;
type TContractDrawerProps = RouteComponentProps & {
    contract_info?: TContractInfo;
    contract_update_history: TContractStore['contract_update_history'];
    is_dark_theme: boolean;
    toggleHistoryTab: (state_change?: boolean) => void;
} & Pick<
        TContractDrawerCardProps,
        | 'contract_update'
        | 'is_accumulator'
        | 'is_market_closed'
        | 'is_multiplier'
        | 'is_sell_requested'
        | 'is_lookbacks'
        | 'is_turbos'
        | 'is_vanilla'
        | 'onClickCancel'
        | 'onClickSell'
    >;

const PAGE_BOTTOM_MARGIN = ['iOS', 'unknown'].includes(mobileOSDetect()) ? 0 : 13;

const ContractDrawer = observer(
    ({
        contract_info = {},
        contract_update,
        contract_update_history,
        is_accumulator,
        is_sell_requested,
        is_dark_theme,
        is_market_closed,
        is_multiplier,
        is_turbos,
        is_vanilla,
        is_lookbacks,
        onClickCancel,
        onClickSell,
        toggleHistoryTab,
    }: TContractDrawerProps) => {
        const { common, ui } = useStore();
        const { current_language, is_language_changing, server_time } = common;
        const { is_history_tab_active, is_mobile } = ui;
        const { currency, exit_tick_display_value } = contract_info;
        const contract_drawer_ref = React.useRef<HTMLDivElement>(null);
        const contract_drawer_card_ref = React.useRef<HTMLDivElement>(null);
        const [should_show_contract_audit, setShouldShowContractAudit] = React.useState(false);

        const contract_audit = (
            <ContractAudit
                contract_end_time={getEndTime(contract_info)}
                contract_info={contract_info}
                contract_update_history={contract_update_history}
                duration_unit={getDurationUnitText(getDurationPeriod(contract_info)) ?? ''}
                duration={getDurationTime(contract_info)}
                exit_spot={exit_tick_display_value}
                is_accumulator={is_accumulator}
                is_dark_theme={is_dark_theme}
                is_history_tab_active={is_history_tab_active}
                is_multiplier={is_multiplier}
                is_open
                is_turbos={is_turbos}
                is_vanilla={is_vanilla}
                current_language={is_language_changing ? '' : current_language}
                toggleHistoryTab={toggleHistoryTab}
            />
        );

        if (isEmptyObject(contract_info)) return null;

        // For non-binary contract, the status is always null, so we check for is_expired in contract_info
        const fallback_result = contract_info.status || contract_info.is_expired;

        const body_content = fallback_result ? (
            <React.Fragment>
                <ContractDrawerCard
                    contract_info={contract_info}
                    contract_update={contract_update}
                    currency={currency}
                    is_accumulator={is_accumulator}
                    is_mobile={is_mobile}
                    is_market_closed={is_market_closed}
                    is_multiplier={is_multiplier}
                    is_turbos={is_turbos}
                    is_vanilla={is_vanilla}
                    is_sell_requested={is_sell_requested}
                    is_lookbacks={is_lookbacks}
                    is_collapsed={should_show_contract_audit}
                    onClickCancel={onClickCancel}
                    onClickSell={onClickSell}
                    onSwipedUp={() => setShouldShowContractAudit(true)}
                    onSwipedDown={() => setShouldShowContractAudit(false)}
                    server_time={server_time}
                    toggleContractAuditDrawer={() => setShouldShowContractAudit(!should_show_contract_audit)}
                />
                <DesktopWrapper>{contract_audit}</DesktopWrapper>
            </React.Fragment>
        ) : (
            <div className='contract-card'>
                <PositionsCardLoader speed={2} />
            </div>
        );

        const contract_drawer = (
            <CSSTransition in={should_show_contract_audit} timeout={250} classNames='contract-drawer__transition'>
                <div
                    id='dt_contract_drawer'
                    className={classNames('contract-drawer', {
                        'contract-drawer--with-collapsible-btn': !!getEndTime(contract_info) || is_mobile,
                        'contract-drawer--is-multiplier': is_multiplier && isMobile(),
                        'contract-drawer--is-multiplier-sold': is_multiplier && isMobile() && getEndTime(contract_info),
                    })}
                    style={{
                        transform: (should_show_contract_audit &&
                            contract_drawer_ref.current &&
                            contract_drawer_card_ref.current &&
                            `translateY(calc(${contract_drawer_card_ref.current.clientHeight}px - ${contract_drawer_ref.current.clientHeight}px + ${PAGE_BOTTOM_MARGIN}px))`) as React.CSSProperties['transform'],
                    }}
                    ref={contract_drawer_ref}
                >
                    <div className='contract-drawer__body' ref={contract_drawer_card_ref}>
                        {body_content}
                    </div>
                    {should_show_contract_audit && (
                        <MobileWrapper>
                            <div id='dt_contract_drawer_audit'>
                                <SwipeableContractAudit is_multiplier={is_multiplier}>
                                    {contract_audit}
                                </SwipeableContractAudit>
                            </div>
                        </MobileWrapper>
                    )}
                </div>
            </CSSTransition>
        );

        return (
            <React.Fragment>
                <DesktopWrapper>{contract_drawer}</DesktopWrapper>
                <MobileWrapper>
                    <div
                        style={{
                            height: contract_drawer_card_ref.current?.clientHeight,
                        }}
                    >
                        <Div100vhContainer height_offset='40px' is_bypassed={!contract_drawer_card_ref.current}>
                            {contract_drawer}
                        </Div100vhContainer>
                    </div>
                </MobileWrapper>
            </React.Fragment>
        );
    }
);

export default withRouter(ContractDrawer);
