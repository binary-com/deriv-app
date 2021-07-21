/**
 * This file created to use in `setupFilesAfterEnv` in jest setup
 * For more info about it  please check the link below
 * https://jestjs.io/docs/configuration#setupfilesafterenv-array
 * */

/** provides a set of custom jest matchers that you can use to extend jest.
 * These will make your tests more declarative, clear to read and to maintain. */
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect'

/**
 * jest-extended aims to add additional matchers to Jest's default ones making it easy to test everything raised_hands
 */
import 'jest-extended';


/**
 * Chain Jest matchers together to write easier matchers and reduce code.
*/
import 'jest-chain';
