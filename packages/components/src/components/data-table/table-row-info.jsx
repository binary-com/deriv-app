import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ThemedScrollbars from '../themed-scrollbars';
import Text from '../text';

const TableRowInfo = ({ replace, is_footer, cells, className }) => {
    const [show_details, setShowDetails] = React.useState(false);

    const toggleDetails = () => {
        if (replace) {
            setShowDetails(!show_details);
        }
    };

    return (
        <div
            onClick={is_footer || !replace ? undefined : toggleDetails}
            className={classNames(className, { 'statement__row--detail': show_details })}
        >
            {show_details ? (
                <ThemedScrollbars height='80px'>
                    <div>
                        {replace?.component ?? (
                            <Text as='p' size='xs' align='center' className='statement__row--detail-text'>
                                {replace.message}
                            </Text>
                        )}
                    </div>
                </ThemedScrollbars>
            ) : (
                cells
            )}
        </div>
    );
};

TableRowInfo.propTypes = {
    cells: PropTypes.arrayOf(PropTypes.node),
    className: PropTypes.string,
    replace: PropTypes.shape({
        component: PropTypes.func,
        message: PropTypes.string,
    }),
    is_footer: PropTypes.bool,
};

export default TableRowInfo;
