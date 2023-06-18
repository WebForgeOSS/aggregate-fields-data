# aggregateFieldsData

> Aggregates data based on specified options, including aggregation types and aliases from an array of objects.

[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)

## Install

This is a standalone function and does not need to be installed through npm. Simply copy the function into your codebase and import it where needed.

## Usage

```js
const aggregateFieldsData = require('@muceres/aggregate-fields-data');

const dataset = [
  { volume: 10, price: 5 },
  { volume: 20, price: 6 },
  { volume: 30, price: 7 }
];

const options = {
  includes: ['volume'],
  excludes: ['price'],
  aggregationTypes: {
    volume: ['sum', 'average', 'min', 'max'],
    price: ['average']
  },
  alias: {
    volume: 'volume_info'
  }
};

const aggregatedData = aggregateFieldsData(dataset, options);

// aggregatedData will be:
// {
//   volume_info: { sum: 60, average: 20, min: 10, max: 30 }
// }
```

## API

### aggregateFieldsData(data, options) ⇒ `Object`

Aggregates data based on specified options, including aggregation types and aliases from an array of objects.

**Returns**: <code>Object</code> - An object with aggregated data.

| Param    | Type                | Description                                                                                                                                                     |
| -------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data     | <code>Array&lt;Object&gt;</code> | The input data array consisting of objects with numerical values.                                                                                               |
| options  | <code>Object</code>  | The options object specifying how to aggregate data.                                                                                                            |
| options.includes | <code>Array&lt;string&gt;</code> | Optional. Array of fields to include in the aggregation.                                                                                                       |
| options.excludes | <code>Array&lt;string&gt;</code> | Optional. Array of fields to exclude from the aggregation.                                                                                                     |
| options.aggregationTypes | <code>Object</code> | Optional. Object specifying the aggregation types for each field. Possible aggregation types are 'sum', 'average', 'median', 'product', 'count', 'min', 'max', 'changePercentage', 'first', and 'last'. |
| options.alias | <code>Object</code> | Optional. Object specifying output aliases for field names.                                                                                                    |

**Example**

```js
const dataset = [
  { volume: 10, price: 5 },
  { volume: 20, price: 6 },
  { volume: 30, price: 7 }
];

const options = {
  includes: ['volume'],
  aggregationTypes: {
    volume: ['sum', 'average']
  },
  alias: {
    volume: 'total_volume'
  }
};

const aggregatedData = aggregateFieldsData(dataset, options);
console.log(aggregatedData);
// Output: { total_volume: { sum: 60, average: 20 } }
```

## License

MIT © [muceres](https://forgetheweb.eu/)
