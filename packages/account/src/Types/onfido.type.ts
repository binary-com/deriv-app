/**
 * Copied the types from onfido-sdk npm lib to reduce the bundle size. Onfido functionality is being used via CDN
 */
export declare type SupportedLanguages =
    | 'bg'
    | 'da'
    | 'hr'
    | 'cs'
    | 'nl'
    | 'et'
    | 'fi'
    | 'fr'
    | 'de'
    | 'el'
    | 'en'
    | 'he'
    | 'hi'
    | 'hu'
    | 'in'
    | 'it'
    | 'ja'
    | 'ko'
    | 'lv'
    | 'lt'
    | 'no'
    | 'no_NO'
    | 'nb'
    | 'fa'
    | 'pl'
    | 'pt'
    | 'ro'
    | 'ru'
    | 'sr'
    | 'sk'
    | 'sl'
    | 'es'
    | 'sv'
    | 'th'
    | 'tr'
    | 'uk'
    | 'vi'
    | 'zh'
    | 'ar'
    | 'bg_BG'
    | 'cs_CZ'
    | 'da_DK'
    | 'de_DE'
    | 'el_GR'
    | 'en_GB'
    | 'en_US'
    | 'es_419'
    | 'es_ES'
    | 'et_EE'
    | 'fa_IR'
    | 'fi_FI'
    | 'fr_CA'
    | 'fr_FR'
    | 'he_IL'
    | 'hi_IN'
    | 'hr_HR'
    | 'hu_HU'
    | 'hy'
    | 'id_ID'
    | 'it_IT'
    | 'ja_JP'
    | 'ko_KR'
    | 'lt_LT'
    | 'lv_LV'
    | 'ms'
    | 'nl_NL'
    | 'pl_PL'
    | 'pt_BR'
    | 'pt_PT'
    | 'ro_RO'
    | 'ru_RU'
    | 'sk_SK'
    | 'sl_SI'
    | 'sr_Latn_RS'
    | 'sv_SE'
    | 'th_TH'
    | 'tr_TR'
    | 'uk_UA'
    | 'vi_VN'
    | 'zh_CN'
    | 'zh_TW';
export declare type LocaleConfig = {
    locale?: SupportedLanguages;
    direction?: LocaleDirection;
    phrases: Record<string, unknown>;
    mobilePhrases?: Record<string, unknown>;
};
export declare type LocaleDirection = 'ltr' | 'rtl';
declare const STEP_WELCOME = 'welcome';
declare const STEP_USER_CONSENT = 'userConsent';
declare const STEP_DOCUMENT = 'document';
declare const STEP_POA = 'poa';
declare const STEP_FACE = 'face';
declare const STEP_COMPLETE = 'complete';
declare const STEP_ACTIVE_VIDEO = 'activeVideo';
declare const STEP_CROSS_DEVICE_SESSION_INTRO = 'crossDeviceSessionIntro';
declare const STEP_DATA_CAPTURE = 'data';
declare const STEP_WORKFLOW_RETRY = 'retry';
export declare type PublicStepTypes =
    | typeof STEP_WELCOME
    | typeof STEP_DOCUMENT
    | typeof STEP_POA
    | typeof STEP_FACE
    | typeof STEP_COMPLETE
    | typeof STEP_CROSS_DEVICE_SESSION_INTRO
    | typeof STEP_DATA_CAPTURE;
export declare type PrivateStepTypes = typeof STEP_WORKFLOW_RETRY | typeof STEP_USER_CONSENT | typeof STEP_ACTIVE_VIDEO;
export declare type StepTypes = PublicStepTypes | PrivateStepTypes;
export declare type DocumentTypes =
    | 'passport'
    | 'driving_licence'
    | 'national_identity_card'
    | 'residence_permit'
    | 'generic_document';
export declare type PoaTypes =
    | 'bank_building_society_statement'
    | 'utility_bill'
    | 'council_tax'
    | 'benefit_letters'
    | 'government_letter'
    | 'address_certificate';
export declare type RequestedVariant = 'standard' | 'video' | 'motion';
export declare type DocumentTypeConfig = boolean | CountryConfig;
export declare type StepOptionDocumentType = {
    [Key in DocumentTypes]?: Key extends 'generic_document' ? CustomConfig : DocumentTypeConfig;
};
export declare type CountryConfig = {
    country: string | null;
};
export declare type CustomConfig = {
    id: string;
};
export declare type CaptureOptions = {
    requestedVariant?: RequestedVariant;
    useUploader?: boolean;
};
export declare type StepOptionWelcome = {
    title?: string;
    descriptions?: string[];
    nextButton?: string;
};
export declare type StepOptionRetry = {
    text?: {
        headline?: string;
        description?: string;
        button_title?: string;
    };
};
export declare type GenericDocumentType = {
    id: string;
    title: string;
    subTitle: string;
    country: string;
    pages: number;
};
export declare type StepOptionDocument = {
    hideCountrySelection?: boolean;
    genericDocumentTypes?: Array<GenericDocumentType>;
    documentTypes?: StepOptionDocumentType;
    documentSelection?: documentSelectionType[];
    countryFilter?: documentSelectionType[];
    forceCrossDevice?: boolean;
    disableCrossDevice?: boolean;
    photoCaptureFallback?: never;
} & CaptureOptions;
export declare type StepOptionPoA = Record<string, unknown>;
export declare type StepOptionFace = {
    forceCrossDevice?: never;
    disableCrossDevice?: boolean;
    photoCaptureFallback?: boolean;
    motionFallbackVariant?: Omit<RequestedVariant, 'motion'>;
    useMultipleSelfieCapture?: boolean;
    useWorkflow?: boolean;
    recordMotionAudio?: boolean;
} & CaptureOptions;
export declare type StepOptionComplete = {
    message?: string;
    submessage?: string;
};
export declare type StepOptionData = {
    first_name?: string;
    last_name?: string;
    email?: string;
    dob?: string;
    country_residence?: string;
    phone_number?: string;
    company_name?: string;
    address?: {
        country?: string;
        line1?: string;
        line2?: string;
        line3?: string;
        town?: string;
        state?: string;
        postcode?: string;
    };
    ssn_enabled?: boolean;
    national_id_number?: {
        national_id_type?: string;
        national_id_value?: string;
    };
    input?: {
        ssn_consent_granted?: boolean;
        phone_number_consent_granted?: boolean;
    };
    profile_data_selection?: {
        address_enabled?: boolean;
        country_residence_enabled?: boolean;
        dob_enabled?: boolean;
        email_enabled?: boolean;
        first_name_enabled?: boolean;
        last_name_enabled?: boolean;
        phone_number_enabled?: boolean;
        nationality_enabled?: boolean;
        pan_enabled?: boolean;
        ssn_enabled?: boolean;
        national_id_number_enabled?: boolean;
        phone_number_consent_required?: boolean;
        ssn_consent_required?: boolean;
    };
    getPersonalData?: GetPersonalDataFunc;
};
export declare type GetPersonalDataFunc = () => Record<string, unknown>;
export declare type StepOptionsMap = {
    welcome: StepOptionWelcome;
    userConsent: never;
    crossDeviceSessionIntro: never;
    document: StepOptionDocument;
    poa: StepOptionPoA;
    face: StepOptionFace;
    activeVideo: never;
    complete: StepOptionComplete;
    data: StepOptionData;
    retry: StepOptionRetry;
};
export declare type StepConfigMap = {
    [Type in StepTypes]: {
        type: Type;
        options?: StepOptionsMap[Type];
    };
};
export declare type StepConfigWelcome = StepConfigMap['welcome'];
export declare type StepConfigUserConsent = StepConfigMap['userConsent'];
export declare type StepConfigActiveVideo = StepConfigMap['activeVideo'];
export declare type StepConfigCrossDeviceSessionIntro = StepConfigMap['crossDeviceSessionIntro'];
export declare type StepConfigDocument = StepConfigMap['document'];
export declare type StepConfigPoa = StepConfigMap['poa'];
export declare type StepConfigFace = StepConfigMap['face'];
export declare type StepConfigComplete = StepConfigMap['complete'];
export declare type StepConfigData = StepConfigMap['data'];
export declare type StepConfigRetry = StepConfigMap['retry'];
export declare type PublicStepConfig =
    | StepConfigWelcome
    | StepConfigDocument
    | StepConfigPoa
    | StepConfigFace
    | StepConfigComplete
    | StepConfigActiveVideo
    | StepConfigCrossDeviceSessionIntro
    | StepConfigData
    | StepConfigRetry;
export declare type PrivateStepConfig = {
    skip?: boolean;
};
export declare type StepConfig = (PublicStepConfig | StepConfigUserConsent) & PrivateStepConfig;
export declare type UICustomizationOptions = {
    colorBackgroundSurfaceModal?: string;
    colorBorderSurfaceModal?: string;
    borderWidthSurfaceModal?: string;
    borderStyleSurfaceModal?: string;
    borderRadiusSurfaceModal?: string;
    fontFamilyTitle?: string;
    fontSizeTitle?: string;
    fontWeightTitle?: number;
    colorContentTitle?: string;
    fontFamilySubtitle?: string;
    fontSizeSubtitle?: string;
    fontWeightSubtitle?: number;
    colorContentSubtitle?: string;
    fontFamilyBody?: string;
    fontSizeBody?: string;
    fontWeightBody?: number;
    colorContentBody?: string;
    colorContentButtonPrimaryText?: string;
    colorBackgroundButtonPrimary?: string;
    colorBackgroundButtonPrimaryHover?: string;
    colorBackgroundButtonPrimaryActive?: string;
    colorBorderButtonPrimary?: string;
    colorBorderButtonPrimaryHover?: string;
    colorBorderButtonPrimaryActive?: string;
    colorContentButtonSecondaryText?: string;
    colorBackgroundButtonSecondary?: string;
    colorBackgroundButtonSecondaryHover?: string;
    colorBackgroundButtonSecondaryActive?: string;
    colorBorderButtonSecondary?: string;
    colorBorderButtonSecondaryHover?: string;
    colorBorderButtonSecondaryActive?: string;
    borderRadiusButton?: string;
    buttonGroupStacked?: boolean;
    colorBackgroundSelector?: string;
    colorContentDocTypeButton?: string;
    colorBackgroundDocTypeButton?: string;
    colorBackgroundDocTypeButtonHover?: string;
    colorBackgroundDocTypeButtonActive?: string;
    colorBorderDocTypeButton?: string;
    colorBorderDocTypeButtonHover?: string;
    colorBorderDocTypeButtonActive?: string;
    colorBackgroundIcon?: string;
    colorIcon?: string;
    colorInputOutline?: string;
    colorBorderLinkUnderline?: string;
    colorContentLinkTextHover?: string;
    colorBackgroundLinkHover?: string;
    colorBackgroundLinkActive?: string;
    colorContentAlertInfo?: string;
    colorBackgroundAlertInfo?: string;
    colorBackgroundAlertInfoLinkHover?: string;
    colorBackgroundAlertInfoLinkActive?: string;
    colorContentAlertError?: string;
    colorBackgroundAlertError?: string;
    colorBackgroundAlertErrorLinkHover?: string;
    colorBackgroundAlertErrorLinkActive?: string;
    colorBackgroundInfoPill?: string;
    colorContentInfoPill?: string;
    colorBackgroundButtonIconHover?: string;
    colorBackgroundButtonIconActive?: string;
    colorBackgroundButtonCameraHover?: string;
    colorBackgroundButtonCameraActive?: string;
    colorBackgroundQRCode?: string;
};
export interface NormalisedSdkOptions extends Omit<SdkOptions, 'steps'> {
    steps: StepConfig[];
}
export declare type DocumentSides = 'front' | 'back';
export declare type documentSelectionType = {
    config: unknown;
    document_type: string;
    id: string;
    issuing_country: string;
};
export declare type FatalErrorTypes = 'expired_token' | 'expired_trial' | 'exception' | 'sdk_version_insufficient';
export declare type ImageQualityValidationTypes =
    | 'detect_original_document_present'
    | 'detect_barcode'
    | 'detect_document'
    | 'detect_cutoff'
    | 'detect_glare'
    | 'detect_blur';
export declare type UploadFileResponse = {
    id: string;
    created_at: string;
    file_name: string;
    file_type: string;
    file_size: number;
    href: string;
    download_href: string;
};
export declare type ImageQuality = {
    breakdown?: {
        original_document_present?: {
            has_original_document_present: boolean;
            has_error: boolean;
            error: unknown;
            reason: 'photo_of_screen' | 'screenshot' | 'document_on_printed_paper' | 'scan';
        };
    };
};
export declare type ImageQualityWarnings = Partial<
    Record<
        ImageQualityValidationTypes,
        {
            valid: boolean;
        }
    >
> & {
    image_quality?: ImageQuality;
};
export declare type DocumentImageResponse = {
    applicant_id: string;
    type: DocumentTypes | PoaTypes;
    side: DocumentSides;
    issuing_country: string | null | undefined;
    sdk_warnings?: ImageQualityWarnings;
} & UploadFileResponse;
declare const CHALLENGE_RECITE = 'recite';
declare const CHALLENGE_MOVEMENT = 'movement';
export declare type ChallengePayload =
    | {
          type: typeof CHALLENGE_RECITE;
          query: number[];
      }
    | {
          type: typeof CHALLENGE_MOVEMENT;
          query: string;
      };
export declare type VideoChallengeLanguage = {
    source: string;
    language_code: SupportedLanguages;
};
export declare type FaceVideoResponse = {
    challenge: ChallengePayload[];
    languages: VideoChallengeLanguage[];
} & UploadFileResponse;
export declare type EnterpriseCobranding = {
    text: string;
};
export declare type EnterpriseLogoCobranding = {
    lightLogoSrc: string;
    darkLogoSrc: string;
};
export declare type EnterpriseCallbackResponse = {
    continueWithOnfidoSubmission?: boolean;
    onfidoSuccessResponse?: DocumentImageResponse | UploadFileResponse | FaceVideoResponse;
};
export declare type EnterpriseFeatures = {
    hideOnfidoLogo?: boolean;
    cobrand?: EnterpriseCobranding;
    logoCobrand?: EnterpriseLogoCobranding;
    useCustomizedApiRequests?: boolean;
    onSubmitDocument?: (data: FormData) => Promise<EnterpriseCallbackResponse>;
    onSubmitSelfie?: (data: FormData) => Promise<EnterpriseCallbackResponse>;
    onSubmitVideo?: (data: FormData) => Promise<EnterpriseCallbackResponse>;
};
export declare type LogLevels = 'debug' | 'info' | 'warning' | 'error' | 'fatal';
export interface ApplyFilter {
    doc_type?: string;
}
export interface BiometricsLiveness {
    active?: BiometricsLivenessActive;
    passive?: BiometricsLivenessPassive;
}
export interface BiometricsLivenessActive {
    enabled?: boolean;
    video_settings?: BiometricsLivenessActiveVideoSettings;
}
export interface BiometricsLivenessActiveVideoSettings {
    framerate?: number;
    bitrate?: number;
    duration?: number;
    focusLock?: boolean;
    white_balanceLock?: boolean;
    exposure_lock?: boolean;
    codec?: string;
    codec_profile?: number;
}
export interface BiometricsLivenessPassive {
    enabled?: boolean;
    video_settings?: BiometricsLivenessPassiveVideoSettings;
}
export interface BiometricsLivenessPassiveVideoSettings {
    framerate?: number;
    bitrate?: number;
    duration?: number;
    focus_lock?: boolean;
    white_balance_lock?: boolean;
    exposure_lock?: boolean;
    codec?: string;
}
export interface DocumentCapture {
    /**
     * The number of additional image quality retries that should return an error if an image quality validation is detected.
     * This means that if image quality validations are detected, the user will only see an error on the first [1 + max_total_retries] upload attempt.
     * From the [1 + max_total_retries + 1] attempt, if image quality validations are detected, the user will see a warning and they use can choose to
     * proceed regardless of the image quality warning.
     */
    max_total_retries?: number;
    torch_turn_on_timeMs?: number;
    video_length_ms?: number;
    video_bitrate?: number;
    enable_auto_capture_doc_capture?: boolean;
    enable_js_camera_doc_capture?: boolean;
    auto_capture_enabled_documents?: Array<{
        country: string;
        document_type: string;
    }>;
    auto_capture_timeout_ms?: number;
    allow_disabling_cross_device?: boolean;
    enable_native_camera_fallback?: boolean;
}
export interface FaceSelfieCapture {
    sign_upload?: boolean;
    enable_native_camera_fallback?: boolean;
}
export interface FaceVideoCapture {
    sign_upload?: boolean;
}
export interface MotionCapture {
    supported: boolean;
    video_settings: {
        framerate: number;
        bitrate: number;
        duration: number;
        webm_mime_type_preference: string[];
    };
    sign_upload: boolean;
}
export interface ExperimentalFeatures {
    enable_image_quality_service?: boolean;
    enable_multi_frame_capture?: boolean;
    motion_experiment?: {
        enabled: boolean;
    };
    performance_benchmark?: {
        enabled: boolean;
        threshold: number;
    };
}
export interface SdkFeatures {
    enable_require_applicant_consents?: boolean;
    disable_cross_device_sms?: boolean;
    enable_in_house_analytics?: boolean;
    enable_performance_analytics?: boolean;
    enable_document_support_rules?: boolean;
    logger?: {
        enabled?: boolean;
        levels?: LogLevels[];
    };
}
export interface OnDeviceValidation {
    max_total_retries?: number;
    threshold?: number;
    applies_to?: ApplyFilter[];
}
export interface SdkConfigurationValidations {
    on_device?: SdkConfigurationValidationsOnDevice;
}
export interface SdkConfigurationValidationsOnDevice {
    blur?: OnDeviceValidation;
}
export interface PassiveSignals {
    enabled: boolean;
}
export interface DeviceIntelligence {
    passive_signals: PassiveSignals;
}
export declare type SdkConfiguration = {
    validations?: SdkConfigurationValidations;
    experimental_features?: ExperimentalFeatures;
    document_capture?: DocumentCapture;
    motion_capture?: MotionCapture;
    biometrics_liveness?: BiometricsLiveness;
    sdk_features?: SdkFeatures;
    device_intelligence?: DeviceIntelligence;
    face_selfie_capture?: FaceSelfieCapture;
    face_video_capture?: FaceVideoCapture;
};
export declare type DocumentResponse = {
    id: string;
    side: string;
    type: DocumentTypes;
    variant: RequestedVariant;
};
export declare type DocumentVideoResponse = {
    id: string;
    media_uuids: string[];
    variant: 'video';
};
export declare type FaceResponse = {
    id: string;
    variant: RequestedVariant;
};
export declare type SdkResponse = {
    document_front?: DocumentResponse;
    document_back?: DocumentResponse;
    document_video?: DocumentVideoResponse;
    face?: FaceResponse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    poa?: DocumentResponse;
};
export declare type SdkError = {
    type: FatalErrorTypes;
    message: string;
};
export declare type UserExitCode = 'USER_CONSENT_DENIED';
export declare type ServerRegions = 'US' | 'EU' | 'CA';
export interface FunctionalConfigurations {
    disableAnalytics?: boolean;
    disableAnalyticsCookies?: boolean;
    mobileFlow?: boolean;
    roomId?: string;
    tearDown?: boolean;
    useMemoryHistory?: boolean;
    useWorkflow?: boolean;
}
export interface SdkOptions extends FunctionalConfigurations {
    onComplete?: (data: SdkResponse) => void;
    onError?: (error: SdkError) => void;
    onUserExit?: (data: UserExitCode) => void;
    onModalRequestClose?: () => void;
    token?: string;
    useModal?: boolean;
    isModalOpen?: boolean;
    shouldCloseOnOverlayClick?: boolean;
    containerId?: string;
    containerEl?: HTMLElement | null;
    language?: SupportedLanguages | LocaleConfig;
    region?: ServerRegions;
    smsNumberCountryCode?: string;
    userDetails?: {
        smsNumber?: string;
    };
    steps?: Array<PublicStepTypes | PublicStepConfig>;
    enterpriseFeatures?: EnterpriseFeatures;
    customUI?: UICustomizationOptions | null;
    autoFocusOnInitialScreenTitle?: boolean;
    crossDeviceClientIntroProductName?: string;
    crossDeviceClientIntroProductLogoSrc?: string;
    _crossDeviceLinkMethods?: Array<string> | null;
    overrideSdkConfiguration?: Partial<SdkConfiguration>;
    workflowRunId?: string;
    isWebView?: boolean;
    disableWelcomeScreen?: boolean;
}
export declare type SdkHandle = {
    containerId?: string;
    options: NormalisedSdkOptions;
    setOptions(options: SdkOptions): void;
    /**
     * @deprecated - use safeTeardown instead
     */
    tearDown(): void;
    safeTearDown(): Promise<void>;
};
export declare type SdkInitMethod = (options: SdkOptions) => SdkHandle;
export declare const init: SdkInitMethod;

export {};
