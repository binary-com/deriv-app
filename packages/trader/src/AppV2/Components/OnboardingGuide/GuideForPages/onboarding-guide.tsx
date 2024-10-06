import React from 'react';
import { Modal } from '@deriv-com/quill-ui';
import { useLocalStorageData } from '@deriv/hooks';
import { Localize } from '@deriv/translations';
import GuideContainer from './guide-container';
import OnboardingVideo from './onboarding-video';

type TOnboardingGuideProps = {
    type?: 'trade_page' | 'positions_page';
    callback?: () => void;
};

const OnboardingGuide = ({ type = 'trade_page', callback }: TOnboardingGuideProps) => {
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const [should_run_guide, setShouldRunGuide] = React.useState(false);
    const guide_timeout_ref = React.useRef<ReturnType<typeof setTimeout>>();
    const is_button_clicked_ref = React.useRef(false);

    const [guide_dtrader_v2, setGuideDtraderV2] = useLocalStorageData<Record<string, boolean>>('guide_dtrader_v2', {
        trade_types_selection: false,
        trade_page: false,
        positions_page: false,
    });

    const is_trade_page_guide = type === 'trade_page';

    const onFinishGuide = React.useCallback(() => {
        setShouldRunGuide(false);
        setGuideDtraderV2({ ...guide_dtrader_v2, [type]: true });
        callback?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setGuideDtraderV2]);

    const onGuideSkip = () => {
        if (is_button_clicked_ref.current) return;
        onFinishGuide();
        setIsModalOpen(false);
    };

    const onGuideStart = () => {
        is_button_clicked_ref.current = true;
        setShouldRunGuide(true);
        setIsModalOpen(false);
    };

    const modal_content = {
        image: <OnboardingVideo type={type} />,
        title: <Localize i18n_default_text='View your positions' />,
        content: (
            <Localize i18n_default_text='You can view your open and closed positions here. Tap an item for more details.' />
        ),
        button_label: <Localize i18n_default_text='Got it' />,
        primaryButtonCallback: onGuideSkip,
        ...(is_trade_page_guide
            ? {
                  title: <Localize i18n_default_text='Welcome to the new Deriv Trader' />,
                  content: (
                      <Localize i18n_default_text='Enjoy a smoother, more intuitive trading experience. Here’s a quick tour to get you started.' />
                  ),
                  button_label: <Localize i18n_default_text="Let's begin" />,
                  primaryButtonCallback: onGuideStart,
              }
            : {}),
    };

    React.useEffect(() => {
        if (!guide_dtrader_v2?.[type]) guide_timeout_ref.current = setTimeout(() => setIsModalOpen(true), 800);

        return () => clearTimeout(guide_timeout_ref.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guide_dtrader_v2?.[type]]);

    return (
        <React.Fragment>
            <Modal
                isOpened={is_modal_open}
                isNonExpandable
                isMobile
                showHandleBar
                shouldCloseModalOnSwipeDown
                toggleModal={onGuideSkip}
                primaryButtonLabel={modal_content.button_label}
                primaryButtonCallback={modal_content.primaryButtonCallback}
            >
                <Modal.Header image={modal_content.image} title={modal_content.title} />
                <Modal.Body>{modal_content.content}</Modal.Body>
            </Modal>
            {is_trade_page_guide && <GuideContainer should_run={should_run_guide} onFinishGuide={onFinishGuide} />}
        </React.Fragment>
    );
};

export default React.memo(OnboardingGuide);
