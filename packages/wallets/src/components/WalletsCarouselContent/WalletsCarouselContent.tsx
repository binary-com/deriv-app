import React, { useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useWalletAccountsList } from '@deriv/api';
import { ProgressBar } from '../ProgressBar';
import { WalletCard } from '../WalletCard';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletListCardIActions } from '../WalletListCardIActions';
import './WalletsCarouselContent.scss';

const WalletsCarouselContent: React.FC = () => {
    const [wallet_embla_ref, emblaApi] = useEmblaCarousel({ skipSnaps: true, containScroll: false });
    const [active_index, setActiveIndex] = useState(0);
    const { data: wallet_accounts_list } = useWalletAccountsList();

    React.useEffect(() => {
        emblaApi?.scrollTo(active_index);
    }, [active_index, emblaApi]);

    React.useEffect(() => {
        emblaApi?.on('select', () => {
            const scroll_snap_index = emblaApi.selectedScrollSnap();
            setActiveIndex(scroll_snap_index);
        });
    }, [emblaApi]);
    const amount_of_steps = Array.from({ length: wallet_accounts_list.length }, (_, idx) => idx + 1);

    return (
        <div className='wallets-carousel-content' ref={wallet_embla_ref}>
            <div className='wallets-carousel-content__container'>
                {wallet_accounts_list.map(wallet => (
                    <WalletGradientBackground
                        key={`wallet_gradient_background_${wallet.loginid}`}
                        currency={wallet?.currency_config?.display_code || 'USD'}
                        is_demo={wallet.is_virtual}
                    >
                        <WalletCard key={`${wallet.loginid}`} account={wallet} />
                    </WalletGradientBackground>
                ))}
            </div>
            <div className='wallets-carousel-content__progress-bar'>
                <ProgressBar
                    active_index={active_index + 1}
                    indexes={amount_of_steps}
                    setActiveIndex={setActiveIndex}
                    is_transition
                />
            </div>
            <WalletListCardIActions />
        </div>
    );
};

export default WalletsCarouselContent;
