const Validator = require("fastest-validator");

/**
 * Validates the options object for aggregateFieldData function.
 * @param {Object} options - The options object to validate.
 * @throws {Error} If validation fails.
 */
const validateOptions = (options) => {
  const v = new Validator();

  const schema = {
    includes: { type: "array", items: "string", optional: true },
    excludes: { type: "array", items: "string", optional: true },
    aggregationTypes: {
      type: "object",
      optional: true,
    },
    alias: {
      type: "object",
      optional: true,
    },
  };

  const validationResponse = v.validate(options, schema);

  if (Array.isArray(validationResponse)) {
    throw new Error(`Validation error: ${JSON.stringify(validationResponse)}`);
  }
};

/**
 * Calculate aggregate data of a specific field from an array of objects.
 *
 * @param {Array<Object>} data - The array of objects containing the data to be aggregated.
 * @param {string} field - The field name for which the aggregation should be performed.
 * @param {'sum' | 'average' | 'median' | 'product' | 'count' | 'min' | 'max' | 'changePercentage' | 'first' | 'last'} type - The type of aggregation to perform.
 *
 * @returns {number} The aggregated result based on the type specified.
 *
 * @throws {Error} Throws an error if an unsupported aggregation type is provided.
 *
 * @example
 *   const data = [
 *     { volume: 10, price: 5 },
 *     { volume: 20, price: 6 },
 *     { volume: 30, price: 7 }
 *   ];
 *   const aggregatedSum = calculateAggregate(data, 'volume', 'sum');
 *   console.log(aggregatedSum); // Output: 60
 */
const calculateAggregate = (data, field, type) => {
  let sum = 0;
  let product = 1;
  let count = 0;
  let min = Infinity;
  let max = -Infinity;
  let values = [];
  let firstValue;
  let lastValue;

  for (const item of data) {
    const value = item[field];

    if (typeof value === "number") {
      if (count === 0) {
        firstValue = value;
      }
      sum += value;
      product *= value;
      count++;
      min = Math.min(min, value);
      max = Math.max(max, value);
      lastValue = value;
    }

    values.push(value);
  }

  values.sort((a, b) => a - b);
  const mid = Math.floor(values.length / 2);
  const median =
    values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
  const average = sum / count;
  const averageWithoutFirstValue = (sum - firstValue) / (count - 1);
  const change = averageWithoutFirstValue - firstValue;
  const changePercentage = firstValue !== 0 ? (change / firstValue) * 100 : 0;

  switch (type) {
    case "sum":
      return sum;
    case "average":
      return average;
    case "median":
      return median;
    case "product":
      return product;
    case "count":
      return count;
    case "min":
      return min;
    case "max":
      return max;
    case "changePercentage":
      return changePercentage;
    case "first":
      return firstValue;
    case "last":
      return lastValue;
    default:
      throw new Error(`Unsupported aggregation type: ${type}`);
  }
};

/**
 * Determines if a field should be included based on the 'includes' and 'excludes' options.
 * @param {string} field - The name of the field to check.
 * @param {Object} options - The options object containing 'includes' and 'excludes' arrays.
 * @returns {boolean} true if the field should be included, false otherwise.
 */
const shouldIncludeField = (field, options) => {
  const { includes, excludes } = options;

  if (includes && includes.length > 0) {
    return includes.includes(field);
  }

  if (excludes && excludes.length > 0) {
    return !excludes.includes(field);
  }

  return true;
};

/**
 * Aggregates data based on specified options, including aggregation types and aliases.
 * @param {Object[]} data - The input data array consisting of objects with numerical values.
 * @param {Object} options - The options object specifying how to aggregate data.
 * @param {string[]} [options.includes] - Array of fields to include.
 * @param {string[]} [options.excludes] - Array of fields to exclude.
 * @param {Object} [options.aggregationTypes] - Object specifying aggregation types for each field.
 * @param {Object} [options.alias] - Object specifying output aliases for field names.
 * @returns {Object} An object with aggregated data.
 * @throws {Error} If there is a conflict between 'includes' and 'excludes', or if validation fails.
 */
const aggregateFieldsData = (data, options) => {
  // Validate the options
  validateOptions(options);

  // Check for conflicting fields in includes and excludes
  const conflictingFields = [];
  if (options.includes && options.excludes) {
    for (const field of options.includes) {
      if (options.excludes.includes(field)) {
        conflictingFields.push(field);
      }
    }
  }
  if (conflictingFields.length > 0) {
    throw new Error(
      `Conflicting fields in includes and excludes: ${conflictingFields.join(
        ", "
      )}`
    );
  }

  // Initialize the result object
  const result = {};

  // Go through each object in the data array
  for (const obj of data) {
    for (const field in obj) {
      // If the field should be included in the aggregation
      if (shouldIncludeField(field, options)) {
        // Determine the aggregation types for this field
        const aggregationTypes =
          options.aggregationTypes && options.aggregationTypes[field]
            ? options.aggregationTypes[field]
            : ["sum"];

        // For each aggregation type, calculate the aggregate data
        for (const type of aggregationTypes) {
          const aggregateValue = calculateAggregate(data, field, type);

          // Get the alias for the field, if specified
          const outputField =
            options.alias && options.alias[field]
              ? options.alias[field]
              : field;

          // Add the aggregated data to the result object
          if (!result[outputField]) {
            result[outputField] = {};
          }
          result[outputField][type] = aggregateValue;
        }
      }
    }
  }

  return result;
};

module.exports = aggregateFieldsData;
