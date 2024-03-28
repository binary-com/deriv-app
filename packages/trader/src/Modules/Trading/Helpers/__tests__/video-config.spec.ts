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
    it('should return an id for Rise/Fall description video in light theme', () => {
        expect(getDescriptionVideoId('rise_fall', false)).toEqual(DESCRIPTION_VIDEO_ID.rise_fall.light);
    });
    it('should return an id for Touch/No Touch description video in light theme', () => {
        expect(getDescriptionVideoId('touch', false)).toEqual(DESCRIPTION_VIDEO_ID.touch.light);
    });
    it('should return undefined when called with empty arguments', () => {
        expect(getDescriptionVideoId()).toEqual(undefined);
    });
});
