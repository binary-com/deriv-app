import React from 'react';
import { Text } from '@deriv-com/ui';
import StatusLoss from '../../../../../../public/images/status-loss.svg';
import './CommonMistakesExamples.scss';

type TCommonMistakeExamplePartialsProps = {
    description: string;
    image: React.ReactElement;
};

const CommonMistakesExamples = ({ description, image }: TCommonMistakeExamplePartialsProps) => (
    <div className='wallets-common-mistakes__content-layout'>
        {image}
        <div className='wallets-common-mistakes__content-description'>
            <StatusLoss />
            <Text align='start' size='xs'>
                {description}
            </Text>
        </div>
    </div>
);

export default CommonMistakesExamples;
