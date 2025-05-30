// eslint-disable-next-line @typescript-eslint/no-require-imports
const bleno = require("bleno");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const EventEmitter = require("events");

const bleEvents = new EventEmitter();

// BLE service and characteristic UUIDs (valid UUID format)
const SERVICE_UUID = "00000000-0000-0000-0000-000000000000";
const CHARACTERISTIC_UUID = "00000001-0000-0000-0000-000000000000";
const PERIPHERAL_NAME = "KuisHolla";

// State management
let isAdvertising = false;
let blenoInstance = null;
let userId = null;

// Custom characteristic
class CustomCharacteristic extends bleno.Characteristic {
  constructor(userId, onWriteCallback) {
    super({
      uuid: CHARACTERISTIC_UUID,
      properties: ["read", "write", "notify"],
      value: null,
    });
    this._value = Buffer.from("no-user-id");
    this._userId = userId;
    this._onWriteCallback = onWriteCallback;
  }

  onReadRequest(offset, callback) {
    console.log("Read request received");
    console.log("User ID:", this._userId);
    callback(this.RESULT_SUCCESS, Buffer.from(this._userId));
  }

  onWriteRequest(data, offset, withoutResponse, callback) {
    console.log("Write request received:", data.toString());
    this._value = data;
    bleEvents.emit("characteristicWrite", data.toString());
    callback(this.RESULT_SUCCESS);
  }
}

// Primary service
class CustomService extends bleno.PrimaryService {
  constructor(userId, onWriteCallback) {
    super({
      uuid: SERVICE_UUID,
      characteristics: [new CustomCharacteristic(userId, onWriteCallback)],
    });
  }
}

function setupBlenoEventHandlers(userId, onWriteCallback) {
  // State change handler
  bleno.on("stateChange", (state) => {
    console.log("Bluetooth state changed to:", state);

    if (state === "poweredOn") {
      // Start advertising when Bluetooth is powered on
      bleno.startAdvertising(PERIPHERAL_NAME, [SERVICE_UUID], (error) => {
        if (error) {
          console.error("Failed to start advertising:", error);
        } else {
          console.log("Started advertising as:", PERIPHERAL_NAME);
          isAdvertising = true;
        }
      });
    } else {
      // Stop advertising if Bluetooth is not powered on
      if (isAdvertising) {
        bleno.stopAdvertising();
        isAdvertising = false;
      }
    }
  });

  // Advertising start handler
  bleno.on("advertisingStart", (error) => {
    if (error) {
      console.error("Failed to start advertising:", error);
      return;
    }

    console.log("Advertising started successfully");

    // Set up services once advertising has started
    bleno.setServices([new CustomService(userId, onWriteCallback)], (error) => {
      if (error) {
        console.error("Failed to set services:", error);
      } else {
        console.log("Services set up successfully");
      }
    });
  });

  // Accept handler
  bleno.on("accept", (clientAddress) => {
    console.log("Client connected:", clientAddress);
  });

  // Disconnect handler
  bleno.on("disconnect", (clientAddress) => {
    console.log("Client disconnected:", clientAddress);
  });

  // Error handler
  bleno.on("error", (error) => {
    console.error("BLE error occurred:", error);
  });

  blenoInstance = bleno;
}

function startBleServer(options = {}) {
  if (!blenoInstance) {
    userId = options.userId || "no-user-id";
    setupBlenoEventHandlers(userId);
    console.log("BLE peripheral server starting with userId:", userId);
    return true;
  }
  return false;
}

function stopBleServer() {
  if (blenoInstance && isAdvertising) {
    blenoInstance.stopAdvertising();
    isAdvertising = false;
    blenoInstance.disconnect();
    blenoInstance = null;
    return true;
  }
  return false;
}

function getServerStatus() {
  return {
    isRunning: !!blenoInstance,
    isAdvertising,
  };
}

module.exports = {
  startBleServer,
  stopBleServer,
  getServerStatus,
  bleEvents,
};

// If this file is run directly with node, start the server
if (require.main === module) {
  startBleServer();
}
