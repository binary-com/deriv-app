import React from 'react';
import clsx from 'clsx';
import { LabelPairedArrowLeftLgBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import './PageReturn.scss';

type TPageReturnProps = {
    className?: string;
    hasBorder?: boolean;
    hideBackButton?: boolean;
    onClick: () => void;
    pageTitle: string;
    rightPlaceHolder?: JSX.Element;
    weight?: string;
};

const PageReturn = ({
    className = '',
    hasBorder = false,
    hideBackButton = false,
    onClick,
    pageTitle,
    rightPlaceHolder,
    weight = 'normal',
}: TPageReturnProps) => {
    return (
        <div className={clsx('p2p-v2-page-return', className, { 'p2p-v2-page-return--border': hasBorder })}>
            <div className='flex flex-row items-center'>
                <LabelPairedArrowLeftLgBoldIcon
                    className={clsx('p2p-v2-page-return__button', { hidden: hideBackButton })}
                    data-testid='dt_p2p_v2_page_return_btn'
                    onClick={onClick}
                />
                <Text weight={weight}>{pageTitle}</Text>
            </div>
            {rightPlaceHolder}
        </div>
    );
};

export default PageReturn;
