import { DESCRIPTION_VIDEO_ID, getDescriptionVideoId } from '../video-config';

describe('getDescriptionVideoId', () => {
    it('should return an id for Vanillas description video in light theme', () => {
        expect(getDescriptionVideoId('vanilla', false)).toEqual(DESCRIPTION_VIDEO_ID.vanilla.light);
    });
    it('should return an id for Accumulator description video in light theme', () => {
        expect(getDescriptionVideoId('accumulator', false)).toEqual(DESCRIPTION_VIDEO_ID.accumulator.light);
    });
    it('should return an id for High/Low description video in light theme', () => {
        expect(getDescriptionVideoId('high_low', false)).toEqual(DESCRIPTION_VIDEO_ID.high_low.light);
    });
    it('should return an id for Matches/Differs description video in light theme', () => {
        expect(getDescriptionVideoId('match_diff', false)).toEqual(DESCRIPTION_VIDEO_ID.match_diff.light);
    });
    it('should return an id for Over/Under description video in light theme', () => {
        expect(getDescriptionVideoId('over_under', false)).toEqual(DESCRIPTION_VIDEO_ID.over_under.light);
    });
    it('should return an id for Rise/Fall description video in light theme', () => {
        expect(getDescriptionVideoId('rise_fall', false)).toEqual(DESCRIPTION_VIDEO_ID.rise_fall.light);
    });
    it('should return an id for Multipliers description video in dark theme', () => {
        expect(getDescriptionVideoId('multiplier', true)).toEqual(DESCRIPTION_VIDEO_ID.multiplier.dark);
    });
    it('should return an id for Touch/No Touch description video in light theme', () => {
        expect(getDescriptionVideoId('touch', false)).toEqual(DESCRIPTION_VIDEO_ID.touch.light);
    });
    it('should return an id for Even/Odd description video in dark theme', () => {
        expect(getDescriptionVideoId('even_odd', true)).toEqual(DESCRIPTION_VIDEO_ID.even_odd.dark);
    });
    it('should return undefined when called with empty arguments', () => {
        expect(getDescriptionVideoId()).toEqual(undefined);
    });
});
