import React from 'react';
import { Analytics } from '@deriv-com/analytics';
import { SessionStore } from '@deriv/shared';
import { getAllowedLanguages, Localize } from '@deriv/translations';
import { DerivLightIntuitivePlatformsIcon } from '@deriv/quill-icons';
import { TEbooksUrl } from 'Components/banners/book-banner/book-banner';
import { Modal, Text, Heading, ThemeProvider } from '@deriv-com/quill-ui';
import { useStore } from '@deriv/stores';
import './book-modal.scss';

type TBookBannerTemplate = {
    e_book_show_way?: string;
    e_books_url?: TEbooksUrl;
    e_book_from_landing?: keyof TEbooksUrl;
    lang?: ReturnType<typeof getAllowedLanguages>;
};

const BookModalTemplate = ({ e_book_show_way, e_books_url, e_book_from_landing, lang }: TBookBannerTemplate) => {
    const [is_modal_shows, setIsPopUpShows] = React.useState(true);
    const { traders_hub, ui } = useStore();
    const { is_mobile, is_dark_mode_on } = ui;
    const { selected_account_type } = traders_hub;

    const analytics_data: Parameters<typeof Analytics.trackEvent>[1] = {
        form_name: 'e_book_from_landing',
        account_mode: selected_account_type,
        popup_name: e_book_from_landing,
        popup_type: e_book_show_way,
    };

    React.useEffect(() => {
        Analytics.trackEvent('ce_tradershub_popup', {
            action: 'open',
            ...analytics_data,
        });
    }, []);
    const downloadBook = () => {
        Analytics.trackEvent('ce_tradershub_popup', {
            action: 'click_download',
            ...analytics_data,
        });
        const book = e_books_url[e_book_from_landing];
        return window.open(book[lang] || book.EN);
    };

    return (
        <ThemeProvider theme={is_dark_mode_on ? 'dark' : 'light'}>
            <Modal
                isOpened={is_modal_shows}
                showHandleBar
                isMobile={is_mobile}
                showCrossIcon
                disableCloseOnOverlay
                hasFooter={e_book_show_way === 'popup-with-link'}
                toggleModal={() => {
                    Analytics.trackEvent('ce_tradershub_popup', {
                        action: 'close',
                        ...analytics_data,
                    });
                    setIsPopUpShows(false);
                    SessionStore.remove('show_book');
                }}
                showPrimaryButton={e_book_show_way === 'popup-with-link'}
                primaryButtonCallback={downloadBook}
                primaryButtonLabel={<Localize i18n_default_text='Download e-book' />}
            >
                <Modal.Header image={<DerivLightIntuitivePlatformsIcon height='120px' width='120px' />} />
                <Modal.Body className={e_book_show_way !== 'popup-with-link' && 'book-modal-template'}>
                    <Heading.H4>
                        <Localize i18n_default_text='Your e-book is ready to download' />
                    </Heading.H4>
                    <Text>
                        {e_book_show_way === 'popup-with-link' ? (
                            <Localize i18n_default_text='We’ve sent your e-book to your email. You can also download it here.' />
                        ) : (
                            <Localize i18n_default_text='We’ve sent your e-book. Check your email to download it.' />
                        )}
                    </Text>
                </Modal.Body>
            </Modal>
        </ThemeProvider>
    );
};

export default BookModalTemplate;
