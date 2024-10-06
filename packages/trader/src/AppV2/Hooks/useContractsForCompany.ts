import React, { useCallback, useEffect, useRef } from 'react';
import { useTraderStore } from 'Stores/useTraderStores';
import { useStore } from '@deriv/stores';
import { cloneObject, getContractCategoriesConfig, getContractTypesConfig, setTradeURLParams } from '@deriv/shared';
import { TConfig, TContractTypesList } from 'Types';
import { useDtraderQuery } from './useDtraderQuery';
import { isLoginidDefined } from 'AppV2/Utils/client';
import { getTradeTypesList } from 'AppV2/Utils/trade-types-utils';
import { TContractType } from 'Modules/Trading/Components/Form/ContractType/types';
import { checkContractTypePrefix } from 'AppV2/Utils/contract-type';

type TContractsForCompanyResponse = {
    contracts_for_company: {
        available: {
            barrier_category: string;
            contract_category: string;
            contract_category_display: string;
            contract_display: string;
            contract_type: string;
            default_stake: number;
            sentiment: string;
        }[];
        hit_count: number;
    };
};

const useContractsForCompany = () => {
    const [contract_types_list, setContractTypesList] = React.useState<TContractTypesList | []>([]);

    const [trade_types, setTradeTypes] = React.useState<TContractType[]>([]);
    const { contract_type, onChange, setContractTypesListV2 } = useTraderStore();
    const { client } = useStore();
    const { loginid, is_switching, landing_company_shortcode } = client;

    const isQueryEnabled = useCallback(() => {
        if (isLoginidDefined(loginid) && !landing_company_shortcode) return false;
        if (is_switching) return false;
        return true;
    }, [loginid, is_switching, landing_company_shortcode]);

    const {
        data: response,
        error,
        is_fetching,
    } = useDtraderQuery<TContractsForCompanyResponse>(
        ['contracts_for_company', loginid ?? '', landing_company_shortcode],
        {
            contracts_for_company: 1,
            landing_company: landing_company_shortcode,
        },
        {
            enabled: isQueryEnabled(),
        }
    );

    const contract_categories = getContractCategoriesConfig();
    const available_categories = cloneObject(contract_categories);
    const contract_types = getContractTypesConfig();
    const [available_contract_types, setAvailableContractTypes] = React.useState<
        ReturnType<typeof getContractTypesConfig> | undefined
    >();

    const is_fetching_ref = useRef(is_fetching);

    const isContractTypeAvailable = useCallback(
        (trade_types: TContractType[]) => {
            return trade_types.some(
                type => checkContractTypePrefix([contract_type, type.value]) || contract_type === type.value
            );
        },
        [contract_type]
    );

    const getTradeTypes = useCallback((categories: TContractTypesList) => {
        return Array.isArray(categories) && categories.length === 0
            ? []
            : getTradeTypesList(categories as TContractTypesList);
    }, []);

    const getNewContractType = useCallback(
        (trade_types: TContractType[]) => {
            if (!isContractTypeAvailable(trade_types) && trade_types.length > 0) {
                return trade_types[0].value;
            }
            return contract_type;
        },
        [contract_type, isContractTypeAvailable]
    );

    const processNewContractType = useCallback(
        (new_contract_type: string) => {
            const has_contract_type_changed = contract_type != new_contract_type && new_contract_type;
            if (has_contract_type_changed) {
                onChange({
                    target: {
                        name: 'contract_type',
                        value: new_contract_type,
                    },
                });
            }
            setTradeURLParams({ contractType: new_contract_type });
        },
        [contract_type, onChange]
    );

    useEffect(() => {
        setAvailableContractTypes(undefined);
        setContractTypesList([]);
        is_fetching_ref.current = true;
    }, [loginid]);

    useEffect(() => {
        try {
            const { contracts_for_company } = response || {};
            const available_contract_types: ReturnType<typeof getContractTypesConfig> = {};
            is_fetching_ref.current = false;

            if (!error && contracts_for_company?.available.length) {
                contracts_for_company.available.forEach(contract => {
                    const type = Object.keys(contract_types).find(
                        key =>
                            contract_types[key].trade_types.indexOf(contract.contract_type) !== -1 &&
                            (contract.contract_type !== 'PUT' || contract_types[key].barrier_count === 1) // To distinguish betweeen Rise/Fall & Higher/Lower
                    );

                    if (!type) return; // ignore unsupported contract types

                    if (!available_contract_types[type]) {
                        // extend contract_categories to include what is needed to create the contract list
                        const category =
                            Object.keys(available_categories).find(
                                key => available_categories[key].categories.indexOf(type) !== -1
                            ) ?? '';

                        const sub_cats = available_categories[category]?.categories;

                        if (!sub_cats) return;

                        sub_cats[(sub_cats as string[]).indexOf(type)] = {
                            value: type,
                            text: contract_types[type].title,
                            barrier_category: contract.barrier_category,
                        };

                        available_contract_types[type] = cloneObject(contract_types[type]);
                    }
                    const config: TConfig = available_contract_types[type].config || {};
                    config.barrier_category =
                        contract_types[type].barrier_count === 0
                            ? 'euro_atm'
                            : (contract.barrier_category as TConfig['barrier_category']);

                    available_contract_types[type].config = config;
                });

                setContractTypesListV2(available_categories);
                setContractTypesList(available_categories);
                setAvailableContractTypes(available_contract_types);

                const trade_types = getTradeTypes(available_categories);
                setTradeTypes(trade_types);

                const new_contract_type = getNewContractType(trade_types);
                processNewContractType(new_contract_type);
            }
        } catch (err) {
            /* eslint-disable no-console */
            console.error(err);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response]);

    return { trade_types, contract_types_list, available_contract_types, is_fetching_ref };
};

export default useContractsForCompany;
