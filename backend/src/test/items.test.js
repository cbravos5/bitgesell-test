const request = require('supertest');
const { readData, writeData } = require('../data/fileAccess');
const app = require('../app');
const errorCodes = require('../middleware/errors');

jest.mock('../data/fileAccess', () => ({
  readData: jest.fn(),
  writeData: jest.fn()
}));

const mockedData = [  {
  "id": 1,
  "name": "Laptop Stand",
  "category": "Kitchen",
  "price": 116
},
{
  "id": 2,
  "name": "Bluetooth Speaker",
  "category": "Office Supplies",
  "price": 1093
},
{
  "id": 3,
  "name": "Adjustable Stool",
  "category": "Fitness",
  "price": 1199
}];

describe('Items tests', () => {
  test('should return list of items', async () => {
    readData.mockResolvedValueOnce(mockedData)
    const res = await request(app).get('/api/items')
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockedData)
  });

  test('should apply filters in items list', async () => {
    readData.mockResolvedValueOnce(mockedData)
    const res = await request(app)
      .get('/api/items?' + new URLSearchParams({ limit: 1, q: 'adjustable' }).toString());

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([mockedData[2]])
  });

  test('should return specified item by id', async () => {
    readData.mockResolvedValueOnce(mockedData)
    const res = await request(app)
      .get('/api/items/2');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockedData[1])
  });


  test('should return not found when item not found', async () => {
    readData.mockResolvedValueOnce(mockedData);
    const res = await request(app)
      .get('/api/items/10');

    expect(res.statusCode).toEqual(errorCodes.ITEM_NOT_FOUND.status);
    expect(res.body).toEqual({ error: errorCodes.ITEM_NOT_FOUND.message })
  });

  test('should create new item with succes', async () => {
    readData.mockResolvedValueOnce([]);

    const time = new Date().getTime();

    jest
    .useFakeTimers()
    .setSystemTime(time);

    const item = {
      "name": "Smart Thermostat",
      "category": "Office Supplies",
      "price": 836
    }
    
    const res = await request(app)
      .post('/api/items')
      .send(item);

    expect(res.statusCode).toEqual(201);
    expect(writeData).toHaveBeenCalledWith([{ ...item, id: time }]);
  });

  test('should return validation error', async () => {
    const item = {
      "category": "Office Supplies",
      "price": 836
    }
    
    const res = await request(app)
      .post('/api/items')
      .send(item);

    expect(res.statusCode).toEqual(400);
    expect(res.body?.at(0)?.errors.issues[0].message).toBe("Field is required");
  });


  test('should return 500 when somethign throws', async () => {
    readData.mockImplementationOnce(async () => { throw new Error(); });

    const res = await request(app).get('/api/items');

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ error: 'Unexpected' })
  });
})