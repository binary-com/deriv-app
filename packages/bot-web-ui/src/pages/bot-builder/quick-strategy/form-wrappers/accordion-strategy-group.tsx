import React from 'react';
import { observer, useStore } from '@deriv/stores';
import Accordion from '../../../tutorials/dbot-tours/common/accordion';
import StrategyDescription from '../descriptions/strategy-description';
import { TDescription, TDescriptionItem } from '../types';

type TAccordionStrategyGroupProps = {
    tutorial_selected_strategy?: string;
    grouped_objects_by_title: TDescription;
    expanded_subtitles_storage: { [key: string]: boolean };
    setExpandedSubtitlesStorage: (value: { [key: string]: boolean }) => void;
};

type TDescriptionContent = {
    item: TDescriptionItem[] | string;
    font_size: string;
};

export const DescriptionContent = ({ item, font_size }: TDescriptionContent) => {
    const content_data: TDescriptionItem[] | string = Array.isArray(item) ? item : item.slice(1);
    return (
        <>
            {Array.isArray(content_data) &&
                content_data?.map(item => (
                    <React.Fragment key={item.id}>
                        <StrategyDescription item={item} font_size={font_size} />
                    </React.Fragment>
                ))}
        </>
    );
};

const AccordionStrategyGroup = observer(
    ({
        tutorial_selected_strategy,
        grouped_objects_by_title,
        expanded_subtitles_storage,
        setExpandedSubtitlesStorage,
    }: TAccordionStrategyGroupProps) => {
        const { ui } = useStore();
        const { is_desktop } = ui;
        const desktop_font_size = tutorial_selected_strategy ? 's' : 'xs';
        const font_size: string = React.useMemo<string>(
            () => (is_desktop ? desktop_font_size : 'xs'),
            [is_desktop, desktop_font_size]
        );

        return (
            <>
                {Array.isArray(grouped_objects_by_title) &&
                    (grouped_objects_by_title as TDescriptionItem[][]).map((data: TDescriptionItem[]) => {
                        const subtitle_value = data?.[0]?.content?.[0] ?? '';
                        return (
                            <Accordion
                                key={`accordion-${subtitle_value}`}
                                content_data={{
                                    header: subtitle_value,
                                    content: <DescriptionContent item={data} font_size={font_size} />,
                                }}
                                expanded={!!data[0]?.expanded}
                                is_cursive={false}
                                no_collapsible={data[0]?.no_collapsible}
                                has_subtitle={!!subtitle_value}
                                expanded_subtitles_storage={expanded_subtitles_storage}
                                setExpandedSubtitlesStorage={setExpandedSubtitlesStorage}
                                font_size={font_size}
                            />
                        );
                    })}
            </>
        );
    }
);

export default AccordionStrategyGroup;
