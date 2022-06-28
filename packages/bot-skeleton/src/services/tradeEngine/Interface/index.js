import getToolsInterface from './ToolsInterface';
import getTicksInterface from './TicksInterface';
import getBotInterface from './BotInterface';
import TradeEngine, { watch } from '../trade';
import { observer as globalObserver } from '../../../utils/observer';

const sleep = (arg = 1) => {
    return new Promise(
        r =>
            setTimeout(() => {
                r();
                setTimeout(() => globalObserver.emit('CONTINUE'), 0);
            }, arg * 1000),
        () => {}
    );
};

const Interface = () => {
    const tradeEngine = new TradeEngine();
    const getInterface = () => {
        return {
            ...getBotInterface(tradeEngine),
            ...getToolsInterface(tradeEngine),
            getTicksInterface: getTicksInterface(),
            watch: (...args) => watch(...args),
            sleep: (...args) => sleep(...args),
            alert: (...args) => alert(...args), // eslint-disable-line no-alert
            prompt: (...args) => prompt(...args), // eslint-disable-line no-alert
            console: {
                log(...args) {
                    // eslint-disable-next-line no-console
                    console.log(new Date().toLocaleTimeString(), ...args);
                },
            },
        };
    };
    return { tradeEngine, globalObserver, getInterface };
};

export default Interface;
