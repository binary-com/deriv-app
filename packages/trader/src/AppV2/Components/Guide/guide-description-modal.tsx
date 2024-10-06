import React from 'react';
import { ActionSheet, Heading, Chip, Text } from '@deriv-com/quill-ui';
import { VideoPlayer } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { clickAndKeyEventHandler } from '@deriv/shared';
import { getDescriptionVideoIds } from 'AppV2/Utils/contract-description-utils';
import TradeDescription from './Description/trade-description';
import VideoPreview from './Description/video-preview';

type TGuideDescriptionModal = {
    contract_list: { tradeType: React.ReactNode; id: string }[];
    is_dark_mode_on?: boolean;
    is_open?: boolean;
    onChipSelect: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onClose: () => void;
    onTermClick: (term: string) => void;
    selected_contract_type: string;
    show_guide_for_selected_contract?: boolean;
};

const GuideDescriptionModal = ({
    contract_list,
    is_dark_mode_on,
    is_open,
    onChipSelect,
    onClose,
    onTermClick,
    selected_contract_type,
    show_guide_for_selected_contract,
}: TGuideDescriptionModal) => {
    const [is_video_player_opened, setIsVideoPlayerOpened] = React.useState(false);
    const modal_ref = React.useRef<HTMLDialogElement>(null);

    const video_src = getDescriptionVideoIds(selected_contract_type, is_dark_mode_on);

    const toggleVideoPlayer = (e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        clickAndKeyEventHandler(() => setIsVideoPlayerOpened(!is_video_player_opened), e);
    };

    React.useEffect(() => {
        if (modal_ref.current) is_video_player_opened ? modal_ref.current.showModal() : modal_ref.current.close();
    }, [is_video_player_opened]);

    return (
        <React.Fragment>
            <ActionSheet.Root isOpen={is_open} onClose={onClose} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <ActionSheet.Content className='guide__wrapper--content'>
                        <Heading.H4 className='guide__title'>
                            {show_guide_for_selected_contract ? (
                                selected_contract_type
                            ) : (
                                <Localize i18n_default_text='Trade types' />
                            )}
                        </Heading.H4>
                        {!show_guide_for_selected_contract && (
                            <div className='guide__menu'>
                                {contract_list.map(({ tradeType, id }: { tradeType: React.ReactNode; id: string }) => (
                                    <Chip.Selectable
                                        key={id}
                                        onChipSelect={onChipSelect}
                                        selected={id === selected_contract_type}
                                    >
                                        <Text size='sm'>{tradeType}</Text>
                                    </Chip.Selectable>
                                ))}
                            </div>
                        )}
                        <div className='guide__contract-description' key={selected_contract_type}>
                            <TradeDescription contract_type={selected_contract_type} onTermClick={onTermClick} />
                            <VideoPreview
                                contract_type={selected_contract_type}
                                toggleVideoPlayer={toggleVideoPlayer}
                                video_src={video_src}
                            />
                        </div>
                    </ActionSheet.Content>
                    <ActionSheet.Footer
                        alignment='vertical'
                        primaryAction={{
                            content: <Localize i18n_default_text='Got it' />,
                            onAction: onClose,
                        }}
                        className='guide__button'
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
            {is_video_player_opened && (
                <dialog
                    ref={modal_ref}
                    onClick={toggleVideoPlayer}
                    onKeyDown={toggleVideoPlayer}
                    className='modal-player'
                >
                    <div onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}>
                        <VideoPlayer
                            className='modal-player__wrapper'
                            data_testid='dt_video_player'
                            height='180px'
                            is_mobile
                            increased_drag_area
                            src={video_src}
                        />
                    </div>
                </dialog>
            )}
        </React.Fragment>
    );
};

export default React.memo(GuideDescriptionModal);
