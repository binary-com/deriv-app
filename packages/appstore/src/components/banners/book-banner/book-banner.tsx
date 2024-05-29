import React from 'react';
import { SessionStore } from '@deriv/shared';
import { getAllowedLanguages, getLanguage } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import BookBannerTemplate from 'Components/banners/book-banner/banner-template';
import BookModalTemplate from 'Components/modals/book-modal/book-modal';

type TEbooks = 'forex-ebook' | 'stock-ebook' | 'cryptocurrencies-ebook' | 'synthetic-indices-ebook' | 'chart-patterns';
export type TEbooksUrl = { [B in TEbooks]: Record<keyof ReturnType<typeof getAllowedLanguages>, string> };

const e_books_url: TEbooksUrl = {
    'forex-ebook': {
        EN: 'https://deriv.link/ebook-forex-en-lq',
        FR: 'https://deriv.link/ebook-forex-fr-lq',
        PT: 'https://deriv.link/ebook-forex-pt-lq',
        ES: 'https://deriv.link/ebook-forex-sp-lq',
        VI: 'https://deriv.link/ebook-forex-vn-lq',
    },
    'stock-ebook': {
        EN: 'https://deriv.link/ebook-stocks-en-lq',
        FR: 'https://deriv.link/ebook-stocks-fr-lq',
        PT: 'https://deriv.link/ebook-stocks-pt-lq',
        ES: 'https://deriv.link/ebook-stocks-sp-lq',
    },
    'cryptocurrencies-ebook': {
        EN: 'https://deriv.link/ebook-crypto-en-lq',
        FR: 'https://deriv.link/ebook-crypto-fr-lq',
        PT: 'https://deriv.link/ebook-crypto-pt-lq',
        ES: 'https://deriv.link/ebook-crypto-fr-lq',
    },
    'synthetic-indices-ebook': {
        EN: 'https://deriv.link/ebook-synthetics-en-lq',
        FR: 'https://deriv.link/ebook-synthetics-fr-lq',
        PT: 'https://deriv.link/ebook-synthetics-pt-lq',
        ES: 'https://deriv.link/ebook-synthetics-sp-lq',
        VI: 'https://deriv.link/ebook-synthetics-vn-lq',
    },
    'chart-patterns': {
        EN: 'https://deriv.link/ebook-10chart-en-lq',
        FR: 'https://deriv.link/ebook-10charts-fr-lq',
        PT: 'https://deriv.link/ebook-10charts-pt-lq',
        ES: 'https://deriv.link/ebook-10charts-sp-lq',
    },
};
const e_book_show_way: string = Analytics.getFeatureValue('e_book', 'inactive');

const BookBanner = () => {
    const e_book_from_landing: TEbooks = SessionStore.get('show_book');
    const lang = getLanguage();

    if (e_book_from_landing && e_book_show_way?.includes('banner')) {
        return (
            <BookBannerTemplate
                e_book_show_way={e_book_show_way}
                e_books_url={e_books_url}
                e_book_from_landing={e_book_from_landing}
                lang={lang}
            />
        );
    }

    if (e_book_from_landing && e_book_show_way?.includes('popup')) {
        return (
            <BookModalTemplate
                e_book_show_way={e_book_show_way}
                e_books_url={e_books_url}
                e_book_from_landing={e_book_from_landing}
                lang={lang}
            />
        );
    }

    return null;
};
export default BookBanner;
