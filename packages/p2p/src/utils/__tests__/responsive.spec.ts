import { getTextSize, getIconSize, getInlineTextSize } from '../responsive';

describe('getTextSize', () => {
    it('should return desktop size if isMobile is false', () => {
        expect(getTextSize('mobile', 'desktop')).toEqual('desktop');
    });

    it('should return mobile size if isMobile is true', () => {
        expect(getTextSize('mobile', 'desktop')).toEqual('mobile');
    });
});

describe('getIconSize', () => {
    it('should return mobile size if isMobile is true', () => {
        expect(getIconSize(20, 30)).toEqual(20);
    });

    it('should return desktop size if isMobile is false', () => {
        expect(getIconSize(20, 30)).toEqual(30);
    });
});

describe('getInlineTextSize', () => {
    it('should return mobile size if isMobile is true', () => {
        expect(getInlineTextSize('sm', 'xs')).toEqual('sm');
    });

    it('should return desktop size if isMobile is false', () => {
        expect(getInlineTextSize('sm', 'xs')).toEqual('xs');
    });
});
