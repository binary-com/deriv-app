import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel, { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel-react';
import CFDCompareAccountsCarouselButton from './CompareAccountsCarouselButton';
import './CompareAccountsCarousel.scss';

type TCompareAccountsCarousel = {
    children: React.ReactNode;
};

const CompareAccountsCarousel = (props: TCompareAccountsCarousel) => {
    const options: EmblaOptionsType = {
        align: 0,
        containScroll: 'trimSnaps',
    };
    const [emblaRef, emblaApi] = useEmblaCarousel(options);
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onSelect(emblaApi);
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className='wallets-compare-accounts-carousel'>
            <div className='wallets-compare-accounts-carousel__viewport' ref={emblaRef}>
                <div className='wallets-compare-accounts-carousel__container'>{props.children}</div>
            </div>
            <CFDCompareAccountsCarouselButton enabled={prevBtnEnabled} isNext={false} onClick={scrollPrev} />
            <CFDCompareAccountsCarouselButton enabled={nextBtnEnabled} isNext={true} onClick={scrollNext} />
        </div>
    );
};

export default CompareAccountsCarousel;
