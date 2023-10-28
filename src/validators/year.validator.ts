import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';
  
function isYearWithinRange(value: number): boolean {
    const currentYear = new Date().getFullYear();
    return value >= currentYear && value <= currentYear + 5;
}
  
export function IsYearWithinRange(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
        name: 'isYearWithinRange',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
            validate(value: any, args: ValidationArguments) {
                const newValue: number = parseInt(value)
                if (typeof newValue !== 'number') {
                    return false;
                }
                return isYearWithinRange(newValue);
            },
        },
        });
    };
}