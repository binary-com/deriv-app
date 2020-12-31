import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ArrayRenderer from './array-renderer.jsx';
import Icon from '../icon';

const ExpansionPanel = ({ message, onResize }) => {
    const [is_open, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        if (typeof onResize === 'function') {
            onResize();
        }
    }, [is_open]);

    const onClick = () => {
        // close if clicking the expansion panel that's open, otherwise open the new one
        setIsOpen(!is_open);
    };

    return (
        <>
            <div
                className={classNames('dc-expansion-panel__header-container', {
                    'dc-expansion-panel__header-active': is_open,
                })}
            >
                {message.header}
                <Icon icon='IcChevronDownBold' className='dc-expansion-panel__header-chevron-icon' onClick={onClick} />
            </div>
            {is_open && (Array.isArray(message.content) ? ArrayRenderer(message.content) : message.content)}
        </>
    );
};

ExpansionPanel.propTypes = {
    message: PropTypes.object,
};

export default ExpansionPanel;
