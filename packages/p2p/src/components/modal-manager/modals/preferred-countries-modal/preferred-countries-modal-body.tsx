import React from 'react';
import classNames from 'classnames';
import { Checkbox, Icon, Input, Text, ThemedScrollbars } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { localize, Localize } from 'Components/i18next';

type TPreferredCountriesModalBodyProps = {
    country_list: { text: string; value: string }[];
    eligible_countries: string[];
    search_value: string;
    setSearchValue: (value: string) => void;
    selected_countries: string[];
    setSelectedCountries: (value: string[]) => void;
};

const PreferredCountriesModalBody = ({
    country_list,
    eligible_countries,
    search_value,
    setSearchValue,
    selected_countries,
    setSelectedCountries,
}: TPreferredCountriesModalBodyProps) => {
    const { isDesktop } = useDevice();
    const [search_results, setSearchResults] = React.useState([
        ...country_list.filter(item => eligible_countries.includes(item.value)),
        ...country_list.filter(item => !eligible_countries.includes(item.value)),
    ]);

    const onClearSearch = () => {
        setSearchValue('');
        setSearchResults([
            ...country_list.filter(item => eligible_countries.includes(item.value)),
            ...country_list.filter(item => !eligible_countries.includes(item.value)),
        ]);
    };

    const onSearch = e => {
        const { value } = e.target;
        if (!value) {
            onClearSearch();
            return;
        }

        setSearchValue(value);
        setSearchResults(country_list.filter(item => item.text.toLowerCase().includes(value.toLowerCase())));
    };

    return (
        <>
            <Input
                className='preferred-countries-modal__search-field'
                data-lpignore='true'
                leading_icon={<Icon className='preferred-countries-modal__search-field--icon' icon='IcSearch' />}
                maxLength={50}
                onChange={onSearch}
                placeholder={localize('Search countries')}
                trailing_icon={
                    search_value ? <Icon color='secondary' icon='IcCloseCircle' onClick={onClearSearch} /> : null
                }
                type='text'
                value={search_value}
            />
            <ThemedScrollbars height={isDesktop ? '48rem' : 'auto'}>
                {search_results?.length > 0 ? (
                    <>
                        <Checkbox
                            className={classNames('preferred-countries-modal__checkbox', {
                                'preferred-countries-modal__checkbox--inactive':
                                    selected_countries?.length > 0 &&
                                    selected_countries?.length !== country_list?.length,
                            })}
                            value={selected_countries?.length === country_list?.length}
                            label='All countries'
                            name='all'
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                if (event.target.checked) {
                                    setSelectedCountries(country_list.map(item => item.value));
                                } else {
                                    setSelectedCountries([]);
                                }
                            }}
                        />
                        {search_results?.map(item => (
                            <Checkbox
                                className='preferred-countries-modal__checkbox'
                                value={selected_countries?.includes(item.value)}
                                key={item.value}
                                label={item.text}
                                name={item.value}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    if (event.target.checked) {
                                        setSelectedCountries([...selected_countries, item.value]);
                                    } else {
                                        setSelectedCountries(selected_countries.filter(value => value !== item.value));
                                    }
                                }}
                            />
                        ))}
                    </>
                ) : (
                    <div className='preferred-countries-modal__no-results'>
                        <Text as='h2' align='center' weight='bold'>
                            <Localize
                                i18n_default_text='No results for "{{search_value}}".'
                                values={{ search_value }}
                            />
                        </Text>
                        <Text as='p' align='center' size='xs'>
                            <Localize i18n_default_text='Check your spelling or use a different term.' />
                        </Text>
                    </div>
                )}
            </ThemedScrollbars>
        </>
    );
};

export default PreferredCountriesModalBody;
