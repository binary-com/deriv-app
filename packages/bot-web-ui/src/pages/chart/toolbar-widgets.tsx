import React from 'react';
import { useStore } from '@deriv/stores';
import { ChartMode, DrawTools, Share, StudyLegend, ToolbarWidget, Views } from './v1';

type TToolbarWidgetsProps = {
    updateChartType: (chart_type: string) => void;
    updateGranularity: (updateGranularity: number) => void;
    position?: string | null;
};

const ToolbarWidgets = ({ updateChartType, updateGranularity, position }: TToolbarWidgetsProps) => {
    const { ui } = useStore();
    const { is_desktop } = ui;

    return (
        <ToolbarWidget position={position}>
            <ChartMode portalNodeId='modal_root' onChartType={updateChartType} onGranularity={updateGranularity} />
            {is_desktop && (
                <>
                    <StudyLegend portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
                    <Views
                        portalNodeId='modal_root'
                        onChartType={updateChartType}
                        onGranularity={updateGranularity}
                        searchInputClassName='data-hj-whitelist'
                    />
                    <DrawTools portalNodeId='modal_root' />
                    <Share portalNodeId='modal_root' />
                </>
            )}
        </ToolbarWidget>
    );
};

export default ToolbarWidgets;
