import React from 'react';
import TradeAnimation from 'Components/trade-animation';

const RunStrategy = () => {
    return (
        <>
            <div className='toolbar__section'>
                <TradeAnimation className='toolbar__animation' should_show_overlay={true} info_direction={'left'} />
            </div>
        </>
    );
};

export default RunStrategy;
