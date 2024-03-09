import supertest from "supertest"
import { AddressTestUtils } from "./utils/address"
import { ContactTestUtils } from "./utils/contact"
import { UserTestUtils } from "./utils/user"
import { web } from "../src/application/web"

describe('Addresses Api', () => {
  describe('POST /api/contacts/:contactId/addresses/', () => {
    beforeEach(async () => {
        await UserTestUtils.create()
        await ContactTestUtils.create()
    })

    afterEach(async () => {
        await AddressTestUtils.deleteAll()
        await ContactTestUtils.deleteAll()
        await UserTestUtils.remove();
    })

    it('should create address', async () => {
        const contact = await ContactTestUtils.get()
        const result = await supertest(web).post(`/api/contacts/${contact.id}/addresses`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: 'jalan baru',
                city: 'kota baru',
                province: 'provinsi baru',
                country: 'indonesia',
                postal_code: '4313'
            })

        console.log(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined()
        expect(result.body.data.street).toBe('jalan baru');
        expect(result.body.data.city).toBe('kota baru');
        expect(result.body.data.province).toBe('provinsi baru');
        expect(result.body.data.country).toBe('indonesia');
        expect(result.body.data.postal_code).toBe('4313');
    });

    it('should reject if request invalid', async () => {
        const contact = await ContactTestUtils.get()
        const result = await supertest(web).post(`/api/contacts/${contact.id}/addresses`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: 'jalan baru',
                city: 'kota baru',
                province: 'provinsi baru',
                country: '',
                postal_code: ''
            })

        console.log(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined()

    });

    it('should reject if contact invalid', async () => {
        const contact = await ContactTestUtils.get()
        const result = await supertest(web).post(`/api/contacts/${contact.id +1}/addresses`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: 'jalan baru',
                city: 'kota baru',
                province: 'provinsi baru',
                country: 'indonesia',
                postal_code: '5432'
            })

        console.log(result.body);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined()

    });
  })

  describe('GET /api/contacts/:contactId/addresses/:addressId', () => {

    beforeEach(async () => {
        await UserTestUtils.create()
        await ContactTestUtils.create()
        await AddressTestUtils.create()
    })

    afterEach(async () => {
        await AddressTestUtils.deleteAll()
        await ContactTestUtils.deleteAll()
        await UserTestUtils.remove();
    })
    it('should get address', async () => {
        const contact = await ContactTestUtils.get()
        const address = await AddressTestUtils.get()
        const result = await supertest(web).get(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test')

        console.log(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(address.id)
        expect(result.body.data.street).toBe('jalan baru');
        expect(result.body.data.city).toBe('kota baru');
        expect(result.body.data.province).toBe('provinsi baru');
        expect(result.body.data.country).toBe('indonesia');
        expect(result.body.data.postal_code).toBe('5432');
    });

    it('should reject if contact invalid', async () => {
        const contact = await ContactTestUtils.get()
        const address = await AddressTestUtils.get()
        const result = await supertest(web).get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test')

        console.log(result.body);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined()

    });

    it('should reject if address invalid', async () => {
        const contact = await ContactTestUtils.get()
        const address = await AddressTestUtils.get()
        const result = await supertest(web).get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set('X-API-TOKEN', 'test')

        console.log(result.body);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
  })
  

  describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await UserTestUtils.create()
        await ContactTestUtils.create()
        await AddressTestUtils.create()
    })

    afterEach(async () => {
        await AddressTestUtils.deleteAll()
        await ContactTestUtils.deleteAll()
        await UserTestUtils.remove();
    })

    it('should Update address', async () => {
        const contact = await ContactTestUtils.get()
        const address = await AddressTestUtils.get()
        const result = await supertest(web).put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: 'jalan',
                city: 'kota',
                province: 'provinsi',
                country: 'indonesia',
                postal_code: '43131'
            })
        console.log(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(address.id)
        expect(result.body.data.street).toBe('jalan');
        expect(result.body.data.city).toBe('kota');
        expect(result.body.data.province).toBe('provinsi');
        expect(result.body.data.country).toBe('indonesia');
        expect(result.body.data.postal_code).toBe('43131');
    });

    it('should reject if request invalid', async () => {
        const contact = await ContactTestUtils.get()
        const address = await AddressTestUtils.get()
        const result = await supertest(web).put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: 'jalan',
                city: 'kota',
                province: 'provinsi',
                country: '',
                postal_code: ''
            })
        console.log(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if contact not found', async () => {
        const contact = await ContactTestUtils.get()
        const address = await AddressTestUtils.get()
        const result = await supertest(web).put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: 'jalan',
                city: 'kota',
                province: 'provinsi',
                country: 'indonesia',
                postal_code: '24312'
            })
        console.log(result.body);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if address not found', async () => {
        const contact = await ContactTestUtils.get()
        const address = await AddressTestUtils.get()
        const result = await supertest(web).put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: 'jalan',
                city: 'kota',
                province: 'provinsi',
                country: 'indonesia',
                postal_code: '24312'
            })
        console.log(result.body);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
  })
  
  describe('GET /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
        await UserTestUtils.create()
        await ContactTestUtils.create()
        await AddressTestUtils.create()
    })

    afterEach(async () => {
        await AddressTestUtils.deleteAll()
        await ContactTestUtils.deleteAll()
        await UserTestUtils.remove();
    })

    it('should get list addresses', async () => {
        const contact = await ContactTestUtils.get()
        const result = await supertest(web).get(`/api/contacts/${contact.id}/addresses`)
            .set('X-API-TOKEN', 'test')

        console.log(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1)
    });

    it('should reject if contact not found', async () => {
        const contact = await ContactTestUtils.get()
        const result = await supertest(web).get(`/api/contacts/${contact.id + 1}/addresses`)
            .set('X-API-TOKEN', 'test')

        console.log(result.body);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined()
    });
  })
  
  describe('DELETE /api/users/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await UserTestUtils.create()
        await ContactTestUtils.create()
        await AddressTestUtils.create()
    })

    afterEach(async () => {
        await AddressTestUtils.deleteAll()
        await ContactTestUtils.deleteAll()
        await UserTestUtils.remove();
    })

    it('should delete address', async () => {
        const contact = await ContactTestUtils.get()
        const address = await AddressTestUtils.get()
        let result = await supertest(web).delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test')
        console.log(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data).toBe('OK');

        result = await supertest(web).delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test')
        console.log(result.body);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBe('Address not found');
    });

    it('should reject if contact Invalid', async () => {
        const contact = await ContactTestUtils.get()
        const address = await AddressTestUtils.get()
        const result = await supertest(web).delete(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test')
        console.log(result.body);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined()
    });

    it('should reject if address Invalid', async () => {
        const contact = await ContactTestUtils.get()
        const address = await AddressTestUtils.get()
        const result = await supertest(web).delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set('X-API-TOKEN', 'test')
        console.log(result.body);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined()
    });
  })
  
})
