import { AutoHeightWrapper, Div100vhContainer, FormSubmitButton, ThemedScrollbars } from '@deriv/components';
import { Formik } from 'formik';
import React from 'react';
import { FormSubHeader } from '@deriv/account';
import { localize, Localize } from '@deriv/translations';
import { isDesktop, isMobile } from '@deriv/shared/utils/screen';
import { connect } from 'Stores/connect';
import {
    AccountTurnover,
    BinaryOptionsTradingExperience,
    BinaryOptionsTradingFrequency,
    CFDTradingExperience,
    CFDTradingFrequency,
    EducationLevel,
    EmploymentIndustry,
    EmploymentStatus,
    EstimatedWorth,
    ForexTradingExperience,
    ForexTradingFrequency,
    IncomeSource,
    NetIncome,
    Occupation,
    OtherInstrumentsTradingExperience,
    OtherInstrumentsTradingFrequency,
    SourceOfWealth,
} from './financial-details-partials.jsx';

const FinancialInformation = ({
    shared_props,
    income_source_enum,
    employment_status_enum,
    employment_industry_enum,
    occupation_enum,
    source_of_wealth_enum,
    education_level_enum,
    net_income_enum,
    estimated_worth_enum,
    account_turnover_enum,
}) => (
    <React.Fragment>
        <FormSubHeader title={localize('Financial information')} />
        <IncomeSource {...shared_props} income_source_enum={income_source_enum} />
        <EmploymentStatus {...shared_props} employment_status_enum={employment_status_enum} />
        <EmploymentIndustry {...shared_props} employment_industry_enum={employment_industry_enum} />
        <Occupation {...shared_props} occupation_enum={occupation_enum} />
        <SourceOfWealth {...shared_props} source_of_wealth_enum={source_of_wealth_enum} />
        <EducationLevel {...shared_props} education_level_enum={education_level_enum} />
        <NetIncome {...shared_props} net_income_enum={net_income_enum} />
        <EstimatedWorth {...shared_props} estimated_worth_enum={estimated_worth_enum} />
        <AccountTurnover {...shared_props} account_turnover_enum={account_turnover_enum} />
    </React.Fragment>
);

const TradingExperience = ({
    shared_props,
    forex_trading_experience_enum,
    forex_trading_frequency_enum,
    binary_options_trading_experience_enum,
    binary_options_trading_frequency_enum,
    cfd_trading_experience_enum,
    cfd_trading_frequency_enum,
    other_instruments_trading_experience_enum,
    other_instruments_trading_frequency_enum,
}) => (
    <React.Fragment>
        <FormSubHeader title={localize('Trading experience')} />
        <ForexTradingExperience {...shared_props} forex_trading_experience_enum={forex_trading_experience_enum} />
        <ForexTradingFrequency {...shared_props} forex_trading_frequency_enum={forex_trading_frequency_enum} />
        <BinaryOptionsTradingExperience
            {...shared_props}
            binary_options_trading_experience_enum={binary_options_trading_experience_enum}
        />
        <BinaryOptionsTradingFrequency
            {...shared_props}
            binary_options_trading_frequency_enum={binary_options_trading_frequency_enum}
        />
        <CFDTradingExperience {...shared_props} cfd_trading_experience_enum={cfd_trading_experience_enum} />
        <CFDTradingFrequency {...shared_props} cfd_trading_frequency_enum={cfd_trading_frequency_enum} />
        <OtherInstrumentsTradingExperience
            {...shared_props}
            other_instruments_trading_experience_enum={other_instruments_trading_experience_enum}
        />
        <OtherInstrumentsTradingFrequency
            {...shared_props}
            other_instruments_trading_frequency_enum={other_instruments_trading_frequency_enum}
        />
    </React.Fragment>
);
class FinancialDetails extends React.Component {
    form = React.createRef();

    async componentDidMount() {
        await this.form.current.getFormikActions().validateForm();
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    handleCancel = values => {
        this.props.onSave(this.props.index, values);
        this.props.onCancel();
    };

    render() {
        const padding_bottom = window.innerHeight < 930 ? '10rem' : '12rem';
        return (
            <Formik
                initialValues={{ ...this.props.value }}
                validate={this.props.validate}
                onSubmit={(values, actions) => {
                    this.props.onSubmit(this.props.index, values, actions.setSubmitting);
                }}
                ref={this.form}
            >
                {({ handleSubmit, isSubmitting, errors, values, setFieldValue, handleChange, handleBlur, touched }) => {
                    const shared_props = {
                        values,
                        handleChange,
                        handleBlur,
                        touched,
                        errors,
                        setFieldValue,
                    };

                    return (
                        <AutoHeightWrapper default_height={200}>
                            {({ setRef, height }) => (
                                <form ref={setRef} onSubmit={handleSubmit}>
                                    <Div100vhContainer
                                        className='details-form'
                                        height_offset='199px'
                                        is_disabled={isDesktop()}
                                    >
                                        <p className='details-form__description'>
                                            <Localize i18n_default_text="We're legally obliged to ask for your financial information." />
                                        </p>
                                        <ThemedScrollbars
                                            is_native={isMobile()}
                                            autoHide={!(window.innerHeight < 890)}
                                            height={height}
                                        >
                                            <div
                                                className='details-form__elements'
                                                style={{ paddingBottom: isDesktop() ? padding_bottom : null }}
                                            >
                                                <FinancialInformation
                                                    shared_props={shared_props}
                                                    income_source_enum={this.props.income_source_enum}
                                                    employment_status_enum={this.props.employment_status_enum}
                                                    employment_industry_enum={this.props.employment_industry_enum}
                                                    occupation_enum={this.props.occupation_enum}
                                                    source_of_wealth_enum={this.props.source_of_wealth_enum}
                                                    education_level_enum={this.props.education_level_enum}
                                                    net_income_enum={this.props.net_income_enum}
                                                    estimated_worth_enum={this.props.estimated_worth_enum}
                                                    account_turnover_enum={this.props.account_turnover_enum}
                                                />
                                                <TradingExperience
                                                    shared_props={shared_props}
                                                    forex_trading_experience_enum={
                                                        this.props.forex_trading_experience_enum
                                                    }
                                                    forex_trading_frequency_enum={
                                                        this.props.forex_trading_frequency_enum
                                                    }
                                                    binary_options_trading_experience_enum={
                                                        this.props.binary_options_trading_experience_enum
                                                    }
                                                    binary_options_trading_frequency_enum={
                                                        this.props.binary_options_trading_frequency_enum
                                                    }
                                                    cfd_trading_experience_enum={this.props.cfd_trading_experience_enum}
                                                    cfd_trading_frequency_enum={this.props.cfd_trading_frequency_enum}
                                                    other_instruments_trading_experience_enum={
                                                        this.props.other_instruments_trading_experience_enum
                                                    }
                                                    other_instruments_trading_frequency_enum={
                                                        this.props.other_instruments_trading_frequency_enum
                                                    }
                                                />
                                            </div>
                                        </ThemedScrollbars>
                                        <FormSubmitButton
                                            is_absolute
                                            is_disabled={
                                                // eslint-disable-next-line no-unused-vars
                                                isSubmitting || Object.keys(errors).length > 0
                                            }
                                            label={localize('Next')}
                                            has_cancel
                                            cancel_label={localize('Previous')}
                                            onCancel={this.handleCancel.bind(this, values)}
                                        />
                                    </Div100vhContainer>
                                </form>
                            )}
                        </AutoHeightWrapper>
                    );
                }}
            </Formik>
        );
    }
}

export default connect(({ client }) => ({
    is_gb_residence: client.residence === 'gb',
    fetchStatesList: client.fetchStatesList,
    states_list: client.states_list,
}))(FinancialDetails);
