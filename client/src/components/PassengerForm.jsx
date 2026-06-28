import React from 'react';

const PassengerForm = ({ passengers, handlePassengerChange }) => {
  return (
    <div className="space-y-6">
      {passengers.map((passenger, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
          <h3 className="font-medium text-dark mb-4">Passenger {index + 1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input 
                type="text" 
                value={passenger.firstName || ''}
                onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                type="text" 
                value={passenger.lastName || ''}
                onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Last Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input 
                type="number" 
                value={passenger.age || ''}
                onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Age"
                min="1"
                max="120"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PassengerForm;
