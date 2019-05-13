import { expect }     from 'chai';
import getBaseName    from '../base-name';
import { websiteUrl } from '../../../../_common/url';
import { setURL }     from '../../../../_common/__tests__/tests_common';

describe('base_name.getBaseName', () => {
    it('expect return correct value when pathname is not set', () => {
        expect(getBaseName()).to.eq('/en');
    });
    it('expect return correct value when pathname is set', () => {
        setURL(`${websiteUrl()}de/home.html`);
        expect(getBaseName()).to.eq('/de');
    });
    after(() => {
        setURL(`${websiteUrl()}en/home.html`);
    });
});
