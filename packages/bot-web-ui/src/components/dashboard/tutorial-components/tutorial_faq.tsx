import { localize } from '@deriv/translations';

export type TTutorialItem = {
    title: string;
    description: { [key: string]: string }[];
    img?: string;
};

export const FAQ_QUESTIONS: TTutorialItem[] = [
    {
        title: localize('What is DBot?'),
        description: [
            localize(
                "DBot is a web-based strategy builder for trading digital options. It’s a platform where you can build your own trading bot using drag-and-drop 'blocks'."
            ),
        ],
    },
    {
        title: localize('Where do I find the blocks I need?'),
        description: [
            localize('Follow these steps:'),
            localize('1. Go to Bot Builder.'),
            localize(
                "2. Under the Blocks menu, you'll see a list of categories. Blocks are grouped within these categories. Choose the block you want and drag them to the workspace."
            ),
            localize('3. You can also search for the blocks you want using the search bar above the categories.'),
            localize('For more info, check out this blog post on the basics of building a trading bot.'),
        ],
    },
    {
        title: localize('How do I remove blocks from the workspace?'),
        description: [
            localize('Change the answer to:'),
            localize('Click on the block you want to remove and press Delete on your keyboard.'),
        ],
    },
    {
        title: localize('How do I create variables?'),
        description: [
            localize('1. Under the Blocks menu, go to Utility > Variables.'),
            localize(
                '2. Enter a name for your variable, and hit Create. New blocks containing your new variable will appear below.'
            ),
            localize('3. Choose the block you want and drag it to the workspace.'),
        ],
    },
    {
        title: localize('Do you offer pre-built trading bots on DBot?'),
        description: [
            localize(
                "Yes, you can get started with a pre-built bot using the Quick strategy feature. You’ll find some of the most popular trading strategies here: Martingale, D'Alembert, and Oscar's Grind. Just select the strategy, enter your trade parameters, and your bot will be created for you. You can always tweak the parameters later."
            ),
        ],
    },
    {
        title: localize('What is a quick strategy?'),
        description: [
            localize(
                "A quick strategy is a ready-made strategy that you can use in DBot. There are 3 quick strategies you can choose from: Martingale, D'Alembert, and Oscar's Grind."
            ),
            localize('Using a quick strategy'),
            localize('1. Go to Quick strategy and select the strategy you want.'),
            localize('2. Select the asset and trade type.'),
            localize('3. Set your trade parameters and hit Create.'),
            localize(
                '4. Once the blocks are loaded onto the workspace, tweak the parameters if you want, or hit Run to start trading.'
            ),
            localize(
                '5. Hit Save to download your bot. You can choose to download your bot to your device or your Google Drive.'
            ),
        ],
    },
    {
        title: localize('How do I save my strategy?'),
        description: [
            localize(
                'In Bot Builder, hit Save on the toolbar at the top to download your bot. Give your bot a name, and choose to download your bot to your device or Google Drive. Your bot will be downloaded as an XML file.'
            ),
        ],
    },
    {
        title: localize('How do I import my own trading bot into DBot?'),
        description: [
            localize(
                'Just drag the XML file from your computer onto the workspace, and your bot will be loaded accordingly. Alternatively, you can hit Import in Bot Builder, and choose to import your bot from your computer or from your Google Drive.'
            ),
            localize('Import from your computer'),
            localize('1. After hitting Import, select Local and click Continue.'),
            localize('2. Select your XML file and hit Open.'),
            localize('3. Your bot will be loaded accordingly.'),
            localize('Import from your Google Drive'),
            localize('1. After hitting Import, select Google Drive and click Continue.'),
            localize('2. Select your XML file and hit Select.'),
            localize('3. Your bot will be loaded accordingly.'),
        ],
    },
    {
        title: localize('How do I reset the workspace?'),
        description: [
            localize(
                'In Bot Builder, hit Reset on the toolbar at the top. This will clear the workspace. Please note that any unsaved changes will be lost.'
            ),
        ],
    },
    {
        title: localize('How do I clear my transaction log?'),
        description: [localize('1. Hit Reset at the bottom of stats panel.'), localize('2. Hit OK to confirm.')],
    },
    {
        title: localize('How do I control my losses with DBot?'),
        description: [
            localize(
                'There are several ways to control your losses with DBot. Here’s a simple example of how you can implement loss control in your strategy:'
            ),
            localize('1. Create the following variables:'),
            localize(
                '- currentPL: Use this variable to store the cumulative profit or loss while your bot is running. Set the initial value to 0.'
            ),
            localize(
                '- currentStake: Use this variable to store the stake amount used in the last contract. You can assign any amount you want, but it must be a positive number.'
            ),
            localize(
                '- maximumLoss: Use this variable to store your maximum loss limit. You can assign any amount you want, but it must be a positive number.'
            ),
            localize(
                '- tradeAgain: Use this variable to stop trading when your loss limit is reached. Set the initial value to true.'
            ),
            localize(
                '2. Use a logic block to check if currentPL exceeds maximumLoss. If it does, set tradeAgain to false to prevent the bot from running another cycle.'
            ),
            localize(
                '3. Update currentPL with the profit from the last contract. If the last contract was lost, the value of currentPL will be negative.'
            ),
        ],
    },
    {
        title: localize('Can I run DBot on multiple tabs in my web browser?'),
        description: [
            localize(
                'Yes, you can. However, there are limits on your account, such as maximum number of open positions and maximum aggregate payouts on open positions. So, just keep these limits in mind when opening multiple positions. You can find more info about these limits at Settings > Account limits.'
            ),
        ],
    },
    {
        title: localize('Can I trade cryptocurrencies on DBot?'),
        description: [localize("No, we don't offer cryptocurrencies on DBot.")],
    },
    {
        title: localize('Do you sell trading bots?'),
        description: [
            localize(
                "No, we don't. However, you'll find quick strategies on DBot that'll help you build your own trading bot for free."
            ),
        ],
    },
    {
        title: localize('In which countries is DBot available?'),
        description: [
            localize(
                'We offer our services in all countries, except for the ones mentioned in our terms and conditions.'
            ),
        ],
    },
    {
        title: localize('If I close my web browser, will DBot continue to run?'),
        description: [
            localize(
                'No, DBot will stop running when your web browser is closed.No, DBot will stop running when your web browser is closed.'
            ),
        ],
    },
    {
        title: localize('What are the most popular strategies for automated trading?'),
        description: [
            localize(
                "Three of the most commonly used strategies in automated trading are Martingale, D'Alembert, and Oscar's Grind — you can find them all ready-made and waiting for you in DBot."
            ),
        ],
    },
    {
        title: localize('How do I build a trading bot?'),
        description: [
            localize(
                'Watch this video to learn how to build a trading bot on DBot. Also, check out this blog post on building a trading bot.'
            ),
        ],
    },
];
