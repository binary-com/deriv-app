declare module '*.png';

declare module '@binary-com/binary-document-uploader' {
    import { DocumentUploadRequest } from '@deriv/api-types';

    class DocumentUploader {
        constructor(settings: { connection: any });
        upload(file: {
            documentType?: DocumentUploadRequest['document_type'];
            documentFormat?: string | Omit<string, DocumentUploadRequest['document_format']>;
            documentId?: DocumentUploadRequest['document_id'];
            expirationDate?: string;
            lifetimeValid?: DocumentUploadRequest['lifetime_valid'];
            pageType?: DocumentUploadRequest['page_type'];
            [key: string]: unknown;
        }): Promise<{ message?: string; warning?: string; [key: string]: any }>;
    }

    export default DocumentUploader; // Export the class as default
}
