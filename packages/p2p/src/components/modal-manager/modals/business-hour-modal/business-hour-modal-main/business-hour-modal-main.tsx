import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import SeparatorContainerLine from 'Components/separator-container-line';
import './business-hour-modal-main.scss';

type TBusinessHourModalMain = {
    business_days: {
        day: string;
        short_day: string;
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
                <Localize i18n_default_text='Choose when you’re available to accept orders. Your ads will only be visible during these times.' />
            </Text>
            <SeparatorContainerLine />
            <div className='business-hour-modal-main__days'>
                {business_days.map((day, idx) => {
                    const text_weight = idx === today ? 'bold' : 'normal';

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
            <Text as='div' className='business-hour-modal-main__hint' size='xxs'>
                <div>
                    <Localize i18n_default_text='* You can only place orders on other ads during your set business hours.' />
                </div>
                <div>
                    <Localize i18n_default_text='* Some ads may have a delay before becoming visible to potential buyers.' />
                </div>
            </Text>
        </>
    );
};

export default BusinessHourModalMain;
