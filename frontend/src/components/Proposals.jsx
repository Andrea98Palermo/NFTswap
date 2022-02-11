export default function Proposals() {
  //const [address, setAddress] = useState()
  return (
    <div className="w-full mb-8 overflow-hidden rounded-lg border border-black">
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 -b -gray-600">
              <th className="px-4 py-3">Media</th>
              <th className="px-4 py-3">Proposal ID</th>
              <th className="px-4 py-3">NFT Address</th>
              <th className="px-4 py-3">Token ID</th>
              <th className="px-4 py-3"># Bids</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr className="text-gray-700">
              <td className="px-4 py-3 ">
                <div className="flex items-center text-sm">
                  <div>
                    <p className="font-semibold text-black">media</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-ms font-semibold ">22</td>
              <td className="px-4 py-3 text-xs ">
                <span className="px-2 py-1 font-semibold leading-tight"> 0x123321hjklk123132dafs </span>
              </td>
              <td className="px-4 py-3 text-sm ">3</td>
              <td className="px-4 py-3 text-sm ">1</td>
            </tr>
            <tr className="text-gray-700">
              <td className="px-4 py-3 ">
                <div className="flex items-center text-sm">
                  <div>
                    <p className="font-semibold text-black">media</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-md font-semibold ">27</td>
              <td className="px-4 py-3 text-xs ">
                <span className="px-2 py-1 font-semibold leading-tight"> 0x123321hjklk123132dafs </span>
              </td>
              <td className="px-4 py-3 text-sm ">33</td>
              <td className="px-4 py-3 text-sm ">10</td>
            </tr>
            <tr className="text-gray-700">
              <td className="px-4 py-3 ">
                <div className="flex items-center text-sm">
                  <div>
                    <p className="font-semibold">media</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-md font-semibold ">17</td>
              <td className="px-4 py-3 text-xs ">
                <span className="px-2 py-1 font-semibold leading-tight"> 0x123321hjklk123132dafs </span>
              </td>
              <td className="px-4 py-3 text-sm ">5</td>
              <td className="px-4 py-3 text-sm ">1</td>
            </tr>
            <tr className="text-gray-700">
              <td className="px-4 py-3 ">
                <div className="flex items-center text-sm">
                  <div>
                    <p className="font-semibold">media</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3  text-md font-semibold">23</td>
              <td className="px-4 py-3  text-xs">
                <span className="px-2 py-1 font-semibold leading-tight"> 0x123321hjklk123132dafs </span>
              </td>
              <td className="px-4 py-3  text-sm">31</td>
              <td className="px-4 py-3 text-sm ">2</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}