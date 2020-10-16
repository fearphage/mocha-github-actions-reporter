const core = require('@actions/core');
const { issueCommand } = require('@actions/core/lib/command');
const mocha = require('mocha');

const { extractModuleLineAndColumn } = require('./parse-stack-trace');

function GithubActionsReporter(runner, options) {
    mocha.reporters.Spec.call(this, runner, options);

    const failures = [];

    runner.on(mocha.Runner.constants.EVENT_TEST_FAIL, function(test) {
        failures.push(test);
    });

    runner.once(mocha.Runner.constants.EVENT_RUN_END, function() {
        if (failures.length > 0) {
            core.startGroup('Mocha Annotations');

            for (const test of failures) {
                const moduleLineColumn = extractModuleLineAndColumn(test.err.stack);

                issueCommand('error', {
                    file: moduleLineColumn.file,
                    line: String(moduleLineColumn.line),
                    col: String(moduleLineColumn.column)
                }, test.err.message);
            }

            core.endGroup();
        }
    });
}

/**
 * Inherit from `Spec.prototype`.
 */
mocha.utils.inherits(GithubActionsReporter, mocha.reporters.Spec);

module.exports = GithubActionsReporter;
