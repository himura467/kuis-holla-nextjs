"use client";

import React, { useState } from "react";

interface DetectedDevice {
  name: string;
  id: string;
  device?: BluetoothDevice;
  characteristic?: BluetoothRemoteGATTCharacteristic;
}

// Custom UUIDs matching our peripheral
const SERVICE_UUID = "00000000-0000-0000-0000-000000000000";
const CHARACTERISTIC_UUID = "00000001-0000-0000-0000-000000000000";

export default function DetectPage() {
  const [devices, setDevices] = useState<DetectedDevice[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedDevice, setSelectedDevice] = useState<DetectedDevice | null>(null);
  const [message, setMessage] = useState<string>("");
  const [receivedData, setReceivedData] = useState<string>("");

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setError("");

      const device = await navigator.bluetooth.requestDevice({
        filters: [
          {
            services: [SERVICE_UUID],
            name: "KuisHolla"
          }
        ]
      });

      if (device) {
        const newDevice: DetectedDevice = {
          name: device.name || "Unknown Device",
          id: device.id,
          device: device
        };

        setDevices((prev) => [...prev, newDevice]);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (device: DetectedDevice) => {
    try {
      setError("");
      if (!device.device) {
        throw new Error("Device not found");
      }

      const server = await device.device.gatt?.connect();
      if (!server) {
        throw new Error("Failed to connect to GATT server");
      }

      const service = await server.getPrimaryService(SERVICE_UUID);
      const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

      // Set up notification handler
      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', (event: Event & { target: BluetoothRemoteGATTCharacteristic }) => {
        const value = event.target.value;
        if (value) {
          const decoder = new TextDecoder('utf-8');
          const receivedValue = decoder.decode(value);
          setReceivedData(receivedValue);
        }
      });

      setSelectedDevice({ ...device, characteristic });
    } catch (err) {
      setError((err as Error).message);
      setSelectedDevice(null);
    }
  };

  const disconnectDevice = async () => {
    try {
      if (selectedDevice?.device) {
        await selectedDevice.device.gatt?.disconnect();
        setSelectedDevice(null);
        setReceivedData("");
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const readValue = async () => {
    try {
      setError("");
      if (!selectedDevice?.characteristic) {
        throw new Error("No device connected");
      }

      const value = await selectedDevice.characteristic.readValue();
      const decoder = new TextDecoder('utf-8');
      setReceivedData(decoder.decode(value));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const writeValue = async () => {
    try {
      setError("");
      if (!selectedDevice?.characteristic || !message) {
        throw new Error("No device connected or message empty");
      }

      const encoder = new TextEncoder();
      await selectedDevice.characteristic.writeValue(encoder.encode(message));
      setMessage("");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bluetooth Device Detection</h1>

      <button
        onClick={startScanning}
        disabled={isScanning}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isScanning ? "Scanning..." : "Start Scanning"}
      </button>

      {error && <div className="text-red-500 mt-4">Error: {error}</div>}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Detected Devices</h2>
        {devices.length === 0 ? (
          <p>No devices detected yet</p>
        ) : (
          <ul className="space-y-2">
            {devices.map((device) => (
              <li key={device.id} className="p-3 border rounded">
                <p>Name: {device.name}</p>
                <p className="text-sm text-gray-600">ID: {device.id}</p>
                {!selectedDevice && (
                  <button
                    onClick={() => connectToDevice(device)}
                    className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Connect
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedDevice && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">
            Connected to: {selectedDevice.name}
          </h2>
          
          <button
            onClick={disconnectDevice}
            className="bg-red-500 text-white px-3 py-1 rounded mb-4"
          >
            Disconnect
          </button>

          <div className="space-y-4">
            <div>
              <button
                onClick={readValue}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Read Value
              </button>
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message to send"
                className="border rounded px-2 py-1 flex-1"
              />
              <button
                onClick={writeValue}
                disabled={!message}
                className="bg-green-500 text-white px-3 py-1 rounded disabled:bg-gray-400"
              >
                Send
              </button>
            </div>

            {receivedData && (
              <div className="mt-4">
                <h3 className="font-semibold">Received Data:</h3>
                <p className="mt-1 p-2 bg-gray-100 rounded">{receivedData}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
