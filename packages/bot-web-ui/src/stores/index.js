import BotSettingsStore from './bot-settings-store';
import ChartStore from './chart-store';
import ContractCardStore from './contract-card-store';
import FlyoutStore from './flyout-store';
import FlyoutHelpStore from './flyout-help-store';
import GoogleDriveStore from './google-drive-store';
import JournalStore from './journal-store';
import RunPanelStore from './run-panel-store';
import SaveLoadModalStore from './saveload-modal-store';
import SummaryStore from './summary-store';
import ToolbarStore from './toolbar-store';
import TransactionsStore from './transactions-store';
import QuickStrategyStore from './quick-strategy-store';
import MainContentStore from './main-content-store';

export default class RootStore {
    constructor(core, ws, dbot) {
        this.core = core;
        this.ui = core.ui;
        this.common = core.common;
        this.ws = ws;
        this.dbot = dbot;
        this.server_time = core.common.server_time;
        this.bot_settings = new BotSettingsStore(this);
        this.contract_card = new ContractCardStore(this);
        this.flyout = new FlyoutStore(this);
        this.flyout_help = new FlyoutHelpStore(this);
        this.google_drive = new GoogleDriveStore(this);
        this.journal = new JournalStore(this);
        this.saveload = new SaveLoadModalStore(this);
        this.summary = new SummaryStore(this);
        this.transactions = new TransactionsStore(this);
        this.toolbar = new ToolbarStore(this);
        this.quick_strategy = new QuickStrategyStore(this);
        this.run_panel = new RunPanelStore(this);
        this.chart_store = new ChartStore(this);
        this.main_content = new MainContentStore(this);
    }
}
