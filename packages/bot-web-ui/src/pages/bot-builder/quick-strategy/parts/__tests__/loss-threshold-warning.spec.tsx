import React from 'react';
import { Formik } from 'formik';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import LossThresholdWarningDialog from '../loss-threshold-warning-dialog';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

window.Blockly = {
    Xml: {
        textToDom: jest.fn(),
        domToText: jest.fn(),
    },
};

describe('LossThresholdWarningDialog', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
        const mock_store = mockStore({
            ui: {
                is_mobile_or_tablet: true,
            },
        });
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        const mock_onSubmit = jest.fn();
        const initial_value = {
            durationtype: 1,
            symbol: 'R_100',
            tradetype: 'callput',
        };

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <Formik initialValues={initial_value} onSubmit={mock_onSubmit}>
                        {children}
                    </Formik>
                </DBotStoreProvider>
            </StoreProvider>
        );
    });
    it('should render LossThresholdWarningDialog', () => {
        const { container } = render(<LossThresholdWarningDialog />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should handle edit the amount button click', () => {
        mock_DBot_store?.quick_strategy.setLossThresholdWarningData({
            show: true,
        });
        render(<LossThresholdWarningDialog />, {
            wrapper,
        });
        const edit_amount_btn = screen.getByRole('button', { name: /Edit the amount/i });
        userEvent.click(edit_amount_btn);
        expect(mock_DBot_store?.quick_strategy.loss_threshold_warning_data.show).toBeFalsy();
    });

    it('should handle continue button click', async () => {
        mock_DBot_store?.quick_strategy.setLossThresholdWarningData({
            show: true,
        });
        render(<LossThresholdWarningDialog />, {
            wrapper,
        });
        const continue_btn = screen.getByRole('button', { name: /Yes, continue/i });
        userEvent.click(continue_btn);
        await waitFor(() => {
            expect(mock_DBot_store?.quick_strategy.loss_threshold_warning_data.show).toBeFalsy();
        });
    });

    it('should handle dont show again checkbox click', () => {
        mock_DBot_store?.quick_strategy.setLossThresholdWarningData({
            show: true,
        });
        render(<LossThresholdWarningDialog />, {
            wrapper,
        });
        const checkbox = screen.getByRole('checkbox', { name: /Do not show this message again./i });
        userEvent.click(checkbox);
        expect(localStorage.getItem('qs-dont-show-loss-threshold-warning')).toEqual('true');
    });
});
