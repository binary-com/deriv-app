import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel, { EmblaCarouselType } from 'embla-carousel-react';
import { useHover } from 'usehooks-ts';
import { useAllWalletAccounts, useAuthorize } from '@deriv/api-v2';
import { LabelPairedChevronLeftLgFillIcon, LabelPairedChevronRightLgFillIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import useIsRtl from '../../hooks/useIsRtl';
import { IconButton } from '../Base';
import { WalletsAddMoreLoader } from '../SkeletonLoader';
import WalletsAddMoreCard from '../WalletsAddMoreCard';
import './WalletsAddMoreCarousel.scss';

const WalletsAddMoreCarousel: React.FC = () => {
    const { isDesktop } = useDevice();
    const { data: wallets, isLoading } = useAllWalletAccounts();
    const { isInitializing } = useAuthorize();
    const isRtl = useIsRtl();

    const showLoader = isInitializing || isLoading;

    const [walletsAddMoreEmblaRef, walletsAddMoreEmblaAPI] = useEmblaCarousel({
        align: 0,
        containScroll: 'trimSnaps',
        direction: isRtl ? 'rtl' : 'ltr',
    });
    const hoverRef = useRef<HTMLDivElement>(null);
    const isHover = useHover(hoverRef);
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => walletsAddMoreEmblaAPI?.scrollPrev(), [walletsAddMoreEmblaAPI]);
    const scrollNext = useCallback(() => walletsAddMoreEmblaAPI?.scrollNext(), [walletsAddMoreEmblaAPI]);

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, []);

    useEffect(() => {
        if (!walletsAddMoreEmblaAPI) return;

        walletsAddMoreEmblaAPI.reInit({ watchDrag: !isDesktop });
    }, [walletsAddMoreEmblaAPI, isDesktop]);

    useEffect(() => {
        if (!walletsAddMoreEmblaAPI) return;

        onSelect(walletsAddMoreEmblaAPI);
        walletsAddMoreEmblaAPI.on('reInit', onSelect);
        walletsAddMoreEmblaAPI.on('select', onSelect);
    }, [walletsAddMoreEmblaAPI, onSelect]);

    return (
        <div className='wallets-add-more' ref={hoverRef}>
            <div className='wallets-add-more__header'>
                <Text size='xl' weight='bold'>
                    <Localize i18n_default_text='Add more Wallets' />
                </Text>
            </div>
            <div className='wallets-add-more__carousel' data-testid='dt-wallets-add-more' ref={walletsAddMoreEmblaRef}>
                <div className='wallets-add-more__carousel-wrapper' id='wallets_add_more_carousel_wrapper'>
                    {showLoader &&
                        Array.from({ length: 8 }).map((_, idx) => (
                            <WalletsAddMoreLoader key={`wallets-add-more-loader-${idx}`} />
                        ))}
                    {!showLoader &&
                        wallets?.map(wallet => (
                            <WalletsAddMoreCard
                                currency={wallet.currency}
                                is_added={wallet.is_added}
                                is_crypto={wallet.is_crypto}
                                key={`wallets_add_more_${wallet.currency}-${wallet.landing_company_name}-${wallet.is_added}`}
                            />
                        ))}
                </div>
                {isDesktop && isHover && (
                    <React.Fragment>
                        <IconButton
                            className='wallets-add-more__carousel-btn wallets-add-more__carousel-btn--prev'
                            color='white'
                            disabled={!prevBtnEnabled}
                            icon={
                                isRtl ? (
                                    <LabelPairedChevronRightLgFillIcon fill='#333333' />
                                ) : (
                                    <LabelPairedChevronLeftLgFillIcon fill='#333333' />
                                )
                            }
                            isRound
                            onClick={scrollPrev}
                            size='lg'
                        />
                        <IconButton
                            className='wallets-add-more__carousel-btn wallets-add-more__carousel-btn--next'
                            color='white'
                            disabled={!nextBtnEnabled}
                            icon={
                                isRtl ? (
                                    <LabelPairedChevronLeftLgFillIcon fill='#333333' />
                                ) : (
                                    <LabelPairedChevronRightLgFillIcon fill='#333333' />
                                )
                            }
                            isRound
                            onClick={scrollNext}
                            size='lg'
                        />
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default WalletsAddMoreCarousel;
