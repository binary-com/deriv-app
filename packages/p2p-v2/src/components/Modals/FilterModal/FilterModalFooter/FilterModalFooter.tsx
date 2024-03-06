import React from 'react';
import { Button, useDevice } from '@deriv-com/ui';
import './FilterModalFooter.scss';

type TFilterModalFooterProps = {
    hasSameFilters: boolean;
    hasSamePaymentMethods: boolean;
    onApplyConfirm: () => void;
    onResetClear: () => void;
    paymentMethods: string[];
    showPaymentMethods: boolean;
};

const FilterModalFooter = ({
    hasSameFilters,
    hasSamePaymentMethods,
    onApplyConfirm,
    onResetClear,
    paymentMethods,
    showPaymentMethods,
}: TFilterModalFooterProps) => {
    const { isMobile } = useDevice();
    return (
        <div className='p2p-v2-filter-modal-footer'>
            <Button
                className='mr-[0.8rem]'
                disabled={
                    (showPaymentMethods && paymentMethods.length === 0) || (!showPaymentMethods && hasSameFilters)
                }
                isFullWidth={isMobile}
                onClick={onResetClear}
                size='lg'
                variant='outlined'
            >
                {showPaymentMethods ? 'Clear' : 'Reset'}
            </Button>
            <Button
                disabled={
                    (showPaymentMethods && (paymentMethods.length === 0 || hasSamePaymentMethods)) ||
                    (!showPaymentMethods && hasSameFilters)
                }
                isFullWidth={isMobile}
                onClick={onApplyConfirm}
                size='lg'
            >
                {showPaymentMethods ? 'Confirm' : 'Apply'}
            </Button>
        </div>
    );
};

export default FilterModalFooter;
