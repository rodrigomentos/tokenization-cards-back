import * as request from 'supertest';
import { app , login, usernameLogin, passwordLogin } from './helpers';
import { generateTextWithLength } from '../src/utils/generator.utils';
describe('AuthController (e2e)', () => {
  
  afterAll(async () => {
    await app.close();
  });


  it('/login (POST) without content', async () => {
    return  request(app.getHttpServer()).post('/auth/login')
          .send({})
          .expect(400)
          .expect('Content-Type',/application\/json/)
          .expect((res) => {
            expect(res.body.message).toContain('Debe ingresar un usuario')
            expect(res.body.message).toContain('Debe ingresar un usuario')
          });
  });
  

  it('/login (POST) with only username', async () => {
      return  request(app.getHttpServer()).post('/auth/login')
            .send({ username: usernameLogin })
            .expect(400)
            .expect('Content-Type',/application\/json/)
            .expect((res) => {
              expect(res.body.message).toContain('Debe ingresar una contraseña')
            });
  });

  it('/login (POST) with only password', async () => {
      return  request(app.getHttpServer()).post('/auth/login')
            .send({ password: passwordLogin })
            .expect(400)
            .expect('Content-Type',/application\/json/)
            .expect((res) => {
              expect(res.body.message).toContain('Debe ingresar un usuario')
            });
  });

  it('/login (POST) with password less than 6 characters ', async () => {
      return  request(app.getHttpServer()).post('/auth/login')
            .send({ username: usernameLogin, password: passwordLogin.slice(0,5)})
            .expect(400)
            .expect('Content-Type',/application\/json/)
            .expect((res) => {
              expect(res.body.message).toContain('La contraseña debe tener al menos 6 digitos')
            });
  });

  it('/login (POST) with user more than 20 characters', async () => {
    return  request(app.getHttpServer()).post('/auth/login')
          .send({ username: generateTextWithLength(21), password: passwordLogin})
          .expect(400)
          .expect('Content-Type',/application\/json/)
          .expect((res) => {
            expect(res.body.message).toContain('El usuario debe tener menos de 20 caracteres o menos')
          });
  });

  it('/login (POST) with password more than 100 characters', async () => {
    return  request(app.getHttpServer()).post('/auth/login')
          .send({ username: usernameLogin, password: generateTextWithLength(101)})
          .expect(400)
          .expect('Content-Type',/application\/json/)
          .expect((res) => {
            expect(res.body.message).toContain('La contraseña debe tener menos de 100 caracteres o menos')
          });
  });

  it('auth/login (POST) with content correct', async () => {
    return request(app.getHttpServer()).post('/auth/login')
        .send({ username: usernameLogin, password: passwordLogin })
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect((res) => {   
          expect(res.body.userName).toBe(usernameLogin);
        });
  });

  it('auth/refresh_token (GET) with refreshToken incorrect', async () => {
    
    return request(app.getHttpServer())        
        .get('/auth/refresh_token')
        .set('Authorization', `Bearer ${generateTextWithLength(100)}`)
        .expect(401)
        .expect('Content-Type', /application\/json/)
        .expect((res) => {
          expect(res.body.message).toBe('Unauthorized');
        });
  });

  it('auth/refresh_token (GET) with refreshToken correct', async () => {
    
    const { refreshToken } = await login()
    
    return request(app.getHttpServer())        
        .get('/auth/refresh_token')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect((res) => {
          expect(res.body.userName).toBe(usernameLogin);
        });
  });

  it('auth/logout (GET) with accessToken incorrect', async () => {
    
    return request(app.getHttpServer())        
        .get('/auth/logout')
        .set('Authorization', `Bearer ${generateTextWithLength(100)}`)
        .expect(401)
        .expect('Content-Type', /application\/json/)
        .expect((res) => {
          expect(res.body.message).toBe('Unauthorized');
        });
  });

  it('auth/logout (GET) with accessToken correct', async () => {
    
    const { accessToken } = await login()
        
    return request(app.getHttpServer())        
        .get('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
  });
  
  
});
