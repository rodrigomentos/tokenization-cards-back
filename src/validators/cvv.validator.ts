import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
  
  @ValidatorConstraint({ async: false })
  export class IsCVVValidConstraint implements ValidatorConstraintInterface {
    validate(_value: any, args: ValidationArguments) {

      const { object } = args;
      const cardNumber: string = object['cardNumber'];
      const cvv: number = object['cvv'];
        
      const cvvLength = (/^3[47]/.test(cardNumber)) ? 4 : 3;
      
      return (
        cvv && cvv.toString().length === cvvLength
      );
    }
  }
  
  export function IsCVVValid(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isCVVValid',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsCVVValidConstraint,
      });
    };
  }


