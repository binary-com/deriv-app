import {
    simpleMovingAverage as sma,
    simpleMovingAverageArray as smaa,
    bollingerBands as bb,
    bollingerBandsArray as bba,
    exponentialMovingAverage as ema,
    exponentialMovingAverageArray as emaa,
    relativeStrengthIndex as rsi,
    relativeStrengthIndexArray as rsia,
    macdArray as macda,
    priceChannel as pc,
    priceChannelArray as pca,
    parabolicSAR as psar,
    parabolicSARArray as psara,
    fractal as fr,
    fractalArray as fra,
    averageTrueRange as atr,
    averageTrueRangeArray as atra,
    stochasticOscillator as so,
    stochasticOscillatorArray as soa,
} from '@deriv/shared';

export default Interface =>
    class extends Interface {
        getIndicatorsInterface() {
            return {
                sma: (input, periods) => this.decorate(sma, input, { periods }),
                smaa: (input, periods) => this.decorate(smaa, input, { periods }),
                ema: (input, periods) => this.decorate(ema, input, { periods }),
                emaa: (input, periods) => this.decorate(emaa, input, { periods }),
                rsi: (input, periods) => this.decorate(rsi, input, { periods }),
                rsia: (input, periods) => this.decorate(rsia, input, { periods }),
                bb: (input, config, field) => this.decorate(bb, input, config)[field],
                bba: (input, config, field) => this.decorate(bba, input, config).map(r => r[field]),
                macda: (input, config, field) => this.decorate(macda, input, config).map(r => r[field]),
                pc: (input, periods, field) => this.decorate(pc, input, { periods })[field],
                pca: (input, periods, field) => this.decorate(pca, input, { periods }).map(r => r[field]),
                psar: (input, periods) => this.decorate(psar, input, { periods }),
                psara: (input, periods) => this.decorate(psara, input, { periods }),
                fr: (input, periods, field) => this.decorate(fr, input, { periods })[field],
                fra: (input, periods, field) => this.decorate(fra, input, { periods }).map(r => r[field]),
                atr: (input, periods) => this.decorate(atr, input, { periods }),
                atra: (input, periods) => this.decorate(atra, input, { periods }),
                so: (input, config) => this.decorate(so, input, config),
                soa: (input, config) => this.decorate(soa, input, config),
            };
        }

        decorate(f, input, config, ...args) {
            const pipSize = this.tradeEngine.getPipSize();

            return f(input, { pipSize, ...config }, ...args);
        }
    };
