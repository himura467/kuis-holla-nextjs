'use client';

import React, { useState } from 'react';

export default function DetectedPage() {
  const [isAdvertising, setIsAdvertising] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [info, setInfo] = useState<string>('');

  const startAdvertising = async () => {
    try {
      setError('');
      
      // Check if Bluetooth is available
      const isAvailable = await navigator.bluetooth.getAvailability();
      if (!isAvailable) {
        throw new Error('Bluetooth is not available on this device');
      }

      // Note: Web Bluetooth Advertising API is not widely supported yet
      setInfo('Note: Browser support for Bluetooth advertising is limited. This device is attempting to be discoverable.');
      setIsAdvertising(true);

      // In a real implementation, we would use the Web Bluetooth Advertising API
      // However, as it's experimental, we're just simulating the state
      // The actual API might look something like this when it becomes available:
      /*
      await navigator.bluetooth.advertise({
        name: 'My Device',
        serviceUuids: ['custom-service-uuid']
      });
      */

    } catch (err) {
      setError((err as Error).message);
      setIsAdvertising(false);
    }
  };

  const stopAdvertising = () => {
    setIsAdvertising(false);
    setInfo('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bluetooth Peripheral Mode</h1>
      
      <button
        onClick={isAdvertising ? stopAdvertising : startAdvertising}
        className={`px-4 py-2 rounded ${
          isAdvertising 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
      >
        {isAdvertising ? 'Stop Advertising' : 'Start Advertising'}
      </button>

      {info && (
        <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded">
          {info}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
          Error: {error}
        </div>
      )}

      {isAdvertising && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Status</h2>
          <div className="p-4 bg-green-100 text-green-800 rounded">
            Device is currently advertising and can be discovered by other devices
          </div>
        </div>
      )}
    </div>
  );
}
