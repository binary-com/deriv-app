import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import MobileDescription from './mobile-description.jsx';

const DataListRow = ({ action_desc, desc_titles, destination_link, row_gap, row_key, rowRenderer, ...other_props }) => {
    const [show_desc, setShowDesc] = React.useState(false);

    return (
        <div className='data-list__row--wrapper' style={{ paddingBottom: `${row_gap || 0}px` }}>
            {destination_link ? (
                <NavLink
                    className='data-list__item--wrapper'
                    id={`dt_reports_contract_${row_key}`}
                    to={{
                        pathname: destination_link,
                        state: {
                            from_table_row: true,
                        },
                    }}
                >
                    <div className='data-list__item'>{rowRenderer({ ...other_props })}</div>
                </NavLink>
            ) : (
                <div className='data-list__item--wrapper'>
                    {action_desc ? (
                        <div className={'data-list__item'} onClick={() => setShowDesc(!show_desc)}>
                            {show_desc ? (
                                <div className={'data-list__desc--wrapper'}>
                                    {action_desc.component ? (
                                        <div>{action_desc.component}</div>
                                    ) : (
                                        <MobileDescription desc={action_desc} desc_titles={desc_titles} />
                                    )}
                                </div>
                            ) : (
                                rowRenderer({ ...other_props })
                            )}
                        </div>
                    ) : (
                        <div className='data-list__item'>{rowRenderer({ ...other_props })}</div>
                    )}
                </div>
            )}
        </div>
    );
};

DataListRow.propTypes = {
    action_desc: PropTypes.object,
    desc_titles: PropTypes.arrayOf(PropTypes.string),
    destination_link: PropTypes.string,
    row_gap: PropTypes.number,
    row_key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rowRenderer: PropTypes.func,
};

export default React.memo(DataListRow);
