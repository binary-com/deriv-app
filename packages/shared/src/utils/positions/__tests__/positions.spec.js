import { expect }           from 'chai';
import * as PositionsHelper from '../positions';

describe('positions-helper', () => {
    describe('addCommaToNumber', () => {
        it('should work as expected with number steps of thousands leading to a comma separated string', () => {
            const number = 1224500.3153;
            expect(PositionsHelper.addCommaToNumber(number)).to.eql('1,224,500.3153');
        });
    });
    describe('getTimePercentage', () => {
        it('should work as expected with time of server, date_start and expiry being calculated leading to a percentage', () => {
            const current_time  = 1544000005;
            const date_start    = 1544000000;
            const expiry_time   = 1544005000;
            expect(PositionsHelper.getTimePercentage(current_time, date_start, expiry_time)).to.eql(100);
        });
    });
    describe('getBarrierLabel', () => {
        it('should return Target label if contract has a digit contract type', () => {
            const contract_info = {
                contract_type: 'DIGITDIFF',
            };
            const barrier_label_map = {
                target : 'Target',
                barrier: 'Barrier',
            }
            expect(PositionsHelper.getBarrierLabel(contract_info, barrier_label_map)).to.eql('Target');
        });
    });
    describe('getBarrierValue', () => {
        it('should return correct target value according to digit type mapping if contract type is digit', () => {
            const getDigitTypeMap = (contract_info) => ({
                DIGITDIFF : `Not ${contract_info.barrier}`,
                DIGITEVEN : 'Even',
                DIGITMATCH: `Equals ${contract_info.barrier}`,
                DIGITODD  : 'Odd',
                DIGITOVER : `Over ${contract_info.barrier}`,
                DIGITUNDER: `Under ${contract_info.barrier}`,
            });
            const contract_info = {
                contract_type: 'DIGITDIFF',
                barrier      : '1',
            };
            expect(PositionsHelper.getBarrierValue(contract_info, getDigitTypeMap)).to.eql('Not 1');
        });
    });
});
