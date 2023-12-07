import React from 'react';
import type { TContractInfo } from '@deriv/shared';
import ChartMarker from './marker';

type ResetContractChartElements = {
    contract_info: TContractInfo;
    is_bottom_widget_visible: boolean;
};

const ResetContractChartElements = ({ contract_info, is_bottom_widget_visible }: ResetContractChartElements) => {
    const { contract_type, entry_spot, reset_time, reset_barrier } = contract_info ?? {};
    const is_reset_call = /CALL/i.test(contract_type ?? '');

    // Gradient logic: when reset_time has come we need to reapply gradient. For CALL shade will be applied to the lowest barrier, for PUT - the the highest barrier
    let y_axis_coordinates: number;
    if (is_reset_call) {
        y_axis_coordinates = Math.min(Number(entry_spot), Number(reset_barrier));
    } else {
        y_axis_coordinates = Math.max(Number(entry_spot), Number(reset_barrier));
    }

    return (
        <React.Fragment>
            <ChartMarker
                marker_config={{
                    ContentComponent: 'div',
                    x: Number(reset_time),
                    y: y_axis_coordinates,
                }}
                marker_content_props={{
                    className: `sc-barrier_gradient sc-barrier_gradient--${is_reset_call ? 'to-bottom' : 'to-top'}`,
                }}
                is_bottom_widget_visible={is_bottom_widget_visible}
                decrease_zIndex
            />
            <ChartMarker
                marker_config={{
                    ContentComponent: 'div',
                    x: Number(reset_time),
                    y: Number(reset_barrier),
                }}
                marker_content_props={{ className: 'sc-reset_barrier' }}
                is_bottom_widget_visible={is_bottom_widget_visible}
                decrease_zIndex
            />
        </React.Fragment>
    );
};

export default React.memo(ResetContractChartElements);
