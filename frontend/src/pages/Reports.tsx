import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6'];

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [overallStats, setOverallStats] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any[]>([]);
  const [conditionData, setConditionData] = useState<any[]>([]);
  const [purchaseTrends, setPurchaseTrends] = useState<any[]>([]);
  const [ownerData, setOwnerData] = useState<any[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [overall, categories, locations, conditions, trends, owners] = await Promise.all([
        api.get('/reports/overall'),
        api.get('/reports/category-breakdown'),
        api.get('/reports/location-breakdown'),
        api.get('/reports/condition-breakdown'),
        api.get('/reports/purchase-trends'),
        api.get('/reports/clothing-by-owner'),
      ]);

      setOverallStats(overall.data);
      setCategoryData(categories.data);
      setLocationData(locations.data);
      setConditionData(conditions.data);
      setPurchaseTrends(trends.data);
      setOwnerData(owners.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading reports...</p>
      </div>
    );
  }

  const moduleData = overallStats
    ? [
        { name: 'Household', items: overallStats.byModule.household.count, value: overallStats.byModule.household.value },
        { name: 'Clothing', items: overallStats.byModule.clothing.count, value: overallStats.byModule.clothing.value },
        { name: 'Miscellaneous', items: overallStats.byModule.miscellaneous.count, value: overallStats.byModule.miscellaneous.value },
      ]
    : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Insights into your family inventory</p>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Items</h3>
          <p className="text-3xl font-bold text-blue-600">{overallStats?.totalItems || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Value</h3>
          <p className="text-3xl font-bold text-green-600">
            ${(overallStats?.totalValue || 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Average Item Value</h3>
          <p className="text-3xl font-bold text-purple-600">
            ${overallStats?.totalItems > 0 ? (overallStats.totalValue / overallStats.totalItems).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Module Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Items by Module</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={moduleData}
                dataKey="items"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name}: ${entry.items}`}
              >
                {moduleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Value by Module</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moduleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" name="Value ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Items by Category</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={categoryData.slice(0, 10)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#10B981" name="Item Count" />
            </BarChart>
          </ResponsiveContainer>
          {categoryData.length > 10 && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Showing top 10 categories out of {categoryData.length}
            </p>
          )}
        </div>
      )}

      {/* Location Breakdown */}
      {locationData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Items by Location</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={locationData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name}: ${entry.count}`}
              >
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Condition Breakdown */}
      {conditionData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Items by Condition</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conditionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#F59E0B" name="Item Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Purchase Trends */}
      {purchaseTrends.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Purchase Trends Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={purchaseTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                name="Items Purchased"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                name="Amount Spent ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Clothing by Owner */}
      {ownerData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Clothing by Family Member</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ownerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8B5CF6" name="Item Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Empty State */}
      {overallStats?.totalItems === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg">
            No data available yet. Start adding items to see analytics and insights!
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;
