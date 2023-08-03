import React from 'react';
import JurisdictionModalFootNote from '../jurisdiction-modal-foot-note';
import { render, screen } from '@testing-library/react';
import RootStore from 'Stores/index';
import { Jurisdiction } from '@deriv/shared';
import { APIProvider } from '@deriv/api';
import { useAuthenticationStatusInfo } from '@deriv/hooks';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useAuthenticationStatusInfo: jest.fn(),
}));

const mockUseAuthenticationStatusInfo = useAuthenticationStatusInfo as jest.MockedFunction<
    typeof useAuthenticationStatusInfo
>;

describe('JurisdictionModalFootNote', () => {
    beforeAll(() => {
        const mockReturnValue = {
            poa: {
                pending: true,
            },
        };
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseAuthenticationStatusInfo.mockReturnValue(mockReturnValue);
    });
    const mock_store = {
        common: {},
        client: {},
        ui: {},
    };
    const mock_context = new RootStore(mock_store);
    const mock_props = {
        account_type: '',
        context: mock_context,
        card_classname: '',
        jurisdiction_selected_shortcode: Jurisdiction.SVG,
        should_restrict_bvi_account_creation: false,
        should_restrict_vanuatu_account_creation: false,
    };
    it('should render JurisdictionModalFootNote', () => {
        render(
            <APIProvider>
                <JurisdictionModalFootNote {...mock_props} />
            </APIProvider>
        );
        expect(screen.getByTestId('dt-jurisdiction-footnote')).toBeInTheDocument();
    });

    it('should render JurisdictionModalFootNote with className', () => {
        render(
            <APIProvider>
                <JurisdictionModalFootNote {...mock_props} card_classname='mock_jurisdiction' />
            </APIProvider>
        );
        const container = screen.getByTestId('dt-jurisdiction-footnote');
        expect(container).toHaveClass('mock_jurisdiction__footnote');
    });

    it('should render JurisdictionModalFootNote and show svg message', () => {
        render(
            <APIProvider>
                <JurisdictionModalFootNote
                    {...mock_props}
                    jurisdiction_selected_shortcode={Jurisdiction.SVG}
                    account_type='synthetic'
                />
            </APIProvider>
        );
        expect(
            screen.getByText('Add your Deriv MT5 Derived account under Deriv (SVG) LLC (company no. 273 LLC 2020).')
        ).toBeInTheDocument();
    });

    it('should render JurisdictionModalFootNote without bvi_restriction and show bvi message', () => {
        render(
            <APIProvider>
                <JurisdictionModalFootNote
                    {...mock_props}
                    jurisdiction_selected_shortcode={Jurisdiction.BVI}
                    account_type='synthetic'
                />
            </APIProvider>
        );
        expect(
            screen.getByText(
                'Add your Deriv MT5 Derived account under Deriv (BVI) Ltd, regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114).'
            )
        ).toBeInTheDocument();
    });

    it('should render JurisdictionModalFootNote with bvi_restriction and show bvi restriction message', () => {
        const mockReturnValue = {
            poa: {
                pending: false,
            },
        };
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseAuthenticationStatusInfo.mockReturnValue(mockReturnValue);
        render(
            <APIProvider>
                <JurisdictionModalFootNote
                    {...mock_props}
                    jurisdiction_selected_shortcode={Jurisdiction.BVI}
                    account_type='synthetic'
                    should_restrict_bvi_account_creation
                />
            </APIProvider>
        );
        expect(
            screen.getByText('To create this account first we need you to resubmit your proof of address.')
        ).toBeInTheDocument();
    });

    it('should render JurisdictionModalFootNote with bvi_restriction and poa is pending, then display resubmit poa message', () => {
        const mockReturnValue = {
            poa: {
                pending: true,
            },
        };
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseAuthenticationStatusInfo.mockReturnValue(mockReturnValue);
        render(
            <APIProvider>
                <JurisdictionModalFootNote
                    {...mock_props}
                    jurisdiction_selected_shortcode={Jurisdiction.BVI}
                    account_type='synthetic'
                    should_restrict_bvi_account_creation
                    card_classname='mock_jurisdiction'
                />
            </APIProvider>
        );
        const poa_message = screen.getByText(
            'You can open this account once your submitted documents have been verified.'
        );
        expect(poa_message).toBeInTheDocument();
        expect(poa_message).toHaveClass('mock_jurisdiction__footnote--pending');
    });

    it('should render JurisdictionModalFootNote without vanuatu_restriction and show vanuatu message', () => {
        render(
            <APIProvider>
                <JurisdictionModalFootNote
                    {...mock_props}
                    jurisdiction_selected_shortcode={Jurisdiction.VANUATU}
                    account_type='synthetic'
                />
            </APIProvider>
        );
        expect(
            screen.getByText(
                'Add Your Deriv MT5 Derived account under Deriv (V) Ltd, regulated by the Vanuatu Financial Services Commission.'
            )
        ).toBeInTheDocument();
    });

    it('should render JurisdictionModalFootNote with vanuatu_restriction and show vanuatu restriction message', () => {
        const mockReturnValue = {
            poa: {
                pending: false,
            },
        };
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseAuthenticationStatusInfo.mockReturnValue(mockReturnValue);

        render(
            <APIProvider>
                <JurisdictionModalFootNote
                    {...mock_props}
                    jurisdiction_selected_shortcode={Jurisdiction.VANUATU}
                    account_type='synthetic'
                    should_restrict_vanuatu_account_creation
                />
            </APIProvider>
        );
        expect(
            screen.getByText('To create this account first we need you to resubmit your proof of address.')
        ).toBeInTheDocument();
    });

    it('should render JurisdictionModalFootNote with vanuatu_restriction and poa is pending, then display resubmit poa message', () => {
        const mockReturnValue = {
            poa: {
                pending: true,
            },
        };
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseAuthenticationStatusInfo.mockReturnValue(mockReturnValue);

        render(
            <APIProvider>
                <JurisdictionModalFootNote
                    {...mock_props}
                    jurisdiction_selected_shortcode={Jurisdiction.VANUATU}
                    account_type='synthetic'
                    should_restrict_vanuatu_account_creation
                    card_classname='mock_jurisdiction'
                />
            </APIProvider>
        );
        const poa_message = screen.getByText(
            'You can open this account once your submitted documents have been verified.'
        );
        expect(poa_message).toBeInTheDocument();
        expect(poa_message).toHaveClass('mock_jurisdiction__footnote--pending');
    });

    it('should render JurisdictionModalFootNote show labuan message', () => {
        render(
            <APIProvider>
                <JurisdictionModalFootNote
                    {...mock_props}
                    jurisdiction_selected_shortcode={Jurisdiction.LABUAN}
                    account_type='synthetic'
                />
            </APIProvider>
        );
        expect(
            screen.getByText(
                'Add your Deriv MT5 Derived STP account under Deriv (FX) Ltd regulated by Labuan Financial Services Authority (Licence no. MB/18/0024).'
            )
        ).toBeInTheDocument();
    });

    it('should render JurisdictionModalFootNote show maltainvest message', () => {
        render(
            <APIProvider>
                <JurisdictionModalFootNote
                    {...mock_props}
                    jurisdiction_selected_shortcode={Jurisdiction.MALTA_INVEST}
                    account_type='synthetic'
                />
            </APIProvider>
        );
        expect(
            screen.getByText(
                'Add your Deriv MT5 CFDs account under Deriv Investments (Europe) Limited, regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156).'
            )
        ).toBeInTheDocument();
    });

    it('should not render JurisdictionModalFootNote when jurisdiction_shortcode is empty', () => {
        render(
            <APIProvider>
                <JurisdictionModalFootNote {...mock_props} jurisdiction_selected_shortcode='' />
            </APIProvider>
        );
        expect(screen.queryByTestId('dt-jurisdiction-footnote')).not.toBeInTheDocument();
    });
});
