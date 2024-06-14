import React from 'react';
import { Clipboard } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobileOrTablet } from '@deriv/shared';
import { TCFDAccountCopy } from './props.types';

const CFDAccountCopy = ({ text, className }: TCFDAccountCopy) => {
    return (
        <div className={className} data-testid='cfd_account_copy_main_div'>
            <Clipboard
                text_copy={text}
                info_message={isMobileOrTablet() ? '' : localize('copy')}
                success_message={localize('copied!')}
                popoverAlignment={isMobileOrTablet() ? 'left' : 'bottom'}
            />
        </div>
    );
};

export { CFDAccountCopy };
