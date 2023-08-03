import React from 'react';
import { screen, render } from '@testing-library/react';
import JurisdictionCardSection from '../jurisdiction-card-section';
import { Jurisdiction } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import { APIProvider } from '@deriv/api';
import { useAuthenticationStatusInfo } from '@deriv/hooks';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useAuthenticationStatusInfo: jest.fn(),
}));

const mockUseAuthenticationStatusInfo = useAuthenticationStatusInfo as jest.MockedFunction<
    typeof useAuthenticationStatusInfo
>;

describe('JurisdictionCardSection', () => {
    beforeAll(() => {
        const mockReturnValue = {
            poa: {
                pending: true,
                need_resubmission: false,
                failed: false,
            },
            poi: {
                bvi_labuan_vanuatu: {
                    pending: true,
                    need_resubmission: false,
                    failed: false,
                },
                maltainvest: {
                    pending: true,
                    need_resubmission: false,
                    failed: false,
                },
            },
        };
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseAuthenticationStatusInfo.mockReturnValue(mockReturnValue);
    });

    type TMockProps = {
        card_section_item: {
            key: string;
            title: string;
            title_indicators?: {
                type: 'displayText';
                display_text: string;
                display_text_skin_color: string;
            };
            description?: string;
            clickable_description?: [{ type: 'link' | 'text'; text: string }];
        };
        type_of_card: 'svg' | 'bvi' | 'vanuatu' | 'labuan' | 'maltainvest';
        toggleCardFlip: jest.Mock;
        verification_docs: ['document_number' | 'selfie' | 'identity_document' | 'name_and_address' | 'not_applicable'];
    };
    const mock_props: TMockProps = {
        card_section_item: {
            key: '',
            title: 'Test Title',
            title_indicators: {
                type: 'displayText',
                display_text: 'Test Title Indicators Text',
                display_text_skin_color: '',
            },
            description: 'Test Description',
        },
        type_of_card: Jurisdiction.SVG,
        toggleCardFlip: jest.fn(),
        verification_docs: ['not_applicable'],
    };

    it('should render JurisdictionCardSection component', () => {
        render(
            <APIProvider>
                <JurisdictionCardSection {...mock_props} />
            </APIProvider>
        );
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Title Indicators Text')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('should render JurisdictionCardSection component with clickable description', () => {
        const mock_props_with_clickable_description = {
            ...mock_props,
            card_section_item: {
                ...mock_props.card_section_item,
                clickable_description: [{ type: 'link' as const, text: 'Test Link' }],
            },
        };

        render(
            <APIProvider>
                <JurisdictionCardSection {...mock_props_with_clickable_description} />
            </APIProvider>
        );
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Title Indicators Text')).toBeInTheDocument();
        expect(screen.getByText('Test Link')).toBeInTheDocument();
        expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
    });

    it('should render JurisdictionCardSection component without displaying title indicators if it is empty', () => {
        mock_props.card_section_item.title_indicators = undefined;
        render(
            <APIProvider>
                <JurisdictionCardSection {...mock_props} />
            </APIProvider>
        );
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.queryByText('Test Title Indicators Text')).not.toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
});
