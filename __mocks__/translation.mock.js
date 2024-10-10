import React from 'react';

const replaceValue = (text, values) => {
    return text.replace(/{{(\w+)}}/g, (match, key) => {
        // If the value is an empty string, return an empty fragment to render nothing
        if (values[key] === '') {
            return '';
        }
        return values[key] || match;
    });
};

const Localize = ({ i18n_default_text, components = [], values = {} }) => {
    // Split text into parts, extracting placeholders for components
    const parts = i18n_default_text.split(/(<\d+>.*?<\/\d+>|{{\w+}})/g);

    return (
        <>
            {parts.map((part, index) => {
                // Handle component placeholders
                const componentMatch = part.match(/<(\d+)>(.*?)<\/\1>/);
                if (componentMatch) {
                    const componentIndex = parseInt(componentMatch[1]);
                    const content = replaceValue(componentMatch[2], values);
                    const Component = components[componentIndex];
                    return Component ? React.cloneElement(Component, { key: index, children: content }) : content;
                }
                // Replace placeholders with actual values
                return replaceValue(part, values);
            })}
        </>
    );
};

const mockFn = jest.fn((text, args) => {
    return text.replace(/{{(.*?)}}/g, (_, match) => args[match.trim()]);
});

// Mock for useTranslations hook
const useTranslations = () => ({
    localize: mockFn,
    currentLang: 'EN',
});

const localize = mockFn;

const getAllowedLanguages = jest.fn(unsupported_languages => {
    if (unsupported_languages.includes('VI')) {
        return { EN: 'English' };
    }
    return { EN: 'English', VI: 'Tiếng Việt' };
});

const getInitialLanguage = jest.fn(() => 'EN');

export { Localize, localize, useTranslations, getAllowedLanguages, getInitialLanguage };
