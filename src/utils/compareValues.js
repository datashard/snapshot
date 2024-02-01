
const containsDiffChars = str => ["╺", "┿", "╳"].some(emoji => str.includes(emoji));
const isNestedData = (expected, value) => expected && value && typeof expected == 'object' && typeof value == 'object';


const checkDataState = (expected, value) => {
  let result;
  if (expected === value) {
    result = `| ✅ "${value}",`;
  } else {
    result = `| ⭕ "⭕╳ ${JSON.stringify(expected)?.replaceAll('"', "'")} | ${value?.replaceAll('"', "'")}",`;
  }

  return result;
};

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
      compareResult += `},`;
    }
  } else {
    compareResult = checkDataState(expected, value);
  }

  try {
    return {
      success: !containsDiffChars(compareResult),
      result: compareResult,
    };
  } catch (error) {
    return { success: false, result: compareResult };
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
