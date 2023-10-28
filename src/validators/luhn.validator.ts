import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
  
  @ValidatorConstraint({ async: false })
  export class IsLuhnValidConstraint implements ValidatorConstraintInterface {
    validate(value: any, _args: ValidationArguments) {
      
      if(!value) return false
      
      const cardNumber = value.replace(/\D/g, '').split('').reverse();
      let sum = 0;
  
      for (let i = 0; i < cardNumber.length; i++) {
        let num = parseInt(cardNumber[i], 10);
  
        if (i % 2 !== 0) {
          num *= 2;
          if (num > 9) {
            num -= 9;
          }
        }
  
        sum += num;
      }
  
      return sum % 10 === 0;
    }
  }
  
  export function IsLuhnValid(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isLuhnValid',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsLuhnValidConstraint,
      });
    };
  }