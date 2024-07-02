import PropTypes from 'prop-types';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

const Localize = ({ i18n_default_text, values, components, options, i18n, shouldUnescape }) => {
    const { t } = useTranslation();

    return (
        <Trans
            t={t}
            i18n={i18n}
            defaults={i18n_default_text}
            values={values}
            components={components}
            tOptions={options}
            shouldUnescape={shouldUnescape}
        />
    );
};

// Trans needs to have the i18n instance in scope
// eslint-disable-next-line react/display-name
const withI18n = i18n => props => <Localize i18n={i18n} {...props} />;

Localize.propTypes = {
    components: PropTypes.arrayOf(PropTypes.node),
    i18n: PropTypes.object.isRequired,
    i18n_default_text: PropTypes.string,
    options: PropTypes.object,
    values: PropTypes.object,
    shouldUnescape: PropTypes.bool,
};

export default withI18n;
