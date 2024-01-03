import React from 'react';
import { useHistory } from 'react-router-dom';
import { Text } from '@deriv/quill-design';
import CloseIcon from '../../../../public/images/ic-close-dark.svg';

type TCompareAccountsHeader = {
    isDemo?: boolean;
    isEuRegion?: boolean;
};

const CompareAccountsHeader = ({ isDemo, isEuRegion }: TCompareAccountsHeader) => {
    const history = useHistory();

    const headerTitle = isEuRegion
        ? `Deriv MT5 CFDs ${isDemo ? 'Demo' : 'real'} account`
        : `Compare CFDs ${isDemo ? 'demo ' : ''}accounts`;

    return (
        <div className='sticky flex items-center border-solid z-[999] border-b-100 py-50 px-500 top-50 h-2500 bg-system-light-primary-background'>
            <div className='flex justify-center w-full'>
                <Text bold size='xl'>
                    {headerTitle}
                </Text>
            </div>
            <CloseIcon
                className='cursor-pointer'
                onClick={() => {
                    history.push('/traders-hub');
                }}
            />
        </div>
    );
};

export default CompareAccountsHeader;
