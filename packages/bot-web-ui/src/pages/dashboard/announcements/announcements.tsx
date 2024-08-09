import React, { useEffect, useRef, useState } from 'react';
import { Text } from '@deriv/components';
import { Notifications as Announcement } from '@deriv-com/ui';
import { StandaloneBullhornRegularIcon } from '@deriv/quill-icons';
import { load } from '@deriv/bot-skeleton';
import { save_types } from '@deriv/bot-skeleton/src/constants/save-type';
import clsx from 'clsx';
import { localize } from '@deriv/translations';
import AnnouncementDialog from './announcement-dialog';
import { ANNOUNCEMENTS } from './config';
import './announcements.scss';
import { DBOT_TABS } from 'Constants/bot-contents';
import { IconAnnounce, MessageAnnounce, TitleAnnounce } from './announcement-components';

type TAnnouncements = {
    is_mobile?: boolean;
    handleTabChange: (item: number) => void;
};

const Announcements = ({ is_mobile, handleTabChange }: TAnnouncements) => {
    const [isAnnounceDialogOpen, setIsAnnounceDialogOpen] = useState(false);
    const [isOpenAnnounceList, setIsOpenAnnounceList] = React.useState(false);
    const [amountAnnounce, setAmountAnnounce] = useState({} as Record<string, boolean>);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const accumulator_announcement = ANNOUNCEMENTS.ACCUMULATOR_ANNOUNCE;
    const is_active_announce_1 = amountAnnounce?.announce_1;
    const is_active_announce_2 = amountAnnounce?.announce_2;
    const is_active_announce_3 = amountAnnounce?.announce_3;

    const handleClickOutside = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (
            !wrapperRef?.current?.contains(event.target as HTMLButtonElement) &&
            !buttonRef?.current?.contains(event.target as HTMLButtonElement)
        ) {
            setIsOpenAnnounceList(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleAnnounceSubmit = (data: Record<string, boolean>) => {
        setAmountAnnounce(data);
        localStorage?.setItem('bot-announcements', JSON.stringify(data));
    };

    const announcements = [
        {
            icon: <IconAnnounce announce={is_active_announce_1} />,
            title: (
                <TitleAnnounce
                    title={localize('Moving Binary Bot strategies to Deriv Bot')}
                    announce={is_active_announce_1}
                />
            ),
            message: (
                <MessageAnnounce
                    message={localize('Follow these steps for a smooth transition of your strategies.')}
                    date='6 Aug 2024 00:00 UTC'
                    announce={is_active_announce_1}
                />
            ),
            buttonAction: () => {
                handleAnnounceSubmit({ ...amountAnnounce, announce_1: false });
            },
            actionText: '',
        },
        {
            icon: <IconAnnounce announce={is_active_announce_2} />,
            title: (
                <TitleAnnounce
                    title={localize('Impact of Google Blockly V10 update')}
                    announce={is_active_announce_2}
                />
            ),
            message: (
                <MessageAnnounce
                    message={localize('This update means variable names in XML files are no longer case-sensitive.')}
                    date='6 Aug 2024 00:00 UTC'
                    announce={is_active_announce_2}
                />
            ),
            buttonAction: () => {
                handleAnnounceSubmit({ ...amountAnnounce, announce_2: false });
            },
            actionText: '',
        },
        {
            icon: <IconAnnounce announce={is_active_announce_3} />,
            title: (
                <TitleAnnounce title={localize('Accumulators is now on Deriv Bot')} announce={is_active_announce_3} />
            ),
            message: (
                <MessageAnnounce
                    message={localize('Boost your trading strategy with Accumulators.')}
                    date='20 July 2024 00:00 UTC'
                    announce={is_active_announce_3}
                />
            ),
            buttonAction: () => {
                setIsAnnounceDialogOpen(true);
                setIsOpenAnnounceList(prev => !prev);
                handleAnnounceSubmit({ ...amountAnnounce, announce_3: false });
            },
            actionText: '',
        },
    ];

    useEffect(() => {
        let data: Record<string, boolean> | null = null;
        data = JSON.parse(localStorage.getItem('bot-announcements') ?? '{}');

        if (data && Object.keys(data).length !== 0) {
            setAmountAnnounce(data);
        } else {
            const obj_announcements = Object.fromEntries(
                Array.from({ length: announcements.length }, (_, i) => [`announce_${i + 1}`, true])
            );
            setAmountAnnounce(obj_announcements);
            localStorage?.setItem('bot-announcements', JSON.stringify(obj_announcements));
        }
    }, [announcements.length]);

    const handleOnCancelAccumulator = () => {
        handleTabChange(DBOT_TABS.TUTORIAL);
    };

    const handleOnConfirmAccumulator = async () => {
        handleTabChange(DBOT_TABS.BOT_BUILDER);
        const strategy_xml = await import(
            /* webpackChunkName: `[request]` */ '@deriv/bot-skeleton/src/scratch/xml/main.xml'
        );
        const strategy_dom = Blockly.utils.xml.textToDom(strategy_xml.default);
        const modifyFieldDropdownValues = (name: string, value: string) => {
            const name_list = `${name.toUpperCase()}_LIST`;
            const el_blocks = strategy_dom?.querySelectorAll(`field[name="${name_list}"]`);

            el_blocks?.forEach((el_block: HTMLElement) => {
                el_block.textContent = value;
            });
        };
        modifyFieldDropdownValues('tradetypecat', 'accumulator');

        const { derivWorkspace: workspace } = Blockly;

        await load({
            block_string: Blockly.Xml.domToText(strategy_dom),
            file_name: 'Strategy with accumulator trade type',
            workspace,
            from: save_types.UNSAVED,
            drop_event: null,
            strategy_id: null,
            showIncompatibleStrategyDialog: null,
        });
    };

    const countActiveAnnouncements = (): number => {
        return Object.values(amountAnnounce as Record<string, boolean>).reduce((count: number, value: boolean) => {
            return value === true ? count + 1 : count;
        }, 0);
    };

    const number_ammount_announce = countActiveAnnouncements();

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsOpenAnnounceList(prevState => !prevState);
    };

    return (
        <div className='announcements'>
            <button
                className='announcements__button'
                onClick={handleButtonClick}
                data-testid='btn-announcements'
                ref={buttonRef}
            >
                <StandaloneBullhornRegularIcon fill='#000000' iconSize='sm' />
                {!is_mobile && (
                    <Text size='xs' line_height='s' className='announcements__label'>
                        {localize('Announcements')}
                    </Text>
                )}
                {number_ammount_announce !== 0 && (
                    <div className='announcements__amount' data-testid='announcements__amount'>
                        <p>{number_ammount_announce}</p>
                    </div>
                )}
            </button>
            <div className='notifications__wrapper' ref={wrapperRef}>
                <Announcement
                    className={clsx('', {
                        'notifications__wrapper--mobile': is_mobile,
                        'notifications__wrapper--desktop': !is_mobile,
                    })}
                    clearNotificationsCallback={() => {
                        Object.entries(amountAnnounce).forEach(([key]) => {
                            (amountAnnounce as { [key: string]: boolean })[key] = false;
                        });
                    }}
                    componentConfig={{
                        clearButtonText: localize('Mark all as read'),
                        modalTitle: localize('Announcement'),
                        noNotificationsMessage: localize('No announcements MESSAGE'),
                        noNotificationsTitle: localize('No announcements'),
                    }}
                    isOpen={isOpenAnnounceList}
                    notifications={announcements}
                    setIsOpen={() => handleButtonClick}
                />
            </div>
            <AnnouncementDialog
                announcement={accumulator_announcement}
                isAnnounceDialogOpen={isAnnounceDialogOpen}
                setIsAnnounceDialogOpen={setIsAnnounceDialogOpen}
                handleOnCancel={handleOnCancelAccumulator}
                handleOnConfirm={handleOnConfirmAccumulator}
            />
        </div>
    );
};

export default Announcements;
