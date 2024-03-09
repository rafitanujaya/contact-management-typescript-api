import supertest from "supertest"
import { web } from '../src/application/web'
import { UserTestUtils } from "./utils/user"
import bcrypt from 'bcrypt'

describe('Users Api', () => {
    describe('POST /api/users/register', () => {
    
        afterEach(async () => {
            await UserTestUtils.remove();
        })
      it('should reject if request data invalid' , async () => {
        const result = await supertest(web).post('/api/users/register').send({
            username: '',
            password: '',
            name: ''
        })
    
        console.log(result.body.errors);
        expect(result.status).toBe(400)
      }) 
    
      it('should create users', async () => {
        const result = await supertest(web).post('/api/users/register').send({
            username: 'test',
            password: 'test',
            name: 'test'
        })
    
        expect(result.status).toBe(201);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('test');
      });
    
      it('should reject create users if user already exist', async () => {
        await supertest(web).post('/api/users/register').send({
            username: 'test',
            password: 'test',
            name: 'test'
        })
        const result = await supertest(web).post('/api/users/register').send({
            username: 'test',
            password: 'test',
            name: 'test'
        })
    
        expect(result.status).toBe(400);
        expect(result.body.errors).toBe('User Already Exist');
      });
    
      
    })

    describe('POST /api/users/login', () => {
        beforeEach(async () => {
            await UserTestUtils.create()
        })

        afterEach(async () => {
            await UserTestUtils.remove();
        })

      it('should reject if request invalid', async () => {
        const result = await supertest(web).post('/api/users/login').send({
            username: '',
            password: ''
        })

        console.log(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined()
      });

      it('should be able login', async () => {
        const result = await supertest(web).post('/api/users/login').send({
            username: 'test',
            password: 'test'
        })

        console.log(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('test');
        expect(result.body.data.token).toBeDefined()
      });

      it('should reject if username wrong', async () => {
        const result = await supertest(web).post('/api/users/login').send({
            username: 'salah',
            password: 'test'
        })

        console.log(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBe('username or password is wrong');
      });

      it('should reject if password wrong', async () => {
        const result = await supertest(web).post('/api/users/login').send({
            username: 'test',
            password: 'salah'
        })

        console.log(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBe('username or password is wrong');
      });
    })
    
    describe('GET /api/users/current', () => {
        beforeEach(async () => {
            await UserTestUtils.create()
        })

        afterEach(async () => {
            await UserTestUtils.remove();
        })

        it('should be able get current user', async () => {
            const result = await supertest(web).get('/api/users/current')
                .set('X-API-TOKEN', 'test');

            console.log(result.body);

            expect(result.status).toBe(200);
            expect(result.body.data.username).toBe('test');
            expect(result.body.data.name).toBe('test');
        });

        it('should reject if token invalid', async () => {
            const result = await supertest(web).get('/api/users/current')
                .set('X-API-TOKEN', 'salah');

            console.log(result.body);

            expect(result.status).toBe(401);
            expect(result.body.errors).toBe('Unauthorized');
        });
    })

    describe('PATCH /api/users/current', () => {
        beforeEach(async () => {
            await UserTestUtils.create()
        })

        afterEach(async () => {
            await UserTestUtils.remove();
        })


        it('should reject invalid request', async () => {
            const result = await supertest(web).patch('/api/users/current')
                .set('X-API-TOKEN', 'test')
                .send({
                    name: "",
                    password: ""
                })

            console.log(result.body);

            expect(result.status).toBe(400);
            expect(result.body.errors).toBeDefined()
        });

        it('should be able update name', async () => {
            const result = await supertest(web).patch('/api/users/current')
                .set('X-API-TOKEN', 'test')
                .send({
                    name: "rafi",
                })

            console.log(result.body);

            expect(result.status).toBe(200);
            expect(result.body.data.name).toBe('rafi')
        });

        it('should be able update password', async () => {
            const result = await supertest(web).patch('/api/users/current')
                .set('X-API-TOKEN', 'test')
                .send({
                    password: "isha",
                })

            console.log(result.body);

            expect(result.status).toBe(200);
            
            const user = await UserTestUtils.get()
            expect(await bcrypt.compare('isha', user.password)).toBeTruthy()
        });

    })

    describe('DELETE /api/users/current', () => {
        beforeEach(async () => {
            await UserTestUtils.create()
        })

        afterEach(async () => {
            await UserTestUtils.remove();
        })

        it('should reject if token invalid', async () => {
            const result = await supertest(web).delete('/api/users/current')
                .set('X-API-TOKEN', 'salah')

            console.log(result.body);

            expect(result.status).toBe(401);
            expect(result.body.errors).toBeDefined()
        });

        it('should reject if token invalid', async () => {
            const result = await supertest(web).delete('/api/users/current')
                .set('X-API-TOKEN', 'test')

            console.log(result.body);

            expect(result.status).toBe(200);
            expect(result.body.data).toBe('Ok')
        });
    })
    
    
    
})

