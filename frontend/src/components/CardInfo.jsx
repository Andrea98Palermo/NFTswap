import PropTypes from "prop-types"

CardInfo.propTypes = {
  contractAddress: PropTypes.string.isRequired,
  tokenId: PropTypes.string.isRequired,
  tokenType: PropTypes.string,
}

function CardInfo({ contractAddress, tokenId, tokenType}) {
  return (
    <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div className="p-5">
        <div>
          <p>Contract Address: {contractAddress}</p>
          <p>Token ID: {tokenId}</p>
          {tokenType && <p>Token Type: {tokenType}</p>}
        </div>
      </div>
    </div>
  )
}

export default CardInfo
