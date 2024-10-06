import { localize } from '@deriv/translations';
import { address_permitted_special_characters_message } from '@deriv/shared';

export const FORM_ERROR_MESSAGES = {
    empty_address: () => localize('This field is required'),
    empty_barrier: () => localize('Barrier is a required field.'),
    address: () =>
        localize('Use only the following special characters: {{permitted_characters}}', {
            permitted_characters: address_permitted_special_characters_message,
            interpolation: { escapeValue: false },
        }),
    barrier: () =>
        localize('Only numbers and these special characters are allowed: {{permitted_characters}}', {
            permitted_characters: '+ - .',
        }),
    email: () => localize('Invalid email address.'),
    general: () => localize('Only letters, numbers, space, hyphen, period, and apostrophe are allowed.'),
    name: () => localize('Letters, spaces, periods, hyphens, apostrophes only.'),
    password: () => localize('Password should have lower and uppercase English letters with numbers.'),
    po_box: () => localize('P.O. Box is not accepted in address'),
    phone: () => localize('Please enter a valid phone number (e.g. +15417541234).'),
    postcode: () => localize('Only letters, numbers, space and hyphen are allowed.'),
    signup_token: () => localize('The length of token should be 8.'),
    tax_id: () => localize('Should start with letter or number, and may contain hyphen and underscore.'),
    number: () => localize('Should be a valid number.'),
    decimalPlaces: decimals =>
        localize('Up to {{decimal_count}} decimal places are allowed.', { decimal_count: decimals }),
    value: value => localize('Should be {{value}}', { value }),
    betweenMinMax: (min_value, max_value) =>
        localize('Should be between {{min_value}} and {{max_value}}', {
            min_value,
            max_value,
        }),
    minNumber: min_value => localize('Should be more than {{min_value}}', { min_value }),
    maxNumber: max_value => localize('Should be less than {{max_value}}', { max_value }),
    // all existing warning phrases from zxcvbn
    password_warnings: {
        use_a_few_words: () => localize('Use a few words, avoid common phrases'),
        no_need_for_mixed_chars: () => localize('No need for symbols, digits, or uppercase letters'),
        uncommon_words_are_better: () => localize('Add another word or two. Uncommon words are better.'),
        straight_rows_of_keys_are_easy: () => localize('Straight rows of keys are easy to guess'),
        short_keyboard_patterns_are_easy: () => localize('Short keyboard patterns are easy to guess'),
        use_longer_keyboard_patterns: () => localize('Use a longer keyboard pattern with more turns'),
        repeated_chars_are_easy: () => localize('Repeats like "aaa" are easy to guess'),
        repeated_patterns_are_easy: () =>
            localize('Repeats like "abcabcabc" are only slightly harder to guess than "abc"'),
        avoid_repeated_chars: () => localize('Avoid repeated words and characters'),
        sequences_are_easy: () => localize('Sequences like abc or 6543 are easy to guess'),
        avoid_sequences: () => localize('Avoid sequences'),
        recent_years_are_easy: () => localize('Recent years are easy to guess'),
        avoid_recent_years: () => localize('Avoid recent years'),
        avoid_associated_years: () => localize('Avoid years that are associated with you'),
        dates_are_easy: () => localize('Dates are often easy to guess'),
        avoid_associated_dates_and_years: () => localize('Avoid dates and years that are associated with you'),
        top10_common_password: () => localize('This is a top-10 common password'),
        top100_common_password: () => localize('This is a top-100 common password'),
        very_common_password: () => localize('This is a very common password'),
        similar_to_common_password: () => localize('This is similar to a commonly used password'),
        a_word_is_easy: () => localize('A word by itself is easy to guess'),
        names_are_easy: () => localize('Names and surnames by themselves are easy to guess'),
        common_names_are_easy: () => localize('Common names and surnames are easy to guess'),
        capitalization_doesnt_help: () => localize("Capitalization doesn't help very much"),
        all_uppercase_doesnt_help: () => localize('All-uppercase is almost as easy to guess as all-lowercase'),
        reverse_doesnt_help: () => localize("Reversed words aren't much harder to guess"),
        substitution_doesnt_help: () =>
            localize("Predictable substitutions like '@' instead of 'a' don't help very much"),
        user_dictionary: () => localize('This password is on the blacklist'),
    },
};
