import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, HintBox, Icon, Loading, Popover, Text } from '@deriv/components';
import { getKebabCase, website_name, isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const OnRampProviderPopup = ({
    api_error,
    deposit_address,
    is_dark_mode_on,
    is_deposit_address_loading,
    is_deposit_address_popover_open,
    is_requesting_widget_html,
    onClickCopyDepositAddress,
    onClickDisclaimerContinue,
    onClickGoToDepositPage,
    selected_provider,
    setDepositAddressRef,
    setIsOnRampModalOpen,
    should_show_dialog,
    should_show_widget,
    widget_error,
    widget_html,
}) => {
    const el_onramp_widget_container_ref = React.useRef(null);

    // JS executed after "on-ramp__widget-container" has been added to the DOM.
    // Used for providers that require JS to be executed for inclusion of their widget.
    // (vs embedding an <iframe>)
    React.useEffect(() => {
        if (should_show_widget && widget_html) {
            selected_provider.onMountWidgetContainer(el_onramp_widget_container_ref);
        }
    }, [selected_provider, should_show_widget, widget_html]);

    if (selected_provider === null) {
        return null;
    }

    if (is_deposit_address_loading || (should_show_widget && is_requesting_widget_html)) {
        return <Loading is_fullscreen={false} />;
    }

    if (should_show_widget) {
        return (
            <div
                className={classNames('on-ramp__widget-container', {
                    'on-ramp__widget-container--error': widget_error,
                })}
                ref={el_onramp_widget_container_ref}
            >
                {widget_error ? (
                    <div className='on-ramp__widget-container-error'>{widget_error}</div>
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: widget_html }} />
                )}
            </div>
        );
    }

    if (should_show_dialog) {
        return (
            <div className='on-ramp__popup-no-deposit-address'>
                <div className='on-ramp__popup-no-deposit-address-text'>
                    {api_error ? (
                        <Localize i18n_default_text='Please go to the Deposit page to get an address.' />
                    ) : (
                        <Localize i18n_default_text='Please go to the Deposit page to generate an address. Then come back here to continue with your transaction.' />
                    )}
                </div>
                <Button.Group className='on-ramp__popup-no-deposit-address-buttons'>
                    <Button text={localize('Cancel')} onClick={() => setIsOnRampModalOpen(false)} secondary large />
                    <Button text={localize('Go to Deposit page')} onClick={onClickGoToDepositPage} primary large />
                </Button.Group>
            </div>
        );
    }

    return (
        <div className='on-ramp__popup'>
            {selected_provider.should_show_deposit_address && (
                <React.Fragment>
                    <div className='on-ramp__popup-deposit'>
                        <Text
                            size={isMobile() ? 'xxs' : 'xs'}
                            color='general'
                            line_height={isMobile() ? 'm' : 'l'}
                            align={isMobile() ? 'left' : 'center'}
                        >
                            <Localize i18n_default_text="Please copy the crypto address you see below. You'll need it to deposit your cryptocurrency." />
                        </Text>
                        <div className='on-ramp__popup-deposit-address'>
                            <Popover
                                zIndex={9998}
                                alignment='right'
                                message={localize('Copied!')}
                                is_open={is_deposit_address_popover_open}
                            >
                                <input
                                    className={classNames('on-ramp__popup-deposit-address-text', {
                                        'on-ramp__popup-deposit-address-text--dark': is_dark_mode_on,
                                    })}
                                    ref={setDepositAddressRef}
                                    defaultValue={deposit_address}
                                    disabled
                                    onFocus={e => e.preventDefault()}
                                />
                                <Icon
                                    className='on-ramp__popup-deposit-address-icon'
                                    icon={isMobile() ? 'IcCopy' : 'icClipboard'}
                                    size={16}
                                    onClick={onClickCopyDepositAddress}
                                />
                            </Popover>
                        </div>
                        <div className='on-ramp__popup-deposit-address-hint'>
                            <HintBox
                                icon={'IcInfo'}
                                is_info
                                message={localize(
                                    'This address can only be used ONCE. Please copy a new one for your next transaction.'
                                )}
                            />
                        </div>
                    </div>
                    <div className='on-ramp__popup-divider' />
                </React.Fragment>
            )}
            <div className='on-ramp__popup-disclaimer'>
                <Text
                    line_height='m'
                    weight='bold'
                    color='prominent'
                    as='p'
                    className='on-ramp__popup-disclaimer-title'
                >
                    <Localize i18n_default_text='Disclaimer' />
                </Text>
                <Text
                    size={isMobile() ? 'xxs' : 'xs'}
                    line_height='l'
                    color='general'
                    as='p'
                    className='on-ramp__popup-disclaimer-text'
                >
                    <Localize
                        i18n_default_text="By clicking 'Continue' you will be redirected to {{ service }}, a third-party payment service provider. Please note that {{ website_name }} is not responsible for the content or services provided by {{ service }}. If you encounter any issues related to {{ service }} services, you must contact {{ service }} directly."
                        values={{
                            service: selected_provider.name,
                            website_name,
                        }}
                    />
                </Text>
            </div>
            {!should_show_widget && deposit_address && (
                <div className='on-ramp__popup-buttons'>
                    <Button.Group>
                        <Button large onClick={() => setIsOnRampModalOpen(false)} secondary text={localize('Cancel')} />
                        <Button
                            id={`gtm-onramp-provider-continue--${getKebabCase(selected_provider.name)}`}
                            large
                            onClick={onClickDisclaimerContinue}
                            primary
                            text={localize('Continue')}
                        />
                    </Button.Group>
                </div>
            )}
        </div>
    );
};

OnRampProviderPopup.propTypes = {
    api_error: PropTypes.string,
    deposit_address: PropTypes.string,
    is_deposit_address_loading: PropTypes.bool,
    is_deposit_address_popover_open: PropTypes.bool,
    is_requesting_widget_html: PropTypes.bool,
    onClickCopyDepositAddress: PropTypes.func,
    onClickDisclaimerContinue: PropTypes.func,
    onClickGoToDepositPage: PropTypes.func,
    selected_provider: PropTypes.object,
    setDepositAddressRef: PropTypes.func,
    setIsOnRampModalOpen: PropTypes.func,
    should_show_dialog: PropTypes.bool,
    should_show_widget: PropTypes.bool,
    widget_error: PropTypes.string,
    widget_html: PropTypes.string,
};

export default connect(({ modules, ui }) => ({
    api_error: modules.cashier.onramp.api_error,
    deposit_address: modules.cashier.onramp.deposit_address,
    is_dark_mode_on: ui.is_dark_mode_on,
    is_deposit_address_loading: modules.cashier.onramp.is_deposit_address_loading,
    is_deposit_address_popover_open: modules.cashier.onramp.is_deposit_address_popover_open,
    is_requesting_widget_html: modules.cashier.onramp.is_requesting_widget_html,
    onClickCopyDepositAddress: modules.cashier.onramp.onClickCopyDepositAddress,
    onClickDisclaimerContinue: modules.cashier.onramp.onClickDisclaimerContinue,
    onClickGoToDepositPage: modules.cashier.onramp.onClickGoToDepositPage,
    selected_provider: modules.cashier.onramp.selected_provider,
    setDepositAddressRef: modules.cashier.onramp.setDepositAddressRef,
    setIsOnRampModalOpen: modules.cashier.onramp.setIsOnRampModalOpen,
    should_show_dialog: modules.cashier.onramp.should_show_dialog,
    should_show_widget: modules.cashier.onramp.should_show_widget,
    widget_error: modules.cashier.onramp.widget_error,
    widget_html: modules.cashier.onramp.widget_html,
}))(OnRampProviderPopup);
