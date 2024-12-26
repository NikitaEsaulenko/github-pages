import type { GetItemsResponse200 } from '@/api/productsApiClient/tsclient/productsApiClient'
import type { Filter } from '@/types/Filter'
import type {
  PostProductsResponse200,
  PostProductsResponse204,
} from '@retailrocket/retailrocket.analytics.rocketsearch.apiclients.v2/main'

import { Err, Ok } from '@thames/monads'
import { describe, expect, it, vi } from 'vitest'

import { searchProductsFactory } from './searchProductsFactory'

const mockGetProductsByIdsHttpClient = vi.fn()
const mockSearchProductsHttpClient = vi.fn()
const lang = 'en'
const partnerId = '12345'
const stock = 'moscow'

const successfulSearchResponse: PostProductsResponse200 = {
  body: {
    filters: [
      {
        checkBoxFilter: {
          filterId: 'color',
          retrivedValues: [
            {
              count: 10,
              isSelected: true,
              pictureUrl: undefined,
              title: 'Blue',
              valueId: 'blue',
            },
            {
              count: 15,
              isSelected: true,
              pictureUrl: undefined,
              title: 'Red',
              valueId: 'red',
            },
          ],
          title: 'Color',
        },
      },
      {
        radioButtonFilter: {
          filterId: 'size',
          retrivedValues: [
            {
              count: 5,
              pictureUrl: undefined,
              title: 'Large',
              valueId: 'large',
            },
            {
              count: 3,
              pictureUrl: undefined,
              title: 'Small',
              valueId: 'small',
            },
          ],
          selectedValueId: 'large',
          title: 'Size',
        },
      },
      {
        intervalFilter: {
          filterId: 'price',
          retrivedMax: 100,
          retrivedMin: 10,
          selectedMax: 80,
          selectedMin: 20,
          title: 'Price',
        },
      },
    ],
    pagesCount: 2,
    products: [1, 2],
    productsCount: 5,
  },
  status: 200,
}

const successfulSearchResponse204: PostProductsResponse204 = {
  status: 204,
}

const successfulProductsResponse: GetItemsResponse200 = {
  body: [
    {
      Algorithm: null,
      Author: null,
      Barcode: null,
      BuyUrl: null,
      CategoryIds: [],
      Color: '',
      Description: '',
      GroupId: null,
      IsAvailable: true,
      IsNew: false,
      ItemId: 1,
      Model: null,
      Name: 'Product 1',
      OldPrice: 100,
      Params: {},
      PictureUrl: 'image1.jpg',
      PreviousPrice: null,
      Price: 90,
      Regions: null,
      Size: null,
      TypePrefix: null,
      Url: '',
      Vendor: null,
      Weight: 1,
    },
  ],
  status: 200,
}

const serverErrorResponse = {
  body: '',
  status: 500,
}

const networkError = () => {
  throw new Error('Network error')
}

describe('searchProductsFactory', () => {
  it('should return Ok with parsed data on successful response', async () => {
    mockSearchProductsHttpClient.mockResolvedValue(successfulSearchResponse)
    mockGetProductsByIdsHttpClient.mockResolvedValue(successfulProductsResponse)

    const searchProducts = searchProductsFactory({
      getProductsByIdsHttpClient: mockGetProductsByIdsHttpClient,
      lang,
      partnerId,
      searchProductsHttpClient: mockSearchProductsHttpClient,
      stock,
    })

    const filters: Filter[] = [
      {
        data: [],
        id: 'color',
        title: 'Color',
        type: 'Checkbox',
        value: ['blue', 'red'],
      },
      {
        data: [],
        id: 'size',
        title: 'Size',
        type: 'Radio',
        value: 'large',
      },
      {
        id: 'price',
        max: 100,
        min: 0,
        step: 1,
        title: 'Price',
        type: 'RangeWithSlider',
        value: { from: 20, to: 80 },
      },
    ]

    const result = await searchProducts({
      filters: filters,
      page: 1,
      pageSize: 12,
      phrase: '',
      sort: '',
    })

    expect(result).toEqual(
      Ok({
        filters: [
          {
            data: [
              {
                description: '10',
                text: 'Blue',
                value: 'blue',
              },
              {
                description: '15',
                text: 'Red',
                value: 'red',
              },
            ],
            id: 'color',
            title: 'Color',
            type: 'Checkbox',
            value: ['blue', 'red'],
          },
          {
            data: [
              {
                description: '5',
                text: 'Large',
                value: 'large',
              },
              {
                description: '3',
                text: 'Small',
                value: 'small',
              },
            ],
            id: 'size',
            title: 'Size',
            type: 'Radio',
            value: 'large',
          },
          {
            id: 'price',
            max: 100,
            min: 10,
            step: 1,
            title: 'Price',
            type: 'RangeWithSlider',
            value: {
              from: 20,
              to: 80,
            },
          },
        ],
        pagesCount: 2,
        products: [
          {
            href: 'javascript:void(0)',
            id: 1,
            image: 'image1.jpg',
            name: 'Product 1',
            oldPrice: 100,
            price: 90,
            rating: 0,
            reviewsCount: 0,
          },
        ],
        productsCount: 5,
      }),
    )
  })

  it('should return Ok with no content on 204 response', async () => {
    mockSearchProductsHttpClient.mockResolvedValue(successfulSearchResponse204)
    mockGetProductsByIdsHttpClient.mockResolvedValue(successfulProductsResponse)

    const searchProducts = searchProductsFactory({
      getProductsByIdsHttpClient: mockGetProductsByIdsHttpClient,
      lang,
      partnerId,
      searchProductsHttpClient: mockSearchProductsHttpClient,
      stock,
    })

    const result = await searchProducts({
      filters: [],
      page: 1,
      pageSize: 10,
      phrase: 'test',
      sort: '',
    })

    expect(result).toEqual(Ok({ filters: [], pagesCount: 0, products: [], productsCount: 0 }))
  })

  it('should return Err on server error', async () => {
    mockSearchProductsHttpClient.mockResolvedValue(serverErrorResponse)
    const searchProducts = searchProductsFactory({
      getProductsByIdsHttpClient: mockGetProductsByIdsHttpClient,
      lang,
      partnerId,
      searchProductsHttpClient: mockSearchProductsHttpClient,
      stock,
    })

    const result = await searchProducts({
      filters: [],
      page: 1,
      pageSize: 12,
      phrase: '',
      sort: '',
    })

    expect(result).toEqual(Err('Server error'))
  })

  it('should return Err on network error', async () => {
    mockSearchProductsHttpClient.mockImplementation(networkError)
    const searchProducts = searchProductsFactory({
      getProductsByIdsHttpClient: mockGetProductsByIdsHttpClient,
      lang,
      partnerId,
      searchProductsHttpClient: mockSearchProductsHttpClient,
      stock,
    })

    const result = await searchProducts({
      filters: [],
      page: 1,
      pageSize: 12,
      phrase: '',
      sort: '',
    })

    expect(result).toEqual(Err('Network error'))
  })
})
