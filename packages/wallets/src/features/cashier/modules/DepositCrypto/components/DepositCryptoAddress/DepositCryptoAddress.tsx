import React from 'react';
import QRCode from 'qrcode.react';
import { useDevice } from '@deriv-com/ui';
import { WalletClipboard, WalletText } from '../../../../../../components/Base';
import './DepositCryptoAddress.scss';

type TProps = {
    depositCryptoAddress?: string;
};

const DepositCryptoAddress: React.FC<TProps> = ({ depositCryptoAddress }) => {
    const { isMobile } = useDevice();

    return (
        <div className='wallets-deposit-crypto-address'>
            <QRCode data-testid='dt_deposit-crypto-address-qr-code' size={128} value={depositCryptoAddress || ''} />
            <div className='wallets-deposit-crypto-address__hash'>
                <div className='wallets-deposit-crypto-address__hash-text'>
                    <WalletText size='sm' weight='bold'>
                        {depositCryptoAddress}
                    </WalletText>
                </div>
                <div className='wallets-deposit-crypto-address__hash-clipboard'>
                    {/* TODO: Replace this with deriv-com/ui */}
                    <WalletClipboard
                        infoMessage={isMobile ? undefined : 'copy'}
                        popoverAlignment={isMobile ? 'left' : 'bottom'}
                        successMessage='copied'
                        textCopy={depositCryptoAddress || ''}
                    />
                </div>
            </div>
        </div>
    );
};

export default DepositCryptoAddress;
