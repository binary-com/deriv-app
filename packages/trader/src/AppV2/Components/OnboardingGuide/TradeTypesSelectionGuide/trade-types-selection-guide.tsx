import React from 'react';
import { Modal } from '@deriv-com/quill-ui';
import { useLocalStorageData } from '@deriv/hooks';
import { Localize } from '@deriv/translations';
import { UNIFIED_MODE_VIDEO_ID } from 'Modules/Trading/Helpers/video-config';
import StreamIframe from '../../StreamIframe';

const TradeTypesSelectionGuide = () => {
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const guide_timeout_ref = React.useRef<ReturnType<typeof setTimeout>>();

    const [guide_dtrader_v2, setGuideDtraderV2] = useLocalStorageData<Record<string, boolean>>('guide_dtrader_v2', {
        trade_types_selection: false,
        trade_page: false,
        positions_page: false,
    });
    const { trade_types_selection } = guide_dtrader_v2 || {};

    const onFinishGuide = () => {
        setIsModalOpen(false);
        setGuideDtraderV2({ ...guide_dtrader_v2, trade_types_selection: true });
    };

    React.useEffect(() => {
        if (!trade_types_selection) guide_timeout_ref.current = setTimeout(() => setIsModalOpen(true), 800);

        return () => clearTimeout(guide_timeout_ref.current);
    }, [trade_types_selection]);

    if (trade_types_selection) return null;

    return (
        <Modal
            isOpened={is_modal_open}
            isNonExpandable
            isMobile
            showHandleBar
            shouldCloseModalOnSwipeDown
            toggleModal={onFinishGuide}
            primaryButtonLabel={<Localize i18n_default_text='Got it' />}
            primaryButtonCallback={onFinishGuide}
        >
            <Modal.Header
                image={<StreamIframe src={UNIFIED_MODE_VIDEO_ID.trade_type_selection} title='trade_types_selection' />}
                title={<Localize i18n_default_text='Manage your trade types' />}
            />
            <Modal.Body>
                <Localize i18n_default_text='Pin, rearrange, or remove your favorite trade types for easy access.' />
            </Modal.Body>
        </Modal>
    );
};

export default React.memo(TradeTypesSelectionGuide);
