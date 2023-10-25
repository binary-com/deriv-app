import { datadogRum } from '@datadog/browser-rum';
//eslint-disable-next-line
console.log('CORE_DDOG', process.env.NODE_ENV, process.env.REF_NAME);
const DATADOG_APP_ID = process.env.DATADOG_APPLICATION_ID ?? '';
const DATADOG_CLIENT_TOKEN = process.env.DATADOG_CLIENT_TOKEN ?? '';
const isProduction = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV === 'staging';

let dataDogSessionSampleRate = 0;
let dataDogSessionReplaySampleRate = 0;
let dataDogVersion = '';
let dataDogEnv = '';
let serviceName = '';

if (isProduction) {
    serviceName = 'app.deriv.com';
    dataDogVersion = `deriv-app-${process.env.REF_NAME}`;
    dataDogSessionReplaySampleRate = +process.env.DATADOG_SESSION_REPLAY_SAMPLE_RATE! ?? 1;
    dataDogSessionSampleRate = +process.env.DATADOG_SESSION_SAMPLE_RATE! ?? 10;
    dataDogEnv = 'production';
} else if (isStaging) {
    serviceName = 'staging-app.deriv.com';
    dataDogVersion = `deriv-app-staging-v${process.env.REF_NAME}`;
    dataDogSessionReplaySampleRate = 100;
    dataDogSessionSampleRate = 100;
    dataDogEnv = 'staging';
}

datadogRum.init({
    applicationId: isStaging || isProduction ? DATADOG_APP_ID : '',
    clientToken: isStaging || isProduction ? DATADOG_CLIENT_TOKEN : '',
    site: 'datadoghq.com',
    service: serviceName,
    env: dataDogEnv,
    sessionSampleRate: dataDogSessionSampleRate,
    sessionReplaySampleRate: dataDogSessionReplaySampleRate,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
    version: dataDogVersion,
    trackFrustrations: true,
    enableExperimentalFeatures: ['clickmap'],
    excludedActivityUrls: [/^https:\/\/api.telegram.org.*$/],
});
datadogRum.startSessionReplayRecording();
