import React from 'react';
import { Analytics } from '@deriv-com/analytics';
import { getAllowedLanguages, Localize } from '@deriv/translations';
import { LabelPairedCircleChevronDownXlBoldIcon, LabelPairedXmarkLgBoldIcon } from '@deriv/quill-icons';
import { TEbooksUrl } from 'Components/banners/book-banner/book-banner';
import { SessionStore } from '@deriv/shared';

type TBookBannerTemplate = {
    e_books_url: TEbooksUrl;
    e_book_from_landing: keyof TEbooksUrl;
    lang: ReturnType<typeof getAllowedLanguages>;
};
const onCancel = () => {
    SessionStore.remove('show_book');
    document.getElementById('e-book-banner')?.classList.add('hidden');
};
const trackEbookBanner = (is_clicked: boolean) =>
    Analytics.trackEvent('ce_ebook_banner', { action: 'close', link_was_opened: is_clicked ? 'yes' : 'no' });

const BookBannerTemplate = ({ e_books_url, e_book_from_landing, lang }: TBookBannerTemplate) => {
    const [is_clicked, setIsClicked] = React.useState<boolean>(false);

    return (
        <div id='e-book-banner' className='book-banner-template'>
            <div className='book-banner-template__left'>
                <LabelPairedCircleChevronDownXlBoldIcon width='24' height='24' fill='#00822A' />
                <div className='book-banner-template__content'>
                    <label>
                        <Localize
                            i18n_default_text={'Your e-book has been emailed to you and is ready for download.'}
                        />
                    </label>
                    <a
                        href={e_books_url[e_book_from_landing][lang] || e_books_url[e_book_from_landing].EN}
                        target='_blank'
                        rel='noopener noreferrer'
                        onClick={() => {
                            trackEbookBanner(is_clicked);
                            setIsClicked(true);
                        }}
                    >
                        <Localize i18n_default_text={'Download e-book'} />
                    </a>
                </div>
            </div>
            <LabelPairedXmarkLgBoldIcon
                className='book-banner-template__cancel'
                width='24'
                height='24'
                onClick={() => {
                    trackEbookBanner(is_clicked);
                    onCancel();
                }}
            />
        </div>
    );
};

export default BookBannerTemplate;
