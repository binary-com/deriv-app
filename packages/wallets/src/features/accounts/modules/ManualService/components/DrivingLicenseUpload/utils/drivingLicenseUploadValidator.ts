import * as Yup from 'yup';
import { localize } from '@deriv-com/translations';
import { selfieUploadValidator } from '../../SelfieUpload/utils';
import { expiryDateValidator, fileValidator } from '../../utils';

export const drivingLicenseUploadValidator = Yup.object().shape({
    drivingLicenseCardBack: fileValidator,
    drivingLicenseCardFront: fileValidator,
    drivingLicenseExpiryDate: expiryDateValidator,
    drivingLicenseNumber: Yup.string()
        .matches(/^[A-Z]\d{7}$/, localize('Please enter the correct format. Example: B1234567'))
        .max(8)
        .required(localize('Please enter your Driver License number. Example: B1234567')),
    selfieFile: selfieUploadValidator,
});
