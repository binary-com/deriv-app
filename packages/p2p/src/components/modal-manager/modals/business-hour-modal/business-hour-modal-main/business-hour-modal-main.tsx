import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import SeparatorContainerLine from 'Components/separator-container-line';
import './business-hour-modal-main.scss';

type TBusinessHourModalMain = {
    business_days: {
        day: JSX.Element;
        short_day: JSX.Element;
        time: JSX.Element;
        start_time?: string | null;
        end_time?: string | null;
        value: string;
    }[];
};

const BusinessHourModalMain = ({ business_days }: TBusinessHourModalMain) => {
    const today = new Date().getDay();

    return (
        <>
            <Text as='p' size='xs'>
                <Localize i18n_default_text='Set the hours you’re available to accept orders. Your ads will only be visible to others during these times.' />
            </Text>
            <SeparatorContainerLine />
            <div className='business-hour-modal-main__days'>
                {business_days.map((day, idx) => {
                    const text_weight = idx === today - 1 ? 'bold' : 'normal';

                    return (
                        <div key={day.value} className='business-hour-modal-main__days__hours'>
                            <Text
                                as='p'
                                className='business-hour-modal-main__days__hours-text'
                                size='xs'
                                weight={text_weight}
                            >
                                {day.day}
                            </Text>
                            <Text as='p' size='xs' weight={text_weight}>
                                {day.time}
                            </Text>
                        </div>
                    );
                })}
            </div>
            <Text as='p' className='business-hour-modal-main__hint' size='xxs'>
                <Localize i18n_default_text='*Some ads may not be immediately visible to potential buyers due to order processing times.' />
            </Text>
        </>
    );
};

export default BusinessHourModalMain;
