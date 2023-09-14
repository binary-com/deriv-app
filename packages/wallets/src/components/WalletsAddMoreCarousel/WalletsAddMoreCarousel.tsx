import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel, { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel-react';
import { useAvailableWallets } from '@deriv/api';
import useDevice from '../../hooks/useDevice';

const WalletsAddMoreCarousel = () => {
    const { is_mobile } = useDevice();
    const { data } = useAvailableWallets();
    const options: EmblaOptionsType = {
        align: 0,
        containScroll: 'trimSnaps',
    };

    const [WalletsAddMoreRef, emblaApi] = useEmblaCarousel(options);
    const [is_hovered, setIsHovered] = useState(is_mobile);
    const [prev_btn_enabled, setPrevBtnEnabled] = useState(false);
    const [next_btn_enabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = (embla_api: EmblaCarouselType) => {
            setPrevBtnEnabled(embla_api.canScrollPrev());
            setNextBtnEnabled(embla_api.canScrollNext());
        };

        onSelect(emblaApi);
        emblaApi.on('reInit', onSelect);
        emblaApi.reInit({ watchDrag: is_mobile });
        emblaApi.on('select', onSelect);
    }, [emblaApi, is_mobile]);

    return (
        <React.Fragment>
            <div className='wallets-add-more'>
                <h2 className='wallets-add-more__header'>Add more Wallets</h2>
                <div
                    className='wallets-add-more__carousel'
                    data-testid='dt-wallets-add-more'
                    ref={WalletsAddMoreRef}
                    onMouseEnter={() => !is_mobile && setIsHovered(true)}
                    onMouseLeave={() => !is_mobile && setIsHovered(false)}
                >
                    <div className='wallets-add-more__carousel-wrapper'>
                        {data?.map(item => (
                            <div className='wallets-add-more__card' key={item.currency}>
                                {item.currency}
                            </div>
                        ))}
                    </div>
                    {!is_mobile && is_hovered && (
                        <React.Fragment>
                            <button
                                className='wallets-add-more__carousel-btn wallets-add-more__carousel-btn--prev'
                                onClick={scrollPrev}
                                disabled={!prev_btn_enabled}
                            >
                                a
                            </button>
                            <button
                                className='wallets-add-more__carousel-btn wallets-add-more__carousel-btn--next'
                                onClick={scrollNext}
                                disabled={!next_btn_enabled}
                            >
                                b
                            </button>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default WalletsAddMoreCarousel;
