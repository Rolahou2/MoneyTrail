import React from 'react'

const sampleData = [
  { id: 'HW-AMJ-001', name: 'منظف اليدين_Amreej_red', botlesize: 3.75, cost: 1.53, totalcost: 1.87, sellPriceUSD: 4,  sellPriceLL: 360000},
  { id: 'HW-APP-002', name: 'منظف اليدين_Apple_green', botlesize: 3.75, cost: 1.60, totalcost: 1.94, sellPriceUSD: 4,  sellPriceLL: 360000 },
  { id: 'HW-LAV-003', name: 'منظف اليدين_Lavender_violet', botlesize: 3.75, cost: 1.62, totalcost: 1.96, sellPriceUSD: 4,  sellPriceLL: 360000 },
];

const productlist = () => {
  return (
    <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2">Product Name</th>
          <th className="border border-gray-300 p-2">Product ID</th>
          <th className="border border-gray-300 p-2">Bottle Size</th>
          <th className="border border-gray-300 p-2">Cost per Unit</th>
          <th className="border border-gray-300 p-2">Total Cost in USD</th>
          <th className="border border-gray-300 p-2">Selling Price in USD</th>
          <th className="border border-gray-300 p-2">Selling Price in L.L</th>
        </tr>
      </thead>
      <tbody>
        {sampleData.map((row) => (
          <tr key={row.id}> {/* Added unique key prop */}
            <td className="border border-gray-300 p-2">{row.name}</td>
            <td className="border border-gray-300 p-2">{row.id}</td>
            <td className="border border-gray-300 p-2">{row.botlesize}</td>
            <td className="border border-gray-300 p-2">{row.cost}</td>
            <td className="border border-gray-300 p-2">{row.totalcost}</td>
            <td className="border border-gray-300 p-2">{row.sellPriceUSD}</td>
            <td className="border border-gray-300 p-2">{row.sellPriceLL}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default productlist;