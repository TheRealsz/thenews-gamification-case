export interface Option {
    label: string;
    value: string;
}

export function createOptions(
    identifierPropertyName: string,
    labelPropertyName: string,
    collection: { [key: string]: any }[] = []
): Array<Option> {
    if (!Array.isArray(collection)) {
        return [];
    }

    return collection.map((item) => {
        return {
            label: item[labelPropertyName],
            value: item[identifierPropertyName].toString(),
        } as Option;
    });
};