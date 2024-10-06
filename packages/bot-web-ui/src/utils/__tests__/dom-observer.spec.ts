import { waitForDomElement } from 'Utils/dom-observer';

describe('waitForDomElement', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });

    it('should resolve immediately if the element is already in the DOM', async () => {
        const elementId = 'testElement';
        const div = document.createElement('div');
        div.id = elementId;
        document.body.appendChild(div);
        const result = await waitForDomElement(`#${elementId}`);

        expect(result).toBeDefined();
        expect(result.id).toBe(elementId);
    });

    it('should resolve when the element is added to the DOM after some time', async () => {
        const elementId = 'dynamicElement';

        const promise = waitForDomElement(`#${elementId}`);

        setTimeout(() => {
            const div = document.createElement('div');
            div.id = elementId;
            document.body.appendChild(div);
        }, 100);

        const result = await promise;

        expect(result).toBeDefined();
        expect(result.id).toBe(elementId);
    });
});
