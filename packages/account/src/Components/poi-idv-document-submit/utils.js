import { getUrlBase } from '@deriv/shared';

export const getDocumentData = (country_code, document_type) => {
    if (Object.keys(idv_document_data).includes(country_code)) {
        return idv_document_data[country_code][document_type];
    }
    return null;
};

// Automatically formats input string with separators based on example format arguement.
export const formatInput = (example_format, input_string, separator) => {
    const separator_index = example_format.indexOf(separator);
    const format_count = getCharCount(example_format, separator);
    const input_count = getCharCount(input_string, separator);

    if (separator_index !== -1 && input_count < format_count && input_string.length - 1 >= separator_index) {
        return input_string.slice(0, separator_index) + separator + input_string.slice(separator_index);
    }
    return input_string;
};

const getCharCount = (target_string, char) => target_string.match(new RegExp(`${char}`, 'g'))?.length || 0;

const getImageLocation = image_name => getUrlBase(`/public/images/common/${image_name}`);

// Note: Ensure that the object keys matches BE API's keys. This is simply a mapping for FE templates
const idv_document_data = {
    ke: {
        alien_card: {
            new_display_name: '',
            example_format: '123456',
            sample_image: getImageLocation('ke_alien_card.png'),
        },
        national_id: {
            new_display_name: '',
            example_format: '123456789',
            sample_image: getImageLocation('ke_national_identity_card.png'),
        },
        passport: {
            new_display_name: '',
            example_format: 'A12345678',
            sample_image: getImageLocation('ke_passport.png'),
        },
    },
    za: {
        national_id: {
            new_display_name: '',
            example_format: '1234567890123',
            sample_image: getImageLocation('za_national_identity_card.png'),
        },
        national_id_no_photo: {
            new_display_name: '',
            example_format: '1234567890123',
            sample_image: '',
        },
    },
    ng: {
        bvn: {
            new_display_name: 'Bank verification number',
            example_format: '12345678901',
            sample_image: '',
        },
        cac: {
            new_display_name: 'Corporate affairs commission',
            example_format: '12345678',
            sample_image: '',
        },
        drivers_license: {
            new_display_name: '',
            example_format: 'ABC123456789012',
            sample_image: getImageLocation('ng_drivers_license.png'),
        },
        nin: {
            new_display_name: 'National identity number',
            example_format: '12345678901',
            sample_image: '',
        },
        nin_slip: {
            new_display_name: 'National identity number slip',
            example_format: '12345678901',
            sample_image: getImageLocation('ng_nin_slip.png'),
        },
        tin: {
            new_display_name: 'Taxpayer identification number',
            example_format: '12345678-1234',
            sample_image: '',
        },
        voter_id: {
            new_display_name: 'Voter ID',
            example_format: '1234567890123456789',
            sample_image: getImageLocation('ng_voter_id.png'),
        },
    },
    gh: {
        drivers_license: {
            new_display_name: '',
            example_format: 'B1234567',
            sample_image: '',
        },
        national_id: {
            new_display_name: 'National ID',
            example_format: 'GHA-123456789-1',
            sample_image: '',
        },
        passport: {
            new_display_name: 'Passport',
            example_format: 'G1234567',
            sample_image: '',
        },
        ssnit: {
            new_display_name: 'Social Security and National Insurance Trust',
            example_format: 'C123456789012',
            sample_image: '',
        },
        voter_id: {
            new_display_name: 'Voter ID',
            example_format: '01234567890',
            sample_image: '',
        },
    },
};
