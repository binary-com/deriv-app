export const shuffleArray = <T>(array: T[]): T[] => {
    const firstDigit = (num: number) => Number(String(num)[0]);

    for (let i = array.length - 1; i > 0; i--) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const crypto = window.crypto || (window as any).msCrypto; // to make it working in MS Explorer
        const random_array = new Uint32Array(1);
        const random_number = crypto.getRandomValues(random_array);
        const j = Math.floor((firstDigit(random_number[0]) / 10) * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// @ts-expect-error as the generic is a Array
export const flatten = <T extends Array<unknown>>(arr: T) => [].concat(...arr);
