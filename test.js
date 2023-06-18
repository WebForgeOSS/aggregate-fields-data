const aggregateFieldsData = require(".");

describe('aggregateFieldsData', () => {

    test('should throw an error if conflicting fields are specified in includes and excludes', () => {
        const data = [
            { volume: 10, price: 5 },
            { volume: 20, price: 6 },
        ];

        const options = {
            includes: ['volume'],
            excludes: ['volume'],
            aggregationTypes: {
                volume: ['sum']
            }
        };

        expect(() => {
            aggregateFieldsData(data, options);
        }).toThrow('Conflicting fields in includes and excludes');
    });

    test('should return an object with sum aggregates when no aggregationTypes are specified', () => {
        const data = [
            { volume: 10, price: 5 },
            { volume: 20, price: 6 },
        ];

        const options = {
            includes: ['volume', 'price']
        };

        const result = aggregateFieldsData(data, options);

        expect(result).toEqual({
            volume: { sum: 30 },
            price: { sum: 11 }
        });
    });

    test('should aggregate multiple fields and return an object with the correct structure', () => {
        const data = [
            { volume: 10, price: 5 },
            { volume: 20, price: 6 },
        ];

        const options = {
            includes: ['volume', 'price'],
            aggregationTypes: {
                volume: ['sum', 'average'],
                price: ['average']
            }
        };

        const result = aggregateFieldsData(data, options);

        expect(result).toEqual({
            volume: { sum: 30, average: 15 },
            price: { average: 5.5 }
        });
    });

    test('should return an object with first and last aggregates for specified fields', () => {
        const data = [
            { volume: 10, price: 5 },
            { volume: 20, price: 6 },
            { volume: 15, price: 7 },
        ];

        const options = {
            includes: ['volume', 'price'],
            aggregationTypes: {
                volume: ['first', 'last'],
                price: ['first', 'last']
            }
        };

        const result = aggregateFieldsData(data, options);

        expect(result).toEqual({
            volume: { first: 10, last: 15 },
            price: { first: 5, last: 7 }
        });
    });

    test('should handle empty data array gracefully', () => {
        const data = [];

        const options = {
            includes: ['volume', 'price'],
            aggregationTypes: {
                volume: ['sum', 'average'],
                price: ['average']
            }
        };

        const result = aggregateFieldsData(data, options);

        expect(result).toEqual({});
    });

    test('should handle data array with single object', () => {
        const data = [
            { volume: 10, price: 5 }
        ];

        const options = {
            includes: ['volume', 'price'],
            aggregationTypes: {
                volume: ['sum', 'average'],
                price: ['average']
            }
        };

        const result = aggregateFieldsData(data, options);

        expect(result).toEqual({
            volume: { sum: 10, average: 10 },
            price: { average: 5 }
        });
    });

    test('should use aliases for field names if provided', () => {
        const data = [
            { volume: 10, price: 5 },
            { volume: 20, price: 6 },
        ];

        const options = {
            includes: ['volume', 'price'],
            aggregationTypes: {
                volume: ['sum'],
                price: ['average']
            },
            alias: {
                volume: 'totalVolume',
                price: 'averagePrice'
            }
        };

        const result = aggregateFieldsData(data, options);

        expect(result).toEqual({
            totalVolume: { sum: 30 },
            averagePrice: { average: 5.5 }
        });
    });

    test('should calculate the percentage change of the average value compared to the first value', () => {
        const data = [
            { volume: 10, price: 5 },
            { volume: 20, price: 6 },
            { volume: 15, price: 7 },
        ];

        const options = {
            includes: ['volume', 'price'],
            aggregationTypes: {
                volume: ['changePercentage'],
                price: ['changePercentage']
            }
        };

        const result = aggregateFieldsData(data, options);

        expect(result).toEqual({
            volume: { changePercentage: 75 },
            price: { changePercentage: 30 }
        });
    });


    test('should throw an error when includes and excludes contradict each other', () => {
        const data = [
            { volume: 10, price: 5 },
            { volume: 20, price: 6 },
        ];

        const options = {
            includes: ['volume'],
            excludes: ['volume'],
            aggregationTypes: {
                volume: ['sum']
            }
        };

        expect(() => aggregateFieldsData(data, options)).toThrow('Conflicting fields in includes and excludes: volume');
    });

    test('should exclude fields specified in the excludes option', () => {
        const data = [
            { volume: 10, price: 5 },
            { volume: 20, price: 6 },
        ];

        const options = {
            excludes: ['volume'],
            aggregationTypes: {
                price: ['sum']
            }
        };

        const result = aggregateFieldsData(data, options);

        expect(result).toEqual({
            price: { sum: 11 }
        });
    });

    test('should only include fields specified in the includes option', () => {
        const data = [
            { volume: 10, price: 5 },
            { volume: 20, price: 6 },
        ];

        const options = {
            includes: ['price'],
            aggregationTypes: {
                price: ['sum']
            }
        };

        const result = aggregateFieldsData(data, options);

        expect(result).toEqual({
            price: { sum: 11 }
        });
    });

    test('should calculate the minimum and maximum values of fields', () => {
        const data = [
            { volume: 10, price: 5 },
            { volume: 20, price: 6 },
            { volume: 15, price: 4 },
        ];

        const options = {
            includes: ['volume', 'price'],
            aggregationTypes: {
                volume: ['min', 'max'],
                price: ['min', 'max']
            }
        };

        const result = aggregateFieldsData(data, options);

        expect(result).toEqual({
            volume: { min: 10, max: 20 },
            price: { min: 4, max: 6 }
        });
    });

    test('should calculate the product of fields', () => {
        const data = [
            { volume: 10, price: 5 },
            { volume: 2, price: 2 },
        ];

        const options = {
            includes: ['volume', 'price'],
            aggregationTypes: {
                volume: ['product'],
                price: ['product']
            }
        };

        const result = aggregateFieldsData(data, options);

        expect(result).toEqual({
            volume: { product: 20 },
            price: { product: 10 }
        });
    });

    test('should calculate the count of fields', () => {
        const data = [
            { volume: 10, price: 5 },
            { volume: 20, price: 6 },
            { volume: 15, price: 4 },
        ];

        const options = {
            includes: ['volume', 'price'],
            aggregationTypes: {
                volume: ['count'],
                price: ['count']
            }
        };

        const result = aggregateFieldsData(data, options);

        expect(result).toEqual({
            volume: { count: 3 },
            price: { count: 3 }
        });
    });

});




