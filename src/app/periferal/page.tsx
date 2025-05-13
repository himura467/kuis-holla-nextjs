"use client";

import React, { useState } from "react";

interface DetectedDevice {
  name: string;
  id: string;
}

// アプリケーション固有のサービスUUID
const APP_SERVICE_UUID = "00001800-0000-1000-8000-00805f9b34fb"; // アプリケーション固有の UUID

export default function DetectedPage() {
  const [devices, setDevices] = useState<DetectedDevice[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setError("");

      const device = await navigator.bluetooth.requestDevice({
        // このアプリケーションをインストールしている端末のみを検出
        filters: [
          {
            services: [APP_SERVICE_UUID], // アプリケーション固有のサービスを持つデバイスのみをフィルタリング
          },
        ],
        optionalServices: [],
      });

      if (device) {
        setDevices((prev: DetectedDevice[]) => [
          ...prev,
          {
            name: device.name || "Unknown Device",
            id: device.id,
          },
        ]);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Bluetooth Peripheral Device Detection
      </h1>

      <button
        onClick={startScanning}
        disabled={isScanning}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isScanning ? "Scanning..." : "Start Scanning"}
      </button>

      {error && <div className="text-red-500 mt-4">Error: {error}</div>}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">
          Detected Peripheral Devices
        </h2>
        {devices.length === 0 ? (
          <p>No peripheral devices detected yet</p>
        ) : (
          <ul className="space-y-2">
            {devices.map((device: DetectedDevice) => (
              <li key={device.id} className="p-3 border rounded">
                <p>Name: {device.name}</p>
                <p className="text-sm text-gray-600">ID: {device.id}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
