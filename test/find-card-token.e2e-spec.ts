import * as request from 'supertest';
import { app, login, storeCard, storeCardWithImmediateExpiration} from './helpers';
import { generateTextWithLength, } from '../src/utils/generator.utils';

describe('CardController findBytoken (e2e)', () => {

  afterAll(async () => {
    await app.close();
  });

  
  it('cards/token (GET) find card by token without preview register', async () => {
    
    const { accessToken } = await login();
        
    await  request(app.getHttpServer())        
        .get(`/cards/token/${generateTextWithLength(16)}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect((res) => {        
            expect(res.body.message).toContain('Token no encontrado');
        });
  });

  it('cards/token (GET) find card by token correct', async () => {
    
    const { accessToken } = await login();
    const newCard = await storeCard();

    const response = await request(app.getHttpServer())        
        .get(`/cards/token/${newCard.token}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
      
      expect(response.body.token).toContain(newCard.token);
  });

  it('cards/token (GET) find card by token expired', async () => {
    
    const { accessToken } = await login();
    const newCardIE = await storeCardWithImmediateExpiration();
    
    const response = await request(app.getHttpServer())        
        .get(`/cards/token/${newCardIE.token}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
      
      expect(response.body.message).toContain('El token ha expirado tras 15 minutos de ser creados.');
  });

})