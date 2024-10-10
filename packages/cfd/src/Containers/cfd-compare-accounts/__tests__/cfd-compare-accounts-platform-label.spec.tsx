import React from 'react';
import { render, screen } from '@testing-library/react';
import CFDCompareAccountsPlatformLabel from '../cfd-compare-accounts-platform-label';
import { platformsHeaderLabel } from '../../../Helpers/compare-accounts-config';

describe('<CFDCompareAccountsPlatformLabel />', () => {
    const mocked_props = {
        trading_platforms: {
            platform: 'mt5',
        },
    };
    it('should renders MT5 platform label', () => {
        render(<CFDCompareAccountsPlatformLabel {...mocked_props} />);
        expect(screen.getByText(platformsHeaderLabel.mt5)).toBeInTheDocument();
    });

    it('should renders Deriv X platform label', () => {
        mocked_props.trading_platforms.platform = 'dxtrade';
        render(<CFDCompareAccountsPlatformLabel {...mocked_props} />);
        expect(screen.getByText(platformsHeaderLabel.derivx)).toBeInTheDocument();
    });
    it('should renders ctrader platform label', () => {
        mocked_props.trading_platforms.platform = 'ctrader';
        render(<CFDCompareAccountsPlatformLabel {...mocked_props} />);
        expect(screen.getByText(platformsHeaderLabel.ctrader)).toBeInTheDocument();
    });
});
