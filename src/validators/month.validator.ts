import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';


function isMonthValid(value: number): boolean {
    return value >= 1 && value <= 12;
}

export function IsMonthValid(validationOptions?: ValidationOptions) {
return function (object: Object, propertyName: string) {
    registerDecorator({
    name: 'isMonthValid',
    target: object.constructor,
    propertyName: propertyName,
    options: validationOptions,
    validator: {
        validate(value: any, args: ValidationArguments) {
        const newValue: number = parseInt(value)
        if (typeof newValue !== 'number' ) {
            return false;
        }
        return isMonthValid(newValue);
        },
    },
    });
};
}