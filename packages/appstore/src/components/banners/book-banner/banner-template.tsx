import { useState, useEffect, Fragment } from 'react';
import { useStore } from '@deriv/stores';
import { Analytics } from '@deriv-com/analytics';
import { SessionStore } from '@deriv/shared';
import { getAllowedLanguages, Localize } from '@deriv/translations';
import { LabelPairedCircleChevronDownXlBoldIcon, LabelPairedXmarkLgBoldIcon } from '@deriv/quill-icons';
import { TEbooksUrl } from 'Components/banners/book-banner/book-banner';

type TBookBannerTemplate = {
    e_book_show_way: string;
    e_books_url: TEbooksUrl;
    e_book_from_landing: keyof TEbooksUrl;
    lang: ReturnType<typeof getAllowedLanguages>;
};

const BookBannerTemplate = ({ e_book_show_way, e_books_url, e_book_from_landing, lang }: TBookBannerTemplate) => {
    const [is_banner_shows, setIsBannerShows] = useState(true);
    const { traders_hub, ui } = useStore();
    const { selected_account_type } = traders_hub;
    const analytics_data: Parameters<typeof Analytics.trackEvent>[1] = {
        banner_name: e_book_from_landing,
        account_mode: selected_account_type,
    };

    useEffect(() => {
        Analytics.trackEvent('ce_tradershub_banner', {
            action: 'open',
            ...analytics_data,
        });
    }, []);

    return (
        <Fragment>
            {is_banner_shows ? (
                <div id='e-book-banner' className='book-banner-template'>
                    <div className='book-banner-template__left'>
                        <LabelPairedCircleChevronDownXlBoldIcon width='24' height='24' fill='#00822A' />
                        {e_book_show_way === 'banner-with-link' ? (
                            <div className='book-banner-template__content'>
                                <label>
                                    <Localize i18n_default_text='We’ve sent your e-book to your email. You can also download it here.' />
                                </label>
                                <a
                                    href={e_books_url[e_book_from_landing][lang] || e_books_url[e_book_from_landing].EN}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    onClick={() => {
                                        Analytics.trackEvent('ce_tradershub_banner', {
                                            action: 'click download',
                                            ...analytics_data,
                                        });
                                    }}
                                >
                                    <Localize i18n_default_text='Download e-book' />
                                </a>
                            </div>
                        ) : (
                            <div className='book-banner-template__content'>
                                <label>
                                    <Localize i18n_default_text='We’ve sent your e-book. Check your email to download it.' />
                                </label>
                            </div>
                        )}
                    </div>
                    <LabelPairedXmarkLgBoldIcon
                        className='book-banner-template__cancel'
                        width='24'
                        height='24'
                        fill='var(--text-prominent)'
                        onClick={() => {
                            Analytics.trackEvent('ce_tradershub_banner', {
                                action: 'close',
                                ...analytics_data,
                            });
                            SessionStore.remove('show_book');
                            setIsBannerShows(false);
                        }}
                    />
                </div>
            ) : null}
        </Fragment>
    );
};

export default BookBannerTemplate;
