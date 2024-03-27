import React from 'react';
import { render, screen } from '@testing-library/react';
import ContractTypeDialog from '../contract-type-dialog';
import { useDevice } from '@deriv/hooks';

jest.mock('@deriv/hooks', () => ({
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

const MockContractTypeDialog = () => (
    <ContractTypeDialog
        is_open
        categories={[]}
        onClose={jest.fn()}
        is_info_dialog_open={false}
        item={{
            text: 'test',
            value: 'test',
        }}
    >
        <div data-testid='dt_child' />
    </ContractTypeDialog>
);

describe('ContractTypeDialog Component', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => document.body.removeChild(modal_root_el));
    beforeEach(() => jest.clearAllMocks());

    it('should render "children" when passed in', () => {
        render(<MockContractTypeDialog />);
        expect(screen.getByTestId('dt_child')).toBeInTheDocument();
    });

    it('should render "ContractTypeMenu" component in the desktop view', () => {
        render(<MockContractTypeDialog />);
        expect(screen.getByText('Trade types')).toBeInTheDocument();
        expect(screen.getByTestId('dt_contract_wrapper')).toBeInTheDocument();
    });

    it('should render "MobileDialog" component in the mobile view', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: true });
        render(<MockContractTypeDialog />);
        expect(screen.getByTestId('dt_mobile_dialog')).toBeInTheDocument();
    });
});
