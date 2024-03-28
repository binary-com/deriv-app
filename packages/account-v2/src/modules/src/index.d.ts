import type { TSupportedDocuments } from '../../types';

type TManualForm = {
    document_expiry: string;
    document_number: string;
};

type TManualDocumentTypes = 'driving_licence' | 'national_identity_card' | 'nimc_slip' | 'passport';

type TManualFormProps = {
    onSubmit: (values: TManualForm) => void;
    selectedDocument: TManualDocumentTypes;
};

type TIDVFormProps = {
    allowDefaultValue?: boolean;
    allowIDVSkip?: boolean;
    countryCode: string;
    supportedDocuments: TSupportedDocuments;
};

type TOnfidoContainer = {
    countryCode?: string;
    isEnabledByDefault?: boolean;
    onOnfidoSubmit?: () => void;
    selectedDocument?: TManualDocumentTypes;
};

declare const ManualForm: ({ onSubmit, selectedDocument }: TManualFormProps) => JSX.Element,
    POAFormContainer: () => JSX.Element | null,
    IDVForm: (props: TIDVFormProps) => JSX.Element,
    AddressFields: () => JSX.Element,
    IDVService: () => JSX.Element,
    OnfidoContainer: (props: TOnfidoContainer) => JSX.Element;

export { AddressFields, IDVForm, IDVService, ManualForm, OnfidoContainer, POAFormContainer };
