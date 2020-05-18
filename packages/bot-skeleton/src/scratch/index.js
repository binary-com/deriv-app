import { help_content_config, help_content_types } from './help-content/help-content.config';
import { observer as globalObserver } from '../utils/observer';
import {
    load,
    save,
    scrollWorkspace,
    updateWorkspaceName,
    runGroupedEvents,
    runIrreversibleEvents,
} from './utils/index';

export default {
    load,
    help_content_config,
    help_content_types,
    runGroupedEvents,
    runIrreversibleEvents,
    save,
    scrollWorkspace,
    globalObserver,
    updateWorkspaceName,
};
