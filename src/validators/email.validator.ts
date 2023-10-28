import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
  } from 'class-validator';
  
  function isValidEmail(value: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      return false;
    }
  
    const validDomains = ['gmail.com', 'hotmail.com', 'yahoo.es'];
  
    const [, domain] = value.split('@');
  
    return validDomains.includes(domain);
  }

  export function IsEmailInDomain(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isEmailInDomain',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            if (typeof value !== 'string') {
              return false;
            }
            return isValidEmail(value);
          },
        },
      });
    };
  }