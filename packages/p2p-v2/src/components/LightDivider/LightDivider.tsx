import React from 'react';
import { Divider } from '@deriv-com/ui';

type TLightDividerProps = {
    className?: string;
    height?: string;
    margin?: string;
};

const LightDivider = ({ className, height, margin }: TLightDividerProps) => {
    return <Divider className={className} color='#f2f3f4' height={height} margin={margin} />;
};

export default LightDivider;
