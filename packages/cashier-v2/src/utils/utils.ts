import type { TErrorTypes } from '../types';

export const isServerError = (error: unknown): error is TErrorTypes.TServerError =>
    typeof error === 'object' && error !== null && 'code' in error;

export const capitalizeFirstLetter = (targetString: string) =>
    targetString && targetString[0].toUpperCase() + targetString.slice(1);

export const shuffleArray = <T>(array: T[] = []): T[] => {
    const copiedArray = [...array];
    const firstDigit = (num: number) => Number(String(num)[0]);

    for (let i = copiedArray.length - 1; i > 0; i--) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const crypto = window.crypto || (window as any).msCrypto; // to make it working in MS Explorer
        const randomArray = new Uint32Array(1);
        const randomNumber = crypto.getRandomValues(randomArray);
        const j = Math.floor((firstDigit(randomNumber[0]) / 10) * (i + 1));
        [copiedArray[i], copiedArray[j]] = [copiedArray[j], copiedArray[i]];
    }
    return copiedArray;
};

export const clickAndKeyEventHandler = (
    callback?: () => void,
    e?: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>
) => {
    if (e) {
        e.preventDefault();
        if (e.type !== 'keydown' || (e.type === 'keydown' && (e as React.KeyboardEvent).key === 'Enter')) {
            callback?.();
        }
    } else {
        callback?.();
    }
};
