#!/usr/bin/env node

/* eslint-disable no-console */
require('babel-register')({
    plugins: [
        'babel-plugin-transform-es2015-modules-commonjs',
        'babel-plugin-transform-object-rest-spread',
        'babel-plugin-transform-react-jsx',
    ],
    extensions: ['.jsx'],
    cache     : true,
});

const React          = require('react');
const RenderHTML     = require('react-render-html');
const ReactDOMServer = require('../node_modules/react-dom/server.js'); // eslint-disable-line import/order

const renderComponent = (context, path) => {
    const Component = require(path).default; // eslint-disable-line

    global.it = context;
    return ReactDOMServer.renderToStaticMarkup(
        React.createElement(
            Component
        )
    );
};

const color          = require('cli-color');
const Spinner        = require('cli-spinner').Spinner;
const program        = require('commander');
const Crypto         = require('crypto');
const fs             = require('fs');
const Path           = require('path');
const Url            = require('url');
const common         = require('./common');
const js_translation = require('./js_translation');
const Gettext        = require('./gettext');
const compileManifests     = require('./render_manifest').compileManifests;
const build_config   = require('../build/config/constants').config;

program
    .version('0.2.2')
    .description('Build .jsx templates into /dist folder')
    .option('-d, --dev',                 'Build for your gh-pages')
    .option('-b, --branch [branchname]', 'Build your changes to a sub-folder named: branchname')
    .option('-p, --path [save_as]',      'Compile only the template(s) that match the regex save_as')
    .option('-v, --verbose',             'Displays the list of paths to be compiled')
    .option('-t, --translations',        'Update messages.pot with new translations')
    .option('-j, --js-translations',     'Update js translation files in src/javascript/_autogenerated/')
    .parse(process.argv);

program.section = build_config.section;

const is_translation = (program.translations || program.jsTranslations);
if (is_translation && (program.dev || program.path || program.section)) {
    outputHelp('-t or -j cannot be used alongside other parameters');
}

function outputHelp(error_message) {
    program.outputHelp(str => {
        console.error(color.red(`  ERROR: ${error_message}`));
        console.error(str);
        process.exit(0);
    });
}

/** *********************************************
 * Common functions
 */

const getConfig = () => (
    {
        add_translations: false,
        branch          : program.branch,
        dist_path       : Path.join(common.root_path, 'dist', (program.branch || '')),
        languages       : program.branch === 'translations' ? ['ACH'] : common.languages,
        root_path       : common.root_path,
        root_url        : `/${program.dev && !fs.existsSync(Path.join(common.root_path, 'scripts', 'CNAME')) ? 'deriv-app/' : ''}${program.branch ? `${program.branch}/` : ''}`,
    }
);

const createDirectories = (section = '', idx) => {
    if (is_translation) return;

    const config = getConfig();
    const base_path = Path.join(config.dist_path, common.sections_config[section].path);

    if (idx === 0) { // display once only
        console.log(color.cyan('Target:'), color.yellow(config.dist_path));
    }

    const mkdir = path => fs.existsSync(path) || fs.mkdirSync(path);
    mkdir(config.dist_path);
    mkdir(base_path);

    let language;
    config.languages.forEach(lang => {
        language = lang.toLowerCase();
        mkdir(Path.join(base_path, language));
        if (common.sections_config[section].has_pjax) {
            mkdir(Path.join(base_path, `${language}/pjax`));
        }
        if (section === 'app_2') {
            compileManifests(config.dist_path, language, config.branch);
        }
    });
};

const fileHash = (path) => (
    new Promise((resolve) => {
        const fd   = fs.createReadStream(path);
        const hash = Crypto.createHash('sha1');
        hash.setEncoding('hex');

        fd.on('end', () => {
            hash.end();
            resolve(hash.read());
        });

        fd.pipe(hash);
    })
);

/** **************************************
 * Factory functions
 */

const createTranslator = lang => {
    const gettext = Gettext.getInstance();
    gettext.setLang(lang.toLowerCase());
    return (text, ...args) => gettext.gettext(text, ...args);
};

const createUrlFinder = (default_lang, section_path, root_url = getConfig().root_url) => (
    (url, lang = default_lang.toLowerCase(), section) => { // use section to create url for a different section. If missing, uses the current pages's section as default
        const section_final_path = typeof section !== 'undefined' ? common.sections_config[section === 'app' ? '' : section].path : section_path;

        let new_url = url;
        if (new_url === '' || new_url === '/') {
            new_url = '/home';
        }

        if (/(^\/?(images|js|css|scripts|download))|(manifest\.json)/.test(new_url)) {
            return Path.join(root_url, section_final_path, new_url);
        }

        const url_object = Url.parse(new_url, true);
        const pathname   = Path.join(url_object.pathname.replace(/^\//, '')); // convert a/b/../c to a/c

        if (common.pages.filter(page => page.save_as === pathname).length) {
            url_object.pathname = Path.join(root_url, section_final_path, `${lang}/${pathname}.html`);
            return Url.format(url_object);
        }

        throw new TypeError(`Invalid url ${new_url}`);
    }
);

const generateJSFilesList = async (config, section, section_static_hash) => Promise.all(
    common.sections_config[section].js_files
        .map(js => Path.join(common.sections_config[section].path, 'js', `${js}${program.dev && js === 'binary' ? '' : '.min'}.js`))
        .map(async js =>
            `${config.root_url}${js}?${/binary/.test(js) ? section_static_hash : await fileHash(Path.join(config.dist_path, js))}`
        )
);

const generateCSSFilesList = (config, sections, static_hash) => (
    sections.reduce((acc, section) => ({
        ...acc,
        [section]: common.sections_config[section].css_files
            .map(css => Path.join(config.root_url, common.sections_config[section].path, 'css', `${css}.css?${static_hash[section]}`)),
    }), {})
);

const createContextBuilder = async (sections) => {
    const config = getConfig();

    const static_hash   = {};
    const js_files_list = {};

    await Promise.all(sections.map(async section => {
        // create new hash for each section or use an existing one if there is any
        static_hash[section] = Math.random().toString(36).substring(2, 10);
        const version_path = Path.join(config.dist_path, common.sections_config[section].path, 'version');
        if (program.path) {
            try {
                static_hash[section] = await common.readFile(version_path);
            } catch (e) { } // eslint-disable-line
        }

        if (!is_translation) {
            await common.writeFile(version_path, static_hash[section], 'utf8');
        }

        // prepare js files list for all applicable sections
        js_files_list[section] = await generateJSFilesList(config, section, static_hash[section]);
    }));

    // prepare css files list for all applicable sections
    const css_files_list = generateCSSFilesList(config, sections, static_hash);

    const extra = section => ({
        js_files: [
            Path.join(config.root_url, common.sections_config[section].path, 'js', 'texts', `{PLACEHOLDER_FOR_LANG}.js?${static_hash[section]}`),
            ...js_files_list[section],
        ],
        css_files  : css_files_list[section],
        languages  : config.languages,
        broker_name: 'DTrader',
        static_hash: static_hash[section],
    });

    return {
        buildFor: (model) => {
            const translator = createTranslator(model.language);
            return Object.assign({}, extra(model.section), model, {
                L: (text, ...args) => {
                    const translated = translator(text, ...args);
                    return RenderHTML(translated);
                },
                url_for              : createUrlFinder(model.language, common.sections_config[model.section].path),
                dangreouslyRenderHtml: RenderHTML,
            });
        },
    };
};

const getFilePath = (save_path_template, language, is_pjax) => (
    save_path_template.replace('LANG_PLACEHOLDER', `${language}${is_pjax ? '/pjax' : ''}`)
);

/** **********************************************
 * Compile
 */
let context_builder;
async function compile(page) {
    const config              = getConfig();
    const languages           = config.languages.filter(lang => !common.isExcluded(page.excludes, lang));
    const CONTENT_PLACEHOLDER = 'CONTENT_PLACEHOLDER'; // used in layout.jsx
    const section_path        = common.sections_config[page.section].path;
    const save_path_template  = Path.join(config.dist_path, section_path, 'LANG_PLACEHOLDER', `${page.save_as}.html`);

    const tasks = languages.map(async lang => {
        const model = {
            website_name   : 'DTrader',
            title          : page.title,
            layout         : page.layout,
            language       : lang.toUpperCase(),
            root_url       : config.root_url,
            section        : page.section,
            current_path   : page.save_as,
            current_route  : page.current_route,
            is_pjax_request: false,
        };

        const context     = context_builder.buildFor(model);
        const page_html   = renderComponent(context, `../src/templates/${page.tpl_path}.jsx`);
        const language    = lang.toLowerCase();
        const layout_path = `../src/templates/${page.tpl_path.split('/')[0]}/_layout/layout.jsx`;

        if (page.layout) {
            const layout_normal     = `<!DOCTYPE html>\n${renderComponent(context, layout_path)}`;
            context.is_pjax_request = true;
            const layout_pjax       = renderComponent(context, layout_path);

            if (is_translation) return; // Skip saving files when it's a translation update

            // normal layout
            await common.writeFile(
                getFilePath(save_path_template, language, false),
                layout_normal.replace(CONTENT_PLACEHOLDER, page_html),
                'utf8'
            );

            // pjax layout
            if (common.sections_config[page.section].has_pjax) {
                await common.writeFile(
                    getFilePath(save_path_template, language, true),
                    layout_pjax.replace(CONTENT_PLACEHOLDER, page_html),
                    'utf8'
                );
            }
        } else {
            if (is_translation) return; // Skip saving files when it's a translation update
            await common.writeFile(
                getFilePath(save_path_template, language, false),
                /^\s*<html>/.test(page_html) ? `<!DOCTYPE html>\n${page_html}` : page_html,
                'utf8'
            );
        }
    });
    await Promise.all(tasks);
}

const getFilteredPages = () => {
    const section_pages =
        program.section === build_config.default_section
            ? common.pages
            : common.pages.filter(p => (p.section) === program.section);

    const path_regex = new RegExp(program.path, 'i');
    return section_pages.filter(p => path_regex.test(p.save_as));
};

(async () => {
    try {
        if (program.jsTranslations) {
            Gettext.getInstance();
            js_translation.build();
            js_translation.generate();
            return;
        }

        const pages_filtered = getFilteredPages();
        const pages_count    = pages_filtered.length;
        if (!pages_count) {
            console.error(color.red('No page matched your request.'));
            return;
        }

        const sections = Array.from(new Set(pages_filtered.map(page => page.section)));
        sections.forEach(createDirectories);

        Gettext.getInstance(); // initialize before starting the compilation

        const start   = Date.now();
        const message = common.messageStart(`${is_translation ? 'Parsing' : 'Compiling'} ${pages_count} page${pages_count > 1 ? 's' : ''}`);
        const spinner = new Spinner(`${message} ${color.cyan('%s')}`);
        spinner.setSpinnerString(18);
        spinner.start();

        if (pages_count <= 10 || program.verbose) {
            console.log(common.messageStart('Output list:', true));
            pages_filtered
                .sort((a, b) => a.save_as > b.save_as)
                .forEach((p) => {
                    console.log(color.green('  - '), p.save_as, p.section ? `(${p.section})` : '');
                });
        }

        context_builder = await createContextBuilder(sections);

        await Promise.all(
            pages_filtered.map(compile)
        );

        spinner.stop();
        process.stdout.write(`\b\b${common.messageEnd(Date.now() - start)}`);

        if (program.translations) {
            const gettext = Gettext.getInstance();
            js_translation.build();
            gettext.update_translations();
        }
    } catch (e) {
        console.error(e);
    }
})();
