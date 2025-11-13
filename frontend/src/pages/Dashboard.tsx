import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard: React.FC = () => {
  const { user, tenant } = useAuth();
  const [stats, setStats] = useState({
    household: 0,
    clothing: 0,
    miscellaneous: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [householdRes, clothingRes, miscRes] = await Promise.all([
          api.get('/household'),
          api.get('/clothing'),
          api.get('/miscellaneous'),
        ]);

        setStats({
          household: householdRes.data.length,
          clothing: clothingRes.data.length,
          miscellaneous: miscRes.data.length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const modules = [
    {
      name: 'Household Items',
      path: '/household',
      count: stats.household,
      description: 'Manage furniture, appliances, and electronics',
      icon: '🏠',
      color: 'bg-blue-500',
    },
    {
      name: 'Clothing',
      path: '/clothing',
      count: stats.clothing,
      description: 'Track clothing items for all family members',
      icon: '👕',
      color: 'bg-green-500',
    },
    {
      name: 'Miscellaneous',
      path: '/miscellaneous',
      count: stats.miscellaneous,
      description: 'Store documents, tools, and other items',
      icon: '📦',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Managing: {tenant?.name}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link
              key={module.path}
              to={module.path}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`text-4xl ${module.color} w-16 h-16 rounded-lg flex items-center justify-center`}>
                  {module.icon}
                </div>
                <div className="text-3xl font-bold text-gray-800">
                  {module.count}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {module.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {module.description}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-3">
          Getting Started
        </h2>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Click on any module above to start adding items</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Each item can include details like purchase date, price, location, and notes</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Your data is private and only accessible to your family group</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
