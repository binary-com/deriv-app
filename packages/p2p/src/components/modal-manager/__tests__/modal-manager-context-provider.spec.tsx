import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalManagerContextProvider from '../modal-manager-context-provider';
import ModalManager from '../modal-manager';
import { isDesktop } from '@deriv/shared';
import { useStores } from 'Stores/index';
import {
    MockBuySellModal,
    MockMyAdsDeleteModal,
    MockAdCancelModal,
    MockPage,
} from '../__mocks__/mock-modal-manager-context-provider';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
}));

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    general_store: {
        saveFormState: jest.fn(),
        setSavedFormState: jest.fn(),
        setFormikRef: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Constants/modals', () => ({
    Modals: {
        BuySellModal: (props: any) => <MockBuySellModal {...props} />,
        MyAdsDeleteModal: (props: any) => <MockMyAdsDeleteModal {...props} />,
        AdCancelModal: (props: any) => <MockAdCancelModal {...props} />,
    },
}));

describe('<ModalManagerContextProvider />', () => {
    beforeEach(() => {
        jest.resetModules();
    });
    afterAll(() => {
        jest.resetModules();
        jest.resetAllMocks();
    });

    it('should render the mock modal when showModal is called in desktop view', () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const show_btn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });

        userEvent.click(show_btn);

        const text = screen.getByText('BuySellModal');
        expect(text).toBeInTheDocument();
    });

    it('should render the latest shown modal when showModal is called multiple times in desktop view', () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const buy_sell_modal_btn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });
        const my_ads_delete_modal_btn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });

        userEvent.click(buy_sell_modal_btn);
        userEvent.click(my_ads_delete_modal_btn);
        expect(screen.getByText('MyAdsDeleteModal')).toBeInTheDocument();
        expect(screen.queryByText('BuySellModal')).not.toBeInTheDocument();
    });

    it('should render the mock modal when showModal is called in responsive view', () => {
        (isDesktop as jest.Mock).mockImplementation(() => false);
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const buy_sell_modal_btn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });

        userEvent.click(buy_sell_modal_btn);
        expect(screen.queryByText('BuySellModal')).toBeInTheDocument();
    });

    it('should render the latest shown modal when showModal is called multiple times in responsive view', () => {
        (isDesktop as jest.Mock).mockImplementation(() => false);
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const buy_sell_modal_btn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });
        const my_ads_delete_modal_btn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });
        const hide_modal_btn = screen.getByRole('button', {
            name: /Hide Modal/,
        });

        userEvent.click(buy_sell_modal_btn);
        userEvent.click(my_ads_delete_modal_btn);
        expect(screen.queryByText('MyAdsDeleteModal')).toBeInTheDocument();

        userEvent.click(hide_modal_btn);
        expect(screen.queryByText('MyAdsDeleteModal')).not.toBeInTheDocument();
        expect(screen.queryByText('BuySellModal')).toBeInTheDocument();

        userEvent.click(hide_modal_btn);
        expect(screen.queryByText('MyAdsDeleteModal')).not.toBeInTheDocument();
        expect(screen.queryByText('BuySellModal')).not.toBeInTheDocument();
    });

    it('should return correct status of modal visibility based on isCurrentModal function', () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const my_ads_delete_modal_btn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });

        userEvent.click(my_ads_delete_modal_btn);
        expect(screen.getByText('Delete Ads')).toBeInTheDocument();
    });

    it('should hide a modal if hideModal is called in desktop view', () => {
        (isDesktop as jest.Mock).mockImplementation(() => true);
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const buy_sell_modal_btn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });
        const my_ads_delete_modal_btn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });
        const hide_modal_btn = screen.getByRole('button', {
            name: /Hide Modal/,
        });

        userEvent.click(my_ads_delete_modal_btn);
        userEvent.click(hide_modal_btn);
        expect(screen.queryByText('MyAdsDeleteModal')).not.toBeInTheDocument();

        userEvent.click(buy_sell_modal_btn);
        userEvent.click(my_ads_delete_modal_btn);
        userEvent.click(hide_modal_btn);
        expect(screen.getByText('BuySellModal')).toBeInTheDocument();
    });

    it('should hide a modal if hideModal is called in responsive view', () => {
        (isDesktop as jest.Mock).mockImplementation(() => false);
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const buy_sell_modal_btn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });
        const my_ads_delete_modal_btn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });
        const hide_modal_btn = screen.getByRole('button', {
            name: /Hide Modal/,
        });

        userEvent.click(buy_sell_modal_btn);
        userEvent.click(my_ads_delete_modal_btn);
        userEvent.click(hide_modal_btn);
        expect(screen.queryByText('MyAdsDeleteModal')).not.toBeInTheDocument();
        expect(screen.queryByText('BuySellModal')).toBeInTheDocument();

        userEvent.click(hide_modal_btn);
        expect(screen.queryByText('BuySellModal')).not.toBeInTheDocument();
    });

    it('should hide all modals if should_hide_all_modals option is passed in hideModal function on desktop view', () => {
        (isDesktop as jest.Mock).mockImplementation(() => true);
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const buy_sell_modal_btn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });
        const my_ads_delete_modal_btn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });
        const hide_modal_btn = screen.getByRole('button', {
            name: /Hide All Modals/,
        });

        userEvent.click(buy_sell_modal_btn);
        userEvent.click(my_ads_delete_modal_btn);
        userEvent.click(hide_modal_btn);

        expect(screen.queryByText('MyAdsDeleteModal')).not.toBeInTheDocument();
        expect(screen.queryByText('BuySellModal')).not.toBeInTheDocument();
    });

    it('should hide all modals if should_hide_all_modals option is passed in hideModal function on responsive view', () => {
        (isDesktop as jest.Mock).mockImplementation(() => false);
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const buy_sell_modal_btn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });
        const my_ads_delete_modal_btn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });
        const hide_all_modals_btn = screen.getByRole('button', {
            name: /Hide All Modals/,
        });

        userEvent.click(buy_sell_modal_btn);
        userEvent.click(my_ads_delete_modal_btn);
        userEvent.click(hide_all_modals_btn);
        expect(screen.queryByText('MyAdsDeleteModal')).not.toBeInTheDocument();
        expect(screen.queryByText('BuySellModal')).not.toBeInTheDocument();
    });

    it('should cache and register the modal props with useRegisterModalProps and pass it to the registered modal', () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const buy_sell_modal_btn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });
        userEvent.click(buy_sell_modal_btn);

        const apply_btn = screen.getByRole('button', {
            name: /Apply/,
        });
        userEvent.click(apply_btn);
        expect(screen.getByText('Title from BuySellModal')).toBeInTheDocument();
    });

    it('should cache and register multiple modal props with useRegisterModalProps and pass it to the registered modal', () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const ad_cancel_modal_btn = screen.getByRole('button', {
            name: /Show AdCancelModal/,
        });
        userEvent.click(ad_cancel_modal_btn);

        const buy_sell_modal_btn = screen.getByRole('button', {
            name: /Go to BuySellModal/,
        });
        userEvent.click(buy_sell_modal_btn);
        expect(screen.getByText('BuySellModal with my title and my subtitle')).toBeInTheDocument();
    });

    it('should save form state of the modal in general_store when saveFormState is called', () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const ad_cancel_modal_btn = screen.getByRole('button', {
            name: /AdCancelModal/,
        });
        userEvent.click(ad_cancel_modal_btn);

        const submit_btn = screen.getByRole('button', {
            name: /Submit/,
        });
        userEvent.click(submit_btn);
        expect(mock_store.general_store.saveFormState).toBeCalled();
    });
});
