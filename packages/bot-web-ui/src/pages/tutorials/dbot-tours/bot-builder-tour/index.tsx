import React from 'react';
import { observer } from 'mobx-react';
import BotBuilderTourDesktop from './bot-builder-tour-desktop';
import BotBuilderTourMobile from './bot-builder-tour-mobile';

type TBotBuilderTourHandler = {
    is_mobile_or_tablet: boolean;
};

const BotBuilderTourHandler: React.FC<TBotBuilderTourHandler> = observer(({ is_mobile_or_tablet }) => {
    return <>{is_mobile_or_tablet ? <BotBuilderTourMobile /> : <BotBuilderTourDesktop />};</>;
});

export default BotBuilderTourHandler;
