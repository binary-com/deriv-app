import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import CommonMistakeExamples from '../common-mistake-examples';

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    LegacyLossIcon: () => 'LegacyLossIcon',
}));

describe('CommonMistakeExamples', () => {
    it('should render the component with 6 mistake descriptions', () => {
        const mock = mockStore({});
        render(
            <StoreProvider store={mock}>
                <CommonMistakeExamples />
            </StoreProvider>
        );
        expect(screen.getAllByRole('document')).toHaveLength(6);
    });
});
