import React from 'react';
import { Text } from '@deriv-com/ui';
import { TRouteTypes } from '../../types';

const DummyComponent = ({ title }: TRouteTypes.TRouteComponent) => {
    return <Text size='lg'>{title} page does not exist</Text>;
};

export default DummyComponent;
