import React from 'react';
import WheelPicker from '../Form/WheelPicker';
import { DesktopWrapper, Text } from '@deriv/components';
import Fieldset from 'App/Components/Form/fieldset';
import { localize } from '@deriv/translations';

const PayoutPerPoint = ({
    barriersList,
    onBarrierClick,
    selectedBarrier,
}: {
    barriersList: string[];
    onBarrierClick: (option: string) => void;
    selectedBarrier: string;
}) => {
    return (
        <DesktopWrapper>
            <Fieldset
                className={'trade-container__fieldset'}
                header={localize('Payout per Point')}
                header_tooltip={'aisjdiasod sadisajdas daid sadias'}
            >
                <WheelPicker options={barriersList} onBarrierClick={onBarrierClick} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text size={'xxs'} line_height='l' color={'default'} align='center' as='p'>
                        Distance to current spot
                    </Text>
                    <Text
                        size={'xxxs'}
                        line_height='l'
                        color={'default'}
                        align='center'
                        as='p'
                        className='learn-more_title'
                    >
                        {selectedBarrier}
                    </Text>
                </div>
            </Fieldset>
        </DesktopWrapper>
    );
};

export default PayoutPerPoint;
