import * as React from 'react';
import { Text } from '@deriv/components';

const TotalBalanceDropdown: React.FC<TTotalBalanceDropdownProps> = ({ is_visible }) => {
    if (is_visible) {
        return (
            <div className='dw-total-balance__dropdown'>
                <Text color='prominent' size='s' weight='bold'>
                    Dropdown
                </Text>
            </div>
        );
    }
    return null;
};

interface TTotalBalanceDropdownProps {
    is_visible: boolean;
}

export default TotalBalanceDropdown;
