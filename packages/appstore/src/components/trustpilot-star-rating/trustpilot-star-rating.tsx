import { useState, useEffect } from 'react';
import { Icon } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import './trustpilot-star-rating.scss';

const TrustpilotStarRating = observer(({ score }: { score: number }) => {
    const { common } = useStore();
    const { current_language } = common;
    const html = document.getElementsByTagName('html');
    const [is_rtl, setIsRtl] = useState(html?.[0]?.getAttribute('dir') === 'rtl');

    useEffect(() => {
        setIsRtl(html?.[0]?.getAttribute('dir') === 'rtl');
    }, [current_language]);

    return (
        <div className='trustpilot-star-rating'>
            {[...Array(5)].map((_, idx) => (
                <div
                    className='trustpilot-star-rating__item'
                    key={`star-${idx}`}
                    style={{
                        background: `linear-gradient(${is_rtl ? '270deg' : '90deg'}, #00b67a ${
                            (score - idx) * 100
                        }%, #dcdce5 ${(score - idx) * 100}%)`,
                    }}
                >
                    <Icon icon='IcAppstoreTrustpilotStar' size={24} />
                </div>
            ))}
        </div>
    );
});

export default TrustpilotStarRating;
