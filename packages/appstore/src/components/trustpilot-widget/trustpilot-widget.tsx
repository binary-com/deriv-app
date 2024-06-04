import { Fragment, useEffect, useState } from 'react';
import { Icon, Text } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { TTrustpilotWidgetData } from 'Types';
import { fetchTrustpilotData } from 'Helpers';
import TrustpilotStarRating from 'Components/trustpilot-star-rating';
import './trustpilot-widget.scss';

const TrustpilotWidget = observer(() => {
    const [trustpilotData, setTrustpilotData] = useState<TTrustpilotWidgetData>();
    const { ui } = useStore();
    const { is_mobile } = ui;

    useEffect(() => {
        const getTrustpilotData = async () => {
            const res = await fetchTrustpilotData();
            setTrustpilotData(res);
        };

        getTrustpilotData();
    }, []);

    if (!trustpilotData) return null;

    return (
        <div className='trustpilot-widget'>
            <a href='https://www.trustpilot.com/review/deriv.com' target='_blank' rel='noopener noreferrer'>
                <div className='trustpilot-widget__content'>
                    {!is_mobile && (
                        <Fragment>
                            <Text size='s' color='prominent'>
                                <Localize i18n_default_text='Our customers say' />
                            </Text>
                            <Text size='s' weight='bold' color='prominent'>
                                <Localize i18n_default_text='Excellent' />
                            </Text>
                        </Fragment>
                    )}
                    <TrustpilotStarRating score={trustpilotData.trustScore} />
                    {!is_mobile && (
                        <Text size='s' color='prominent'>
                            <Localize
                                i18n_default_text='{{trustScore}} out of 5 based on {{numberOfReviews}} reviews'
                                values={{
                                    trustScore: trustpilotData.trustScore,
                                    numberOfReviews: trustpilotData.numberOfReviews,
                                }}
                            />
                        </Text>
                    )}
                    <Icon icon='IcAppstoreTrustpilotLogo' width={98} height={24} custom_color='var(--text-prominent)' />
                </div>
            </a>
        </div>
    );
});

export default TrustpilotWidget;
