import React from 'react';
import PropTypes from 'prop-types';
import Flyout from './flyout.jsx';
import Chart from './chart/chart.jsx';
import Toolbox from './toolbox/toolbox.jsx';
import { tabs_title } from '../constants/bot-contents';
import { connect } from '../stores/connect';
import '../assets/sass/workspace.scss';
import '../assets/sass/toolbox.scss';

const MainContent = ({ active_tab, is_loading, onMount, onUnmount }) => {
    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, [onMount, onUnmount]);

    if (active_tab === tabs_title.WORKSPACE) {
        return (
            <div
                id='scratch_div'
                style={{
                    width: '100vw',
                    height: 'var(--bot-content-height)',
                }}
            >
                {Blockly.derivWorkspace && !is_loading && (
                    <React.Fragment>
                        <Toolbox />
                        <Flyout />
                    </React.Fragment>
                )}
            </div>
        );
    }

    if (active_tab === tabs_title.CHART) {
        return (
            <div
                className='bot__chart-container'
                style={{
                    width: 'var(--bot-content-width)',
                    height: 'var(--bot-content-height)',
                }}
            >
                <Chart />
            </div>
        );
    }

    return null;
};

MainContent.propTypes = {
    active_tab: PropTypes.string,
    is_loading: PropTypes.bool,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
};

export default connect(({ blockly_store, main_content }) => ({
    active_tab: main_content.active_tab,
    is_loading: blockly_store.is_loading,
    onMount: main_content.onMount,
    onUnmount: main_content.onUnmount,
}))(MainContent);
