// const { expect: chaiExpect } = require("chai");

const isNestedData = (expected, value) => {
  return (
    expected && value && typeof expected == `object` && typeof value == `object`
  );
};

const checkDataState = (expected, value) => {
  let result;

  if (expected === value) {
    result = `| ✅ "${value}",`;
  } else if (expected == undefined) {
    result = `| ➖ "➖╺ ${expected}|${value}",`;
  } else if (value == undefined) {
    result = `| ➕ "➕┿ ${expected}|${value}",`;
  } else {
    result = `| ⭕ "⭕╳ ${expected}|${value}",`;
  }

  return result;
};


/**
 * 
 * @param {string} text 
 * @returns {string}
 */

function parseTextToJSON(text) {
  const lines = 
  text
  .replace(/\| [✅➖➕⭕]/g, "").trim()
  .replace(/(.*?),\s*(\}|])/g, "$1$2");
  return lines;
  // return JSON.stringify(lines, null, 2);
}

function containsDiffChars(str) {
  const emojis = ["╺", "┿", "╳"];
  return emojis.some(emoji => str.includes(emoji));
}

const compare = (expected, value) => {
  let compareResult = "";

  if (isNestedData(expected, value)) {
    if (Array.isArray(expected)) {
      compareResult += `[`;
      let dataX, dataY;

      if (expected.length >= value.length) {
        dataX = expected;
        dataY = value;
      } else {
        dataX = value;
        dataY = expected;
      }

      dataX.forEach(function (item, index) {
        const resultset = compare(item, dataY[index]);
        compareResult += resultset.result;
      });
      compareResult += `],`;
    } else {
      let dataX, dataY;
      compareResult += `{`;
      if (Object.keys(expected).length >= Object.keys(value).length) {
        dataX = expected;
        dataY = value;
      } else {
        dataX = value;
        dataY = expected;
      }

      Object.keys(dataX).forEach((key) => {
        const resultset = compare(dataX[key], dataY[key]);
        compareResult += `"${key}": ${resultset.result}`;
      });
      compareResult += `}`;
    }
  } else {
    compareResult = checkDataState(expected, value);
  }
  let result = parseTextToJSON(compareResult);
  // let result = compareResult;

  try {
    return {
      success: !containsDiffChars(result),
      result,
    };
  } catch (error) {
    return { success: false, result };
  }
};

/**
 *
 * @param {{
 * expected: { [k:string]: any},
 * value: {[k:string]:any}
 * }} values
 */

module.exports = function compareValues(values) {
  return compare(values.expected, values.value);
};
