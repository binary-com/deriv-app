import React from 'react';
import { render } from '@testing-library/react';
import { isSafariBrowser, mobileOSDetect, mobileOSDetectAsync } from '@deriv/shared';
import MT5MobileRedirectOption from '../mt5-mobile-redirect-option';
import { DEEP_LINK, getMobileAppInstallerURL, getPlatformMt5DownloadLink } from '../../../src/Helpers/constants';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => false),
}));

describe('<MT5MobileRedirectOption/>', () => {
    const mock_props = {
        mt5_trade_account: {
            leverage: 500,
            display_login: '40021028',
            server_info: {
                environment: 'DerivSVG-Server',
            },
            white_label_links: {
                webtrader_url: 'https://mt5-real01-web.deriv.com/terminal',
                android:
                    'https://download.mql5.com/cdn/mobile/mt5/android?server=DerivSVG-Demo,DerivSVG-Server,DerivSVG-Server-02,DerivSVG-Server-03',
                ios: 'https://download.mql5.com/cdn/mobile/mt5/ios?server=DerivSVG-Demo,DerivSVG-Server,DerivSVG-Server-02,DerivSVG-Server-03',
                windows: 'https://download.mql5.com/cdn/web/22698/mt5/derivsvg5setup.exe',
            },
        },
    };

    const renderComponent = ({ props = mock_props }) => {
        return render(<MT5MobileRedirectOption {...props} />);
    };

    it('should show "Web Terminal" and "MT5 Mobile App" download options when user opens trade modal in mobile', () => {
        const { getByText, getAllByText } = renderComponent({ props: mock_props });
        expect(getByText('MetaTrader5 web terminal')).toBeInTheDocument();
        expect(getAllByText('Trade with MT5 mobile app')[0]).toBeInTheDocument();
    });

    it('should not show desktop download options when user opens trade modal in mobile', () => {
        const { queryByText } = renderComponent({ props: mock_props });
        expect(queryByText('MetaTrader 5 Windows app')).not.toBeInTheDocument();
        expect(queryByText('MetaTrader 5 MacOS app')).not.toBeInTheDocument();
        expect(queryByText('MetaTrader 5 Linux app')).not.toBeInTheDocument();
    });

    it('should open MT5 webtrader url with login and server name on browser', async () => {
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            configurable: true,
        });
        const { findByText } = renderComponent({ props: mock_props });
        const link = await findByText('MetaTrader5 web terminal');
        expect(isSafariBrowser()).toBe(false);
        expect(link.closest('a').getAttribute('href')).toBe(
            `${mock_props.mt5_trade_account.white_label_links.webtrader_url}?login=${mock_props.mt5_trade_account.display_login}&server=${mock_props.mt5_trade_account.server_info.environment}`
        );
    });

    it('should open MT5 download page on Apple App Store when iPhone user do not have the app installed', async () => {
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
            configurable: true,
        });

        const os = await mobileOSDetectAsync();
        expect(os).toBe('iOS');
        expect(isSafariBrowser()).toBe(true);

        const expectedUrl = await getMobileAppInstallerURL({ mt5_trade_account: mock_props.mt5_trade_account });
        expect(expectedUrl).toBe(mock_props.mt5_trade_account.white_label_links.ios);
    });

    it('should open MT5 download page on Google Play Store when Android user not have the app installed', async () => {
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Linux; Android 10; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36',
            configurable: true,
        });
        const os = await mobileOSDetectAsync();
        expect(os).toBe('Android');
        expect(isSafariBrowser()).toBe(false);

        const expectedUrl = await getMobileAppInstallerURL({ mt5_trade_account: mock_props.mt5_trade_account });
        expect(expectedUrl).toBe(mock_props.mt5_trade_account.white_label_links.android);
    });

    it('should open MT5 download page on Huawei App Gallery when Huawei user do not have the app installed', async () => {
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Linux; Android 10; ELE-L29) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36',
            configurable: true,
        });
        const os = await mobileOSDetectAsync();
        expect(os).toBe('huawei');
        expect(isSafariBrowser()).toBe(false);

        const expectedUrl = await getMobileAppInstallerURL({ mt5_trade_account: mock_props.mt5_trade_account });
        expect(expectedUrl).toBe(getPlatformMt5DownloadLink('huawei'));
    });

    it('should open MT5 app when user click "Trade with MT5 Mobile App" and has the app installed', () => {
        renderComponent({ props: mock_props });
        const expectedUrl = DEEP_LINK({ mt5_trade_account: mock_props.mt5_trade_account });
        expect(expectedUrl).toBe(
            `metatrader5://account?login=${mock_props.mt5_trade_account?.display_login}&server=${mock_props.mt5_trade_account?.server_info?.environment}`
        );
    });
});
