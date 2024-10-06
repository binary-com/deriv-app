type TMessage = () => string;
type TParameter = string | number;

export type TFormErrorMessagesTypes = Record<
    | 'empty_address'
    | 'empty_barrier'
    | 'address'
    | 'barrier'
    | 'email'
    | 'general'
    | 'name'
    | 'password'
    | 'po_box'
    | 'phone'
    | 'postcode'
    | 'signup_token'
    | 'tax_id'
    | 'number'
    | 'validTaxID',
    TMessage
> & {
    decimalPlaces: (decimals: TParameter) => string;
    value: (value: TParameter) => string;
    betweenMinMax: (min_value: TParameter, max_value: TParameter) => string;
    minNumber: (min_value: TParameter) => string;
    maxNumber: (max_value: TParameter) => string;
    password_warnings: Record<
        | 'use_a_few_words'
        | 'no_need_for_mixed_chars'
        | 'uncommon_words_are_better'
        | 'straight_rows_of_keys_are_easy'
        | 'short_keyboard_patterns_are_easy'
        | 'use_longer_keyboard_patterns'
        | 'repeated_chars_are_easy'
        | 'repeated_patterns_are_easy'
        | 'avoid_repeated_chars'
        | 'sequences_are_easy'
        | 'avoid_sequences'
        | 'recent_years_are_easy'
        | 'avoid_recent_years'
        | 'avoid_associated_years'
        | 'dates_are_easy'
        | 'avoid_associated_dates_and_years'
        | 'top10_common_password'
        | 'top100_common_password'
        | 'very_common_password'
        | 'similar_to_common_password'
        | 'a_word_is_easy'
        | 'names_are_easy'
        | 'common_names_are_easy'
        | 'capitalization_doesnt_help'
        | 'all_uppercase_doesnt_help'
        | 'reverse_doesnt_help'
        | 'substitution_doesnt_help'
        | 'user_dictionary',
        TMessage
    >;
};
