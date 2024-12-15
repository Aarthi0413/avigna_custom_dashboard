import React, { useEffect, useState } from 'react'
import domo from "ryuu.js";
import avignaLogo from '../assets/avigna_logo.png'
import Slider from './Navigation';

const Dashboard = () => {

    const [data, setData] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [selectedCellDetails, setSelectedCellDetails] = useState(null);

    const calculateAverageOccupancyRate = (warehouseData) => {
        const totalOccupancy = warehouseData.reduce((acc, item) => acc + item['OccupancyRate%'], 0);
        return totalOccupancy / warehouseData.length;
    };

    const calculateUtilizationPercentage = (laneData, rack) => {
        const rackData = laneData.filter(item => item.Rack === rack);
        const totalUtilized = rackData.reduce((acc, item) => acc + item['Utilized %'], 0);
        const normalizedUtilized = Math.min(totalUtilized, 1);
        return normalizedUtilized * 100;
    };

    useEffect(() => {
        domo.get("/data/v1/occupancy_status_data")
            .then((data) => {
                setData(data)
                console.log(data)

                if (data.length > 0) {
                    setSelectedWarehouse(data[0]['Warehouse-Name']);
                }
            })
            .catch((err) => console.log(err))
    }, [])

    const warehouses = data.reduce((acc, item) => {
        const { 'Warehouse-Name': warehouseName, 'OccupancyRate%': occupancyRate } = item;
        if (!acc[warehouseName]) {
            acc[warehouseName] = [];
        }
        acc[warehouseName].push({ 'OccupancyRate%': occupancyRate });
        return acc;
    }, {});

    const averageOccupancyData = Object.keys(warehouses).map((warehouseName) => {
        const averageOccupancyRate = calculateAverageOccupancyRate(warehouses[warehouseName]);
        return { warehouseName, averageOccupancyRate };
    });

    // Sort the warehouses by average occupancy rate in descending order
    const sortedWarehouses = averageOccupancyData.sort((a, b) => b.averageOccupancyRate - a.averageOccupancyRate);

    // Take top 3 warehouses
    const topWarehouses = sortedWarehouses.slice(0, 3)

    const filteredData = selectedWarehouse ? data.filter(item => item['Warehouse-Name'] === selectedWarehouse) : [];

    const lanes = filteredData.reduce((acc, item) => {
        const { Lane, Rack, 'Utilized %': utilized } = item;
        if (!acc[Lane]) {
            acc[Lane] = [];
        }
        acc[Lane].push(item);
        return acc;
    }, {});

    // Define the racks that we are going to display
    const racks = Array.from(new Set(data.map(item => item.Rack)));

    const handleWarehouseChange = (e) => {
        setSelectedWarehouse(e.target.value);
    };

    const handleCellClick = (laneName, rack) => {
        // Find ALL items that match the warehouse, lane, and rack
        const cellDetails = filteredData.filter(
            item => item.Lane === laneName && item.Rack === rack
        );

        if (cellDetails.length > 0) {
            setSelectedCellDetails(cellDetails);
        }
    };

    const closeModal = () => {
        setSelectedCellDetails(null);
    };

    const getUtilizationColor = (utilization) => {
        if (utilization < 35) {
            return 'text-red-700';
        } else if (utilization >= 35 && utilization <= 75) {
            return 'text-yellow-700';
        } else {
            return 'text-green-700'; 
        }
    };

    return (
        <div className=''>
            <nav className='flex justify-start items-center p-2'>
                <img src={avignaLogo} alt="Avigna Logo" className="w-[65px] h-[60px] object-cover rounded-full mr-3" />
                <div className='flex flex-col'>
                <span className="text-sm text-[#013968] font-semibold spacing">AVIGNA</span>
                <span className="text-xs text-[#013968] spacing">GROUP</span>
                </div>
            </nav>
            <div className='text-center font-serif'>
                <h4 className='italic font-semibold text-lg text-[#013968]'>Deep Insights, Deeply Trusted - Avigna</h4>
            </div>

            <div className='flex mt-6 gap-4'>
                <div className=" flex flex-col justify-start container gap-3">
                    {topWarehouses.map((warehouse, index) => (
                        <div
                            key={index}
                            className="bg-[#013968] text-white rounded-lg shadow-lg p-3 w-60 flex flex-col items-center"
                        >
                            <h3 className="text-md font-semibold capitalize">{warehouse.warehouseName}</h3>
                            <p className="text-lg mt-2 text-[#fb8d34] font-semibold">{Math.round(warehouse.averageOccupancyRate * 100)}%</p>
                        </div>
                    ))}
                </div>

                <div className=" flex flex-col justify-center gap-3">
                    <div className='flex justify-between'>
                    <div>
                        <h4 className='text-md text-[#013968] font-semibold'>Warehouse Current Occupancy Rate</h4>
                    </div>
                    <div>
                        <select 
                            value={selectedWarehouse} 
                            onChange={handleWarehouseChange}
                            className="border border-gray-400 rounded px-2 py-1"
                        >
                            {Object.keys(warehouses).map((warehouseName) => (
                                <option key={warehouseName} value={warehouseName}>
                                    {warehouseName}
                                </option>
                            ))}
                        </select>
                    </div>
                    </div>
                    {/* Create the Table */}
                    <div>
                    {selectedWarehouse && (
                        <table className="table-auto border-collapse w-full text-sm table-fixed">
                            <thead>
                                <tr>
                                    <th className="p-2 border border-gray-400 text-center">Lane</th>
                                    {racks.map((rack, index) => (
                                        <th key={index} className="p-2 border border-gray-400 text-center">{rack}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(lanes).map((laneName) => (
                                    <tr key={laneName}>
                                        <td className="p-2 border border-gray-400 text-center">{laneName}</td>
                                        {racks.map((rack) => {
                                            const totalUtilizedValue = calculateUtilizationPercentage(lanes[laneName], rack);
                                            const utilizationColor = getUtilizationColor(totalUtilizedValue);

                                            return (
                                                <td key={rack}  className={`p-2 font-semibold border border-gray-400 text-center ${utilizationColor}`}
                                                onClick={() => handleCellClick(laneName, rack)}>
                                                    {Math.round(totalUtilizedValue)}%
                                                    
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    </div>
                </div>
            </div>
            <div>
                <Slider/>
            </div>
            
            {selectedCellDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-[800px] max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Client Details</h2>
                        <table className="w-full border-collapse border">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border p-2 text-sm">Customer</th>
                                    <th className="border p-2 text-sm">Crate Value</th>
                                    <th className="border p-2 text-sm">Crate Volume</th>
                                    <th className="border p-2 text-sm">Inventory Checkin Date</th>
                                    <th className="border p-2 text-sm">Product View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedCellDetails.map((cell, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border p-2 text-center text-sm">{cell['Customer'] || 'N/A'}</td>
                                        <td className="border p-2 text-center text-sm">{cell['Crate Value'] || 'N/A'}</td>
                                        <td className="border p-2 text-center text-sm">{cell['Crate Volume'] || 'N/A'}</td>
                                        <td className="border p-2 text-center text-sm">
                                            {cell['Inventory Checkin Date '] || 'N/A'}
                                        </td>
                                        <td className="border p-2 text-center text-sm">
                                            {/* Render image if available, else show a placeholder */}
                                            {cell['Images'] ? (
                                                <img src={cell['Images']} alt={cell['Customer'] || 'No Image'} className="w-16 h-16 object-cover rounded-md" />
                                            ) : (
                                                <span>No Product Available</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button 
                            onClick={closeModal}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
