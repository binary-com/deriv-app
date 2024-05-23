import { getTitle } from '../constants';

describe('getTitle', () => {
    it('should return "Purchase Error" if input is buy', () => {
        expect(getTitle('buy')).toBe('Purchase Error');
    });
    it('should return "Deal Cancellation Error" if input is cancel', () => {
        expect(getTitle('cancel')).toBe('Deal Cancellation Error');
    });
    it('should return "Contract Update Error" if input is buy', () => {
        expect(getTitle('contract_update')).toBe('Contract Update Error');
    });
    it('should return "Sell Error" if input is buy', () => {
        expect(getTitle('sell')).toBe('Sell Error');
    });
    it('should return "Error" if input is not a defined type', () => {
        expect(getTitle('test')).toBe('Error');
    });
});
