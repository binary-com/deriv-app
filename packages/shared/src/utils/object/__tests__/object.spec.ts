import * as Utility from '../object';

describe('Utility', () => {
    describe('.isEmptyObject()', () => {
        it('returns true for empty objects or non-objects', () => {
            [{}, 1, undefined, null, false, true, ''].forEach(value => {
                expect(Utility.isEmptyObject(value)).toBe(true);
            });
        });

        it('returns false for not empty objects', () => {
            expect(Utility.isEmptyObject({ not_empty: true })).toBe(false);
        });
    });

    describe('.getPropertyValue()', () => {
        const obj = {
            str: 'abc',
            num: 123,
            empty: '',
            nul: null,
            undef: undefined,
            promise: new Promise(resolve => {
                resolve('aa');
            }),
            array: ['a', 'b'],
            nested: {
                level_2: {
                    level_3: 'some text',
                },
            },
        };

        it('returns correct values with correct type', () => {
            expect(typeof Utility.getPropertyValue(obj, 'str')).toBe('string');
            expect(Utility.getPropertyValue(obj, 'str')).toBe('abc');
            expect(typeof Utility.getPropertyValue(obj, 'num')).toBe('number');
            expect(Utility.getPropertyValue(obj, 'num')).toBe(123);
            expect(typeof Utility.getPropertyValue(obj, 'empty')).toBe('string');
            expect(Utility.getPropertyValue(obj, 'empty')).toBe('');
            expect(Utility.getPropertyValue(obj, 'nul')).toBeNull();
            expect(Utility.getPropertyValue(obj, 'undef')).toBeUndefined();
            expect(Utility.getPropertyValue(obj, 'promise')).toBeInstanceOf(Promise);
        });

        it('handles arrays correctly', () => {
            expect(Array.isArray(Utility.getPropertyValue(obj, 'array'))).toBe(true);
        });

        it('handles nested objects correctly', () => {
            expect(Utility.getPropertyValue(obj, 'nested')).toBeInstanceOf(Object);
            expect(typeof Utility.getPropertyValue(obj, ['nested', 'level_2', 'level_3'])).toBe('string');
            expect(Utility.getPropertyValue(obj, ['nested', 'level_2', 'level_3'])).toEqual(obj.nested.level_2.level_3);
        });

        it('returns cloned array to prevent unwanted changes to the source', () => {
            const cloned_array = Utility.getPropertyValue(obj, 'array');
            cloned_array[0] = 'AA';
            expect(Utility.getPropertyValue(obj, 'array')[0]).toBe('a');
            expect(cloned_array[0]).toBe('AA');
        });

        it('returns deeply cloned object to prevent unwanted changes to the source', () => {
            let cloned_obj = Utility.getPropertyValue(obj, 'nested');
            cloned_obj.level_2 = { new_prop: 'new value' };
            expect(Utility.getPropertyValue(obj, 'nested')).toEqual({ level_2: { level_3: 'some text' } });
            expect(cloned_obj).toEqual({ level_2: { new_prop: 'new value' } });

            cloned_obj = Utility.getPropertyValue(obj, ['nested', 'level_2']);
            cloned_obj.level_3 = 'new text';
            expect(Utility.getPropertyValue(obj, ['nested', 'level_2', 'level_3'])).toBe('some text');
            expect(cloned_obj.level_3).toBe('new text');
        });
    });

    describe('.isDeepEqual()', () => {
        describe('simple data types', () => {
            it('null', () => {
                expect(Utility.isDeepEqual(null, null)).toBe(true);
            });
            it('undefined', () => {
                expect(Utility.isDeepEqual(undefined, undefined)).toBe(true);
            });
            it('string', () => {
                expect(Utility.isDeepEqual('', '')).toBe(true);
                expect(Utility.isDeepEqual('abc', 'abc')).toBe(true);
                expect(Utility.isDeepEqual('abc', 'aaa')).toBe(false);
            });
            it('number', () => {
                expect(Utility.isDeepEqual(0, 0)).toBe(true);
                expect(Utility.isDeepEqual(2.0, 2.0)).toBe(true);
                expect(Utility.isDeepEqual(-1, -1)).toBe(true);
            });
            it('boolean', () => {
                expect(Utility.isDeepEqual(true, true)).toBe(true);
                expect(Utility.isDeepEqual(false, false)).toBe(true);
                expect(Utility.isDeepEqual(true, false)).toBe(false);
            });
            it('special cases', () => {
                expect(Utility.isDeepEqual(0, '0')).toBe(false);
                expect(Utility.isDeepEqual(0, false)).toBe(false);
                expect(Utility.isDeepEqual(0, null)).toBe(false);
                expect(Utility.isDeepEqual(0, undefined)).toBe(false);
                expect(Utility.isDeepEqual(1, true)).toBe(false);
                expect(Utility.isDeepEqual(1, '1')).toBe(false);
            });
        });

        describe('arrays and objects', () => {
            it('works with arrays', () => {
                expect(Utility.isDeepEqual([], [])).toBe(true);
                expect(Utility.isDeepEqual(0, [0])).toBe(false);
                expect(Utility.isDeepEqual([1, 'b', null], [1, 'b', null])).toBe(true); // same array
                expect(Utility.isDeepEqual([1, 2, 3], [1, 3, 2])).toBe(false); // different order
                expect(Utility.isDeepEqual([1, 2, 3], [1, 2, 4])).toBe(false); // different value
                expect(Utility.isDeepEqual([1, 2, 3], [1, 2])).toBe(false); // different length 1st
                expect(Utility.isDeepEqual([1, 2], [1, 2, 3])).toBe(false); // different length 2nd
                expect(Utility.isDeepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true); // same multi-dimensional
                expect(Utility.isDeepEqual([1, [2, 3]], [[1, 2], 3])).toBe(false); // different multi-dimensional but same when flatten
                expect(
                    Utility.isDeepEqual(
                        [
                            [1, 2, ['a', 'b']],
                            [3, 4, ['c', 'd']],
                        ],
                        [
                            [1, 2, ['a', 'b']],
                            [3, 4, ['c', 'd']],
                        ]
                    )
                ).toBe(true);
            });

            it('works with objects', () => {
                expect(Utility.isDeepEqual({}, {})).toBe(true);
                expect(Utility.isDeepEqual([], {})).toBe(false); // same typeof
                expect(Utility.isDeepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true); // same but different order
                expect(Utility.isDeepEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })).toBe(false); // different length 1st
                expect(Utility.isDeepEqual({ a: 1, b: 2 }, { a: 1, b: 2, c: 3 })).toBe(false); // different length 2nd
                expect(Utility.isDeepEqual({ a: 1, b: { c: 3 } }, { a: 1, b: { c: 3 } })).toBe(true); // same nested
                expect(Utility.isDeepEqual({ a: 1, b: { c: 3 } }, { a: 1, b: { c: 4 } })).toBe(false); // different nested
            });
        });

        describe('complex values', () => {
            it('works as expected', () => {
                expect(
                    Utility.isDeepEqual(
                        { a: 1, b: { c: ['c', 'cc'], d: true, e: null } },
                        { a: 1, b: { c: ['c', 'cc'], d: true, e: null } }
                    )
                ).toBe(true);
                expect(
                    Utility.isDeepEqual({ a: 1, b: { c: ['c', { cc: 33 }] } }, { a: 1, b: { c: ['c', { cc: 33 }] } })
                ).toBe(true);
                expect(
                    Utility.isDeepEqual(
                        ['a', '1', [{ c: ['c', { cc: 33 }] }], { d: 4 }],
                        ['a', '1', [{ c: ['c', { cc: 33 }] }], { d: 4 }]
                    )
                ).toBe(true);
            });
        });

        describe('.unique()', () => {
            it('filters out duplicate array objects with provided key', () => {
                expect(Utility.unique([{ a: 1 }, { a: 2 }, { a: 1 }, { a: 4 }], 'a')).toHaveLength(3);
                expect(Utility.unique([{ a: 1 }, { a: 2 }, { a: 1 }, { a: 4 }], 'a')).toEqual([
                    { a: 1 },
                    { a: 2 },
                    { a: 4 },
                ]);
                expect(
                    Utility.unique(
                        [
                            { a: '1233', b: '2' },
                            { a: '1233', b: '2' },
                            { a: '1234', b: '2' },
                        ],
                        'a'
                    )
                ).toHaveLength(2);
                expect(
                    Utility.unique(
                        [
                            { a: '1233', b: '2' },
                            { a: '1233', b: '2' },
                            { a: '1234', b: '2' },
                        ],
                        'a'
                    )
                ).toEqual([
                    { a: '1233', b: '2' },
                    { a: '1234', b: '2' },
                ]);
            });

            it('works with faulty arguments', () => {
                expect(Utility.unique([], 'a')).toHaveLength(0);
                expect(Utility.unique([], 'a')).toEqual([]);
                expect(Utility.unique([{ a: 1 }, { b: 2 }, { c: 3 }], 'd')).toHaveLength(3);
                expect(Utility.unique([{ a: 1 }, { a: 1 }, { b: 2 }, { c: 3 }], 'd')).toEqual([
                    { a: 1 },
                    { a: 1 },
                    { b: 2 },
                    { c: 3 },
                ]);
                expect(Utility.unique([{ a: 1 }, { b: 2 }, { c: 3 }], '')).toHaveLength(3);
                expect(Utility.unique([{ a: 1 }, { a: 1 }, { b: 2 }, { c: 3 }], '')).toEqual([
                    { a: 1 },
                    { a: 1 },
                    { b: 2 },
                    { c: 3 },
                ]);
            });
        });
    });
    describe('deepCopy', () => {
        it('should create a deep copy of an array', () => {
            const originalArray = [1, 2, [3, 4], { a: 5 }];
            const copiedArray = Utility.deepCopy(originalArray);

            // Check if the values are equal
            expect(copiedArray).toEqual(originalArray);

            // Check if the reference is different
            expect(copiedArray).not.toBe(originalArray);

            // Check if nested arrays/objects are also deep-copied
            expect(copiedArray[2]).not.toBe(originalArray[2]);
            expect(copiedArray[3]).not.toBe(originalArray[3]);
        });

        it('should create a deep copy of an object', () => {
            const originalObject = { a: 1, b: { c: 2 }, d: [3, 4] };
            const copiedObject = Utility.deepCopy(originalObject);

            // Check if the values are equal
            expect(copiedObject).toEqual(originalObject);

            // Check if the reference is different
            expect(copiedObject).not.toBe(originalObject);

            // Check if nested arrays/objects are also deep-copied
            expect(copiedObject.b).not.toBe(originalObject.b);
            expect(copiedObject.d).not.toBe(originalObject.d);
        });

        it('should return primitive values unchanged', () => {
            const primitiveValue = 42;
            const copiedValue = Utility.deepCopy(primitiveValue);

            // Check if the values are equal
            expect(copiedValue).toEqual(primitiveValue);

            // Check if the reference is the same for primitive values
            expect(copiedValue).toBe(primitiveValue);
        });
    });
});
