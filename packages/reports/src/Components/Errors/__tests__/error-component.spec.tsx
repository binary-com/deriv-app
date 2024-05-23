import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorComponent from '../error-component';
import { BrowserRouter } from 'react-router-dom';

describe('ErrorComponent', () => {
    const original = window.location;
    let modalRootElement: HTMLDivElement;

    beforeAll(() => {
        modalRootElement = document.createElement('div');
        modalRootElement.setAttribute('id', 'modal_root');
        document.body.appendChild(modalRootElement);
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { reload: jest.fn() },
        });
    });

    afterAll(() => {
        document.body.removeChild(modalRootElement);
        Object.defineProperty(window, 'location', { configurable: true, value: original });
    });

    it('should render error component in dialog', () => {
        render(
            <BrowserRouter>
                <ErrorComponent is_dialog />
            </BrowserRouter>
        );
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('There was an error')).toBeInTheDocument();
        expect(screen.getByText('Sorry, an error occured while processing your request.')).toBeInTheDocument();
    });

    it('should render error component with custom header and message', () => {
        render(
            <BrowserRouter>
                <ErrorComponent header='header' message='message' is_dialog />
            </BrowserRouter>
        );
        expect(screen.getByText('header')).toBeInTheDocument();
        expect(screen.getByText('message')).toBeInTheDocument();
    });

    it('should render error component in page error container', () => {
        render(
            <BrowserRouter>
                <ErrorComponent header='Error!' message='Error message' />
            </BrowserRouter>
        );
        expect(screen.getByText('Error!')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('should refresh page on clicking refresh button', () => {
        render(
            <BrowserRouter>
                <ErrorComponent header='Error!' message='Error message' />
            </BrowserRouter>
        );
        const refresh_button = screen.getByText('Refresh');
        expect(refresh_button).toBeInTheDocument();
        refresh_button.click();
        expect(location.reload).toHaveBeenCalled();
    });

    it('should refresh the page on clicking ok button on dialog modal', () => {
        render(
            <BrowserRouter>
                <ErrorComponent is_dialog />
            </BrowserRouter>
        );
        const ok_button = screen.getByText('Ok');
        expect(ok_button).toBeInTheDocument();
        ok_button.click();
        expect(location.reload).toHaveBeenCalled();
    });

    it('should show error modal with custom message', () => {
        // @ts-expect-error type mismatch
        jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState<boolean>(true));
        render(
            <BrowserRouter>
                <ErrorComponent message='Error message' />
            </BrowserRouter>
        );
        expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('should show unhandled error modal', async () => {
        // @ts-expect-error type mismatch
        jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState<boolean>(true));
        render(
            <BrowserRouter>
                <ErrorComponent />
            </BrowserRouter>
        );
        expect(screen.getByText('Sorry for the interruption')).toBeInTheDocument();
        expect(screen.getByText('Refresh')).toBeInTheDocument();
    });
});
