// From https://github.com/findmypast-oss/mocha-json-streamier-reporter/blob/master/lib/parse-stack-trace.js

function extractModuleLineAndColumn(stackTrace) {
    const matches = /^\s*at Context\..+ \(([^\(\)]+):(\d+):(\d+)\)/gm.match(stackTrace)
        // try to find an alternative format
        || /^\s*at (.+):(\d+):(\d+)$/gm.match(stackTrace)
    ;

    if (matches === null) {
        return {};
    }

    return {
        file: matches[1],
        line: parseIntOrUndefined(matches[2]),
        column: parseIntOrUndefined(matches[3])
    };
}

function parseIntOrUndefined(numberString) {
    const lineNumber = parseInt(numberString);

    if (isNaN(lineNumber)) {
        return undefined;
    }

    return lineNumber;
}

module.exports = { extractModuleLineAndColumn };
