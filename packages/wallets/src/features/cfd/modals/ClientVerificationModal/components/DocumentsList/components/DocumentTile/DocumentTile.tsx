import React from 'react';
import classNames from 'classnames';
import { LabelPairedChevronRightMdRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import './DocumentTile.scss';

type TDocumentTileProps = {
    badge?: JSX.Element;
    isDisabled?: boolean;
    onClick: VoidFunction;
    title: string;
};

const DocumentTile: React.FC<TDocumentTileProps> = ({ badge, isDisabled, onClick, title }) => {
    return (
        <button className='wallets-document-tile' disabled={isDisabled} onClick={onClick}>
            <Text align='start'>{title}</Text>
            <div className='wallets-document-tile__status'>
                {badge}
                <LabelPairedChevronRightMdRegularIcon
                    className={classNames('wallets-document-tile__chevron', {
                        'wallets-document-tile__chevron--disabled': isDisabled,
                    })}
                />
            </div>
        </button>
    );
};

export default DocumentTile;
