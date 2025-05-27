"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface DetectedDevice {
  name: string;
  id: string;
  device?: BluetoothDevice;
  characteristic?: BluetoothRemoteGATTCharacteristic;
  cleanup?: () => void;
}

// Custom UUIDs matching our peripheral
const SERVICE_UUID = "00000000-0000-0000-0000-000000000000";
const CHARACTERISTIC_UUID = "00000001-0000-0000-0000-000000000000";

export default function DetectPage() {
  const [devices, setDevices] = useState<DetectedDevice[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedDevice, setSelectedDevice] = useState<DetectedDevice | null>(
    null,
  );
  const [message, setMessage] = useState<string>("");
  const [receivedData, setReceivedData] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
          {
            withCredentials: true,
          },
        );
        setUserId(res.data.id);
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
        setError("Failed to fetch user ID");
      }
    };

    void fetchUserId();
  }, []);

  const readValue = async () => {
    try {
      setError("");
      if (!selectedDevice?.characteristic) {
        throw new Error("No device connected");
      }

      console.log("Reading characteristic value...");
      const value = await selectedDevice.characteristic.readValue();
      const decoder = new TextDecoder("utf-8");
      const decodedValue = decoder.decode(value);
      console.log("Read value:", decodedValue);
      setReceivedData(decodedValue);
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

      console.log("Writing value:", message);
      const encoder = new TextEncoder();
      await selectedDevice.characteristic.writeValue(encoder.encode(message));
      console.log("Write complete");
      setMessage("");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Handle automatic read/write when device is connected
  useEffect(() => {
    const handleDeviceConnection = async () => {
      if (selectedDevice?.characteristic && userId) {
        try {
          await delay(500);
          // First read the peripheral's userId
          await readValue();
          await delay(500);
          // Then send our userId
          setMessage(userId);
          await writeValue();
        } catch (err) {
          setError((err as Error).message);
        }
      }
    };

    void handleDeviceConnection();
  }, [selectedDevice, userId, setError, setMessage, readValue, writeValue]);

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setError("");

      const device = await navigator.bluetooth.requestDevice({
        filters: [
          {
            services: [SERVICE_UUID],
          },
        ],
      });

      if (device) {
        const newDevice: DetectedDevice = {
          name: device.name || "Unknown Device",
          id: device.id,
          device: device,
        };

        setDevices((prev) => [...prev, newDevice]);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsScanning(false);
    }
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const connectToDevice = async (device: DetectedDevice) => {
    try {
      setError("");
      if (!device.device) {
        throw new Error("Device not found");
      }

      console.log("Connecting to GATT server...");
      const server = await device.device.gatt?.connect();
      if (!server) {
        throw new Error("Failed to connect to GATT server");
      }

      console.log("Getting primary service...");
      const service = await server.getPrimaryService(SERVICE_UUID);

      console.log("Getting characteristic...");
      const characteristic =
        await service.getCharacteristic(CHARACTERISTIC_UUID);

      // Set up notification handler
      console.log("Starting notifications...");
      await characteristic.startNotifications();
      characteristic.addEventListener(
        "characteristicvaluechanged",
        (event: Event & { target: BluetoothRemoteGATTCharacteristic }) => {
          const value = event.target.value;
          if (value) {
            const decoder = new TextDecoder("utf-8");
            const receivedValue = decoder.decode(value);
            setReceivedData(receivedValue);
          }
        },
      );

      setSelectedDevice({ ...device, characteristic });
    } catch (err) {
      setError((err as Error).message);
      setSelectedDevice(null);
    }
  };

  const disconnectDevice = async () => {
    try {
      if (selectedDevice?.cleanup) {
        selectedDevice.cleanup();
      }
      if (selectedDevice?.device) {
        await selectedDevice.device.gatt?.disconnect();
        setSelectedDevice(null);
        setReceivedData("");
      }
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
                <div className="mt-2 space-x-2">
                  {!selectedDevice && (
                    <button
                      onClick={() => connectToDevice(device)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Connect
                    </button>
                  )}
                </div>
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
            {receivedData && (
              <div className="mt-4">
                <h3 className="font-semibold">User ID:</h3>
                <p className="mt-1 p-2 bg-gray-100 rounded">{receivedData}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
