"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface ServerStatus {
  status: "running" | "stopped" | "error";
  message?: string;
}

export default function PeripheralPage() {
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    status: "stopped",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [centralUserId, setCentralUserId] = useState<string | null>(null);

  // Fetch user ID when component mounts
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
        setServerStatus({
          status: "error",
          message: "Failed to fetch user ID",
        });
      }
    };

    fetchUserId();
  }, []);

  // Set up SSE listener for BLE events
  useEffect(() => {
    if (serverStatus.status !== "running") return;

    const eventSource = new EventSource("/api/ble/events");
    eventSource.onmessage = (event) => {
      console.log("Received central userId:", event.data);
      setCentralUserId(event.data);
    };

    return () => {
      eventSource.close();
      setCentralUserId(null);
    };
  }, [serverStatus.status]);

  // Start BLE server when userId is available
  useEffect(() => {
    if (!userId) return;

    const startServerWithUserId = async () => {
      try {
        const response = await fetch("/api/ble", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "start",
            userId: userId,
          }),
        });
        const data = await response.json();

        if (data.status === "started" || data.status === "already_running") {
          setServerStatus({ status: "running" });
        } else {
          setServerStatus({
            status: "error",
            message: data.message || "Failed to start server",
          });
        }
      } catch (error) {
        setServerStatus({
          status: "error",
          message: (error as Error).message,
        });
      }
    };

    startServerWithUserId();

    // Cleanup on unmount
    return () => {
      stopServer();
      setCentralUserId(null); // Clear the central user ID when stopping
    };
  }, [userId]);

  // Periodically check server status
  useEffect(() => {
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const response = await fetch("/api/ble", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "status" }),
      });
      const data = await response.json();
      setServerStatus({ status: data.status });
    } catch (error) {
      setServerStatus({
        status: "error",
        message: (error as Error).message,
      });
    }
  };

  const startServer = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/ble", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "start",
          userId: userId,
        }),
      });
      const data = await response.json();

      if (data.status === "started" || data.status === "already_running") {
        setServerStatus({ status: "running" });
      } else {
        setServerStatus({
          status: "error",
          message: data.message || "Failed to start server",
        });
      }
    } catch (error) {
      setServerStatus({
        status: "error",
        message: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopServer = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/ble", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "stop" }),
      });
      const data = await response.json();

      if (data.status === "stopped" || data.status === "not_running") {
        setServerStatus({ status: "stopped" });
        setCentralUserId(null); // Clear the central user ID when server stops
      } else {
        setServerStatus({
          status: "error",
          message: data.message || "Failed to stop server",
        });
      }
    } catch (error) {
      setServerStatus({
        status: "error",
        message: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (serverStatus.status) {
      case "running":
        return "bg-green-500";
      case "stopped":
        return "bg-gray-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">BLE Peripheral Server</h1>

      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
          <span className="font-semibold">
            Status:{" "}
            {serverStatus.status.charAt(0).toUpperCase() +
              serverStatus.status.slice(1)}
          </span>
        </div>
        {serverStatus.message && (
          <div className="text-red-500 text-sm">{serverStatus.message}</div>
        )}
      </div>

      <div className="space-x-2">
        <button
          onClick={startServer}
          disabled={isLoading || serverStatus.status === "running"}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Start Server
        </button>
        <button
          onClick={stopServer}
          disabled={isLoading || serverStatus.status === "stopped"}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Stop Server
        </button>
      </div>

      {serverStatus.status === "running" && userId && (
        <div className="mt-6 p-4 border rounded bg-green-50">
          <h2 className="text-lg font-semibold mb-2">Server Information</h2>
          <div className="space-y-2">
            <p>Name: KuisHolla</p>
            <p>Service UUID: 00000000-0000-0000-0000-000000000000</p>
            <p>Characteristic UUID: 00000001-0000-0000-0000-000000000000</p>
            <p>My User ID: {userId}</p>
            {centralUserId && (
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <h3 className="font-semibold mb-2">話しかけてきたユーザー</h3>
                <p>User ID: {centralUserId}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
