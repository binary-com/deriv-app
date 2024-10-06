import * as Yup from 'yup';
import { TTranslations } from '../../../../../types';
import { fileValidator } from '../../ManualService/components/utils';

export const getPoaValidationSchema = (localize: TTranslations['localize']) =>
    Yup.object().shape({
        documentType: Yup.string().required(localize('Document type is required.')),
        firstLine: Yup.string()
            .trim()
            .required(localize('First line of address is required.'))
            .max(70, localize('Should be less than 70.'))
            .matches(
                /^[\p{L}\p{Nd}\s'.,:;()\u00b0@#/-]{0,70}$/u,
                localize("Use only the following special characters: . , ' : ; ( ) ° @ # / -'")
            ),
        poaFile: fileValidator,
        secondLine: Yup.string()
            .trim()
            .max(70, localize('Should be less than 70.'))
            .matches(
                /^[\p{L}\p{Nd}\s'.,:;()\u00b0@#/-]{0,70}$/u,
                localize("Use only the following special characters: . , ' : ; ( ) ° @ # / -'")
            ),
        townCityLine: Yup.string()
            .required(localize('Town/City is required.'))
            .max(70, localize('Should be less than 70.'))
            .matches(/^[a-zA-Z\s\-.']+$/, localize('Only letters, space, hyphen, period, and apostrophe are allowed.')),
        zipCodeLine: Yup.string()
            .max(20, localize('Please enter a Postal/ZIP code under 20 characters.'))
            .matches(/^[A-Za-z0-9][A-Za-z0-9\s-]*$/, localize('Only letters, numbers, space, and hyphen are allowed.')),
    });
