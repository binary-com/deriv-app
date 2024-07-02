import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import IdvLimited from '../idv-limited';

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    DerivLightExclamationPoiIcon: () => 'DerivLightExclamationPoiIcon',
}));
describe('<IdvLimited/>', () => {
    const mockHandleRequireSubmission = jest.fn();

    it('should render IdvLimited component and trigger click', () => {
        render(<IdvLimited handleRequireSubmission={mockHandleRequireSubmission} />);

        expect(screen.getByText('DerivLightExclamationPoiIcon')).toBeInTheDocument();
        expect(screen.getByText(/ID verification failed/i)).toBeInTheDocument();
        expect(screen.getByText(/we were unable to verify your ID with the details you provided/i)).toBeInTheDocument();
        expect(screen.getByText(/please upload your identity document/i)).toBeInTheDocument();

        const btn = screen.getByRole('button');
        expect(btn).toHaveTextContent(/upload identity document/i);
        fireEvent.click(btn);
        expect(mockHandleRequireSubmission).toHaveBeenCalledTimes(1);
    });
});
