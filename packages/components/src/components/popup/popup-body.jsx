import React from 'react';
import PropTypes from 'prop-types';
import Footer from './popup-footer.jsx';
import Tabs from '../tabs';

const renderBody = body => (typeof body === 'function' ? body() : null);
const renderFooter = footer => (typeof footer === 'function' ? footer() : null);

const Body = ({ active_tab_icon_color, background_color, className, tab_icon_color, tabs_detail }) => {
    return (
        <Tabs
            active_icon_color={active_tab_icon_color}
            background_color={background_color}
            className='popup'
            center
            fit_content
            has_active_line={false}
            has_bottom_line={false}
            icon_color={tab_icon_color}
            icon_size={25}
            top
        >
            {tabs_detail.map(detail => {
                return (
                    <div key={detail.id} label={detail.title} icon={detail.icon}>
                        {renderBody(detail.renderBody)}
                        {detail.renderFooter && (
                            <Footer className={className} has_separator={detail.has_footer_separator}>
                                {renderFooter(detail.renderFooter)}
                            </Footer>
                        )}
                    </div>
                );
            })}
        </Tabs>
    );
};

Body.propTypes = {
    active_tab_icon_color: PropTypes.string,
    background_color: PropTypes.string,
    className: PropTypes.string,
    tabs_detail: PropTypes.arrayOf(
        PropTypes.shape({
            has_footer_separator: PropTypes.bool,
            renderBody: PropTypes.func,
            renderFooter: PropTypes.func,
            icon: PropTypes.string,
            id: PropTypes.number,
            title: PropTypes.string,
        })
    ),
    tab_icon_color: PropTypes.string,
};

export default Body;
