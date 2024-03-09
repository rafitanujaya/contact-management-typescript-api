import { UserTestUtils } from "./utils/user"
import { web } from "../src/application/web"
import { ContactTestUtils } from "./utils/contact"
import supertest from "supertest"

describe('Contacts Api', () => {
  describe('POST /api/contacts', () => {
    beforeEach(async () => {
        await UserTestUtils.create()
    })

    afterEach(async () => {
        await ContactTestUtils.deleteAll()
        await UserTestUtils.remove();
    })

    it('should create contact ', async () => {
        const result = await supertest(web).post('/api/contacts')
            .set('X-API-TOKEN', 'test')
            .send({
                first_name: 'rafi',
                last_name: 'tanujaya',
                email: 'rafi@gmail.com',
                phone: '000021'
            })

        console.log(result);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.first_name).toBe('rafi');
        expect(result.body.data.last_name).toBe('tanujaya');
        expect(result.body.data.email).toBe('rafi@gmail.com');
        expect(result.body.data.phone).toBe('000021');

    });

    it('should reject if request invalid', async () => {
        const result = await supertest(web).post('/api/contacts')
            .set('X-API-TOKEN', 'test')
            .send({
                first_name: '',
                last_name: '',
                email: 'rafi',
                phone: '0000210123901203901'
            })

        console.log(result);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();

    })

    it('should reject if token invalid', async () => {
        const result = await supertest(web).post('/api/contacts')
            .set('X-API-TOKEN', 'salah')
            .send({
                first_name: '',
                last_name: '',
                email: 'rafi',
                phone: '0000210123901203901'
            })

        console.log(result);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();

    })
  })

  describe('GET /api/contacts', () => {
    beforeEach(async () => {
        await UserTestUtils.create()
        await ContactTestUtils.create()
    })

    afterEach(async () => {
        await ContactTestUtils.deleteAll()
        await UserTestUtils.remove();
    })

    it('should get contact by Id contact', async () => {
        const contactTest = await ContactTestUtils.get()
        const result = await supertest(web).get(`/api/contacts/${contactTest.id}`)
            .set('X-API-TOKEN', 'test')

        console.log(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(contactTest.id);
        expect(result.body.data.first_name).toBe(contactTest.first_name)
        expect(result.body.data.last_name).toBe(contactTest.last_name)
        expect(result.body.data.email).toBe(contactTest.email)
        expect(result.body.data.phone).toBe(contactTest.phone)
    });

    it('should reject if contactId invalid', async () => {
        const contactTest = await ContactTestUtils.get()
        const result = await supertest(web).get(`/api/contacts/${contactTest.id + 1 }`)
            .set('X-API-TOKEN', 'test')

        console.log(result.body);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });

  })

  describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await UserTestUtils.create()
        await ContactTestUtils.create()
    })

    afterEach(async () => {
        await ContactTestUtils.deleteAll()
        await UserTestUtils.remove();
    })

    it('should update contact', async () => {
        const contactTest = await ContactTestUtils.get()
        const result = await supertest(web).put(`/api/contacts/${contactTest.id}`)
            .set('X-API-TOKEN', 'test')
            .send({
                first_name: 'rafi',
                last_name: 'tanujaya',
                email: 'rafi@gmail.com',
                phone: '00821'
            })

        console.log(result.body);
        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(contactTest.id);
        expect(result.body.data.first_name).toBe('rafi')
        expect(result.body.data.last_name).toBe('tanujaya')
        expect(result.body.data.email).toBe('rafi@gmail.com')
        expect(result.body.data.phone).toBe('00821')
    });

    it('should reject if request invalid', async () => {
        const contactTest = await ContactTestUtils.get()
        const result = await supertest(web).put(`/api/contacts/${contactTest.id}`)
            .set('X-API-TOKEN', 'test')
            .send({
                first_name: '',
                last_name: 'tanujaya',
                email: 'rafi',
                phone: '00821201390129030912'
            })

        console.log(result.body);
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if contactId invalid', async () => {
        const contactTest = await ContactTestUtils.get()
        const result = await supertest(web).put(`/api/contacts/${contactTest.id + 1}`)
            .set('X-API-TOKEN', 'test')
            .send({
                first_name: 'rafi',
                last_name: 'tanujaya',
                email: 'rafi@gmail.com',
                phone: '00821'
            })

        console.log(result.body);
        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
  })
  
  describe('DELETE /api/contact/:contactId', () => {
    beforeEach(async () => {
        await UserTestUtils.create()
        await ContactTestUtils.create()
    })

    afterEach(async () => {
        await ContactTestUtils.deleteAll()
        await UserTestUtils.remove();
    })

    it('should delete contatcs', async () => {
        const contactTest = await ContactTestUtils.get()
        let result = await supertest(web).delete(`/api/contacts/${contactTest.id}`)
            .set('X-API-TOKEN', 'test')


        console.log(result.body);
        expect(result.status).toBe(200);
        expect(result.body.data).toBe('OK');


        result = await supertest(web).delete(`/api/contacts/${contactTest.id}`)
            .set('X-API-TOKEN', 'test')

        expect(result.status).toBe(404);
        expect(result.body.errors).toBe('Contact not found');
    });

    it('should reject if contactId invalid', async () => {
        const contactTest = await ContactTestUtils.get()
        const result = await supertest(web).delete(`/api/contacts/${contactTest.id +1}`)
            .set('X-API-TOKEN', 'test')


        console.log(result.body);
        expect(result.status).toBe(404);
        expect(result.body.errors).toBe('Contact not found');
    });
  })
  
  describe('GET /api/contacts', () => {

    beforeEach(async () => {
        await UserTestUtils.create()
        await ContactTestUtils.create()
    })

    afterEach(async () => {
        await ContactTestUtils.deleteAll()
        await UserTestUtils.remove();
    })

    it('should search non query params', async () => {
        const result = await supertest(web).get(`/api/contacts`)
            .set('X-API-TOKEN', 'test')

        console.log(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
        expect(result.body.paging.current_page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.size).toBe(10);
    });

    it('should search with name query', async () => {
        const result = await supertest(web).get(`/api/contacts`)
            .set('X-API-TOKEN', 'test')
            .query({
                name: 'es'
            })

        console.log(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
        expect(result.body.paging.current_page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.size).toBe(10);
    });

    it('should search with email query', async () => {
        const result = await supertest(web).get(`/api/contacts`)
            .set('X-API-TOKEN', 'test')
            .query({
                email: '.com'
            })

        console.log(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
        expect(result.body.paging.current_page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.size).toBe(10);
    });

    it('should search with phone query', async () => {
        const result = await supertest(web).get(`/api/contacts`)
            .set('X-API-TOKEN', 'test')
            .query({
                phone: '08'
            })

        console.log(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
        expect(result.body.paging.current_page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.size).toBe(10);
    });

    it('should search not found', async () => {
        const result = await supertest(web).get(`/api/contacts`)
            .set('X-API-TOKEN', 'test')
            .query({
                name: 'salah'
            })

        console.log(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(0);
        expect(result.body.paging.current_page).toBe(1);
        expect(result.body.paging.total_page).toBe(0);
        expect(result.body.paging.size).toBe(10);
    });

    it('should search custom size and page', async () => {
        const result = await supertest(web).get(`/api/contacts`)
            .set('X-API-TOKEN', 'test')
            .query({
                size: 1,
                page: 10
            })

        console.log(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(0);
        expect(result.body.paging.current_page).toBe(10);
        expect(result.body.paging.total_page).toBe(0);
        expect(result.body.paging.size).toBe(1);
    });
  })
  
  
})
