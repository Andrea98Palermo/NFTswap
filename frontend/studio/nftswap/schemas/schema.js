// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat(
    [
      {
        name: 'nfts',
        title: 'Nfts',
        type: 'document',
        fields: [
          {
            name: 'contractAddress',
            title: 'Contract Address',
            type: 'string',
          },
          {
            name: 'tokenId',
            title: 'Token Id',
            type: 'string',
          },
          {
            name: 'imageUrl',
            title: 'Image Url',
            type: 'url',
          },
          {
            name: 'title',
            title: 'NFT Title',
            type: 'string',
          },
          {
            name: 'description',
            title: 'NFT Description',
            type: 'string',
          },
          {
            name: 'ercType',
            title: 'ERC Type',
            type: 'string',
          }
        ],
      },
    ]
    /* Your types here! */
  ),
})