import * as request from 'supertest';
import { app, pk_commercial, newCard } from './helpers';
import { generateTextWithLength, } from '../src/utils/generator.utils';

describe('CardController create (e2e)', () => {

  afterAll(async () => {
    await app.close();
  });

  
  it('cards (POST) create card without header authorization', async () => {
        
    return request(app.getHttpServer())        
        .post(`/cards`)
        .send({})        
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('El identificador es requerido.');
        });
  });

  it('cards (POST) create card with token empty', async () => {
        
    return request(app.getHttpServer())        
        .post(`/cards`)
        .send({})
        .set('Authorization', `Bearer `)
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Identificador es invalido.');
        });
  });

  it('cards (POST) create card with token without frefix pk_test_', async () => {
        
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${generateTextWithLength(24)}`)
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Identificador es invalido.');
        });
  });

  it('cards (POST) create card with token with frefix pk_test_ postion end', async () => {
        
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${generateTextWithLength(16)}pk_test_`)
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Identificador es invalido.');
        });
  });

  it('cards (POST) create card with token less than 24 characters', async () => {
        
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer pk_test_${generateTextWithLength(15)}`)
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Identificador es invalido.');
        });
  });


  it('cards (POST) create card with  token with symbols and alphanumeric', async () => {
        
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer pk_test_${generateTextWithLength(12)}!@#!`)
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Identificador es invalido.');
        });
  });

  // ----------------------------------------------------------------

  it('cards (POST) create card with  token correct but content empty', async () => {
        
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send({})
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {
          expect(res.body.error).toBe('Bad Request');
        });
  });

  

  it('cards (POST) create card  with number card empty', async () => {
    
    const newCardWithOutNumberCard = (({ card_number, ...o }) => o)(newCard) 
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithOutNumberCard)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('El número de tarjeta no debe estar vacío');
        });
  });

  it('cards (POST) create card  with number card incorrect', async () => {
    
    const newCardWithNumberCardIncorrect = { ...newCard, card_number: generateTextWithLength(16)}
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithNumberCardIncorrect)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('Número de tarjeta no válido. Por favor verifique el número de tarjeta');
        });
  });
  
  // ----------------------------------------------------------------

  it('cards (POST) create card  with cvv empty', async () => {
    
    const newCardWithOutCVV = (({ cvv, ...o }) => o)(newCard) 
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithOutCVV)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('El cvv de la tarjeta no debe estar vacío');
        });
  });

  it('cards (POST) create card  with cvv is not number', async () => {
    
    const newCardWithCVVIncorrect = { ...newCard, cvv: '123'}
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithCVVIncorrect)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('El cvv de la tarjeta es numerico');
        });
  });

  it('cards (POST) create card  with cvv is alphanumeric', async () => {
    
    const newCardWithCVVIncorrect = { ...newCard, cvv: 'a1b'}
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithCVVIncorrect)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('El cvv de la tarjeta es numerico');
        });
  });

  it('cards (POST) create card  with cvv more then 3 character when number card is different a type Amex', async () => {
    
    const newCardWithCVVIncorrectLength = { ...newCard, cvv: 4532}
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithCVVIncorrectLength)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('CVV no válido. Por favor verifique el número CVV');
        });
  });

  // ----------------------------------------------------------------

  it('cards (POST) create card  with expiration_month empty', async () => {
    
    const newCardWithOutMonth = (({ expiration_month, ...o }) => o)(newCard) 
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithOutMonth)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {    
          expect(res.body.message).toContain('El mes no debe estar vacío');
        });
  });

  it('cards (POST) create card  with month type number', async () => {
    
    const newCardWithMonthTypeNumber = { ...newCard, expiration_month: 12}
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithMonthTypeNumber)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('El mes no es numerico');
        });
  });

  it('cards (POST) create card  with month other range of year', async () => {
    
    const newCardWithMonthIncorrect = { ...newCard, expiration_month: '13'}
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithMonthIncorrect)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('El mes debe ser un número válido entre 1 y 12');
        });
  });

  // ----------------------------------------------------------------

  it('cards (POST) create card  with expiration_year empty', async () => {
    
    const newCardWithOutYear = (({ expiration_year, ...o }) => o)(newCard) 
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithOutYear)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('El año no debe estar vacío');
        });
  });

  it('cards (POST) create card  with year type number', async () => {
    
    const newCardWithYearTypeNumber = { ...newCard, expiration_year: 2023}
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithYearTypeNumber)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('El año no es numerico');
        });
  });

  it('cards (POST) create card  with year less than 4 characters', async () => {
    
    const newCardWithYearOldIncorrect = { ...newCard, expiration_year: '23'}
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithYearOldIncorrect)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('El año debe tener 4 caracteres');
        });
  });

  it('cards (POST) create card  with year more than 4 characters', async () => {
    
    const newCardWithYearOldIncorrect = { ...newCard, expiration_year: '20230'}
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithYearOldIncorrect)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('El año debe tener 4 caracteres');
        });
  });

  it('cards (POST) create card  with year before the current year ', async () => {
    
    const newCardWithYearOldIncorrect = { ...newCard, expiration_year: '2022'}
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithYearOldIncorrect)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('El año debe ser el año actual o dentro de los próximos 5 años');
        });
  });

  it('cards (POST) create card  with year more than 5 years from the current year', async () => {
    const currentYear = new Date().getFullYear() + 6;
    const newCardWithYearOldIncorrect = { ...newCard, expiration_year: currentYear}
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithYearOldIncorrect)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('El año debe ser el año actual o dentro de los próximos 5 años');
        });
  });

 

  // ----------------------------------------------------------------

  it('cards (POST) create card with email empty', async () => {
    
    const newCardWithOutYear = (({ email, ...o }) => o)(newCard) 
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithOutYear)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('El correo electrónico no debe estar vacío');
        });
  });

  it('cards (POST) create card  with email incorrect format', async () => {
    
    const newCardWithYearTypeNumber = { ...newCard, email: newCard.email.replace(/@/g, '')}
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithYearTypeNumber)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('El correo electrónico inválido');
        });
  });

  it('cards (POST) create card  with email less than 5 characters', async () => {
    
    const newCardWithYearOldIncorrect = { ...newCard, email:  newCard.email.slice(0, 4)}
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithYearOldIncorrect)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('El correo electrónico debe tener al menos 5 caracteres');
        });
  });

  it('cards (POST) create card  with email more than 100 characters', async () => {
    
    const newCardWithYearOldIncorrect = { ...newCard, email: generateTextWithLength(101)+'@gmail.com' }
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithYearOldIncorrect)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('El correo electrónico debe tener menos de 100 caracteres o menos');
        });
  });

  it('cards (POST) create card  with email different domain than gmail.com, hotmail.com and yahoo.es ', async () => {
    
    const newCardWithYearOldIncorrect = { ...newCard, email: '2022'}
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCardWithYearOldIncorrect)
        .expect(400)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {        
          expect(res.body.message).toContain('El correo electrónico inválido. Sólo se permiten gmail.com, hotmail.com y yahoo.es');
        });
  });
  

  it('cards (POST) create card  correct data', async () => {
    return request(app.getHttpServer())        
        .post(`/cards`)
        .set('Authorization', `Bearer ${pk_commercial}`)
        .send(newCard)
        .expect(200)
        .expect('Content-Type',/application\/json/)
        .expect((res) => {     
          expect(res.body).toMatchObject({
            token: expect.any(String)
          });
        });
  });
  
});
