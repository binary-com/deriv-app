import classNames from 'classnames';
import React from 'react';
import debounce from 'lodash.debounce';
import ThemedScrollbars from '../themed-scrollbars';
import { TTableRowItem } from '../types/common.types';

type TTableRowIndex = {
    replace: TTableRowItem | undefined;
    is_footer: boolean;
    cells: React.ReactElement;
    className?: string;
    is_dynamic_height: boolean;
    measure?: () => void;
};

const TableRowInfo = ({ replace, is_footer, cells, className, is_dynamic_height, measure }: TTableRowIndex) => {
    const [show_details, setShowDetails] = React.useState(false);

    const debouncedHideDetails = React.useMemo(
        () =>
            debounce(() => {
                setShowDetails(false);
            }, 5000),
        []
    );

    const toggleDetails = () => {
        if (replace) {
            setShowDetails(!show_details);
            debouncedHideDetails();
        }
    };
    React.useEffect(() => {
        if (is_dynamic_height) {
            measure?.();
        }
    }, [show_details, is_dynamic_height, measure]);

    React.useEffect(() => {
        return debouncedHideDetails.cancel;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (is_dynamic_height) {
        return (
            <div
                onClick={is_footer || !replace ? undefined : toggleDetails}
                className={classNames(className, { 'statement__row--detail': show_details })}
            >
                {show_details && typeof replace === 'object' ? <div>{replace?.component}</div> : cells}
            </div>
        );
    }
    return (
        <div
            onClick={is_footer || !replace ? undefined : toggleDetails}
            className={classNames(className, { 'statement__row--detail': show_details })}
        >
            {show_details && typeof replace === 'object' ? (
                <ThemedScrollbars height='80px'>
                    <div>{replace?.component}</div>
                </ThemedScrollbars>
            ) : (
                cells
            )}
        </div>
    );
};

export default TableRowInfo;
