const bleno = require('bleno');

// BLE service and characteristic UUIDs (valid UUID format)
const SERVICE_UUID = '00000000-0000-0000-0000-000000000000';
const CHARACTERISTIC_UUID = '00000001-0000-0000-0000-000000000000';

// Advertisement name
const PERIPHERAL_NAME = 'KuisHolla';

// State management
let isAdvertising = false;

// Primary service
class CustomService extends bleno.PrimaryService {
  constructor() {
    super({
      uuid: SERVICE_UUID,
      characteristics: [
        new CustomCharacteristic()
      ]
    });
  }
}

// Custom characteristic
class CustomCharacteristic extends bleno.Characteristic {
  constructor() {
    super({
      uuid: CHARACTERISTIC_UUID,
      properties: ['read', 'write', 'notify'],
      value: null
    });
    this._value = Buffer.from('Hello from KuisHolla!');
  }

  onReadRequest(offset, callback) {
    console.log('Read request received');
    callback(this.RESULT_SUCCESS, this._value);
  }

  onWriteRequest(data, offset, withoutResponse, callback) {
    console.log('Write request received:', data.toString());
    this._value = data;
    callback(this.RESULT_SUCCESS);
  }
}

// State change handler
bleno.on('stateChange', (state) => {
  console.log('Bluetooth state changed to:', state);

  if (state === 'poweredOn') {
    // Start advertising when Bluetooth is powered on
    bleno.startAdvertising(PERIPHERAL_NAME, [SERVICE_UUID], (error) => {
      if (error) {
        console.error('Failed to start advertising:', error);
      } else {
        console.log('Started advertising as:', PERIPHERAL_NAME);
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
bleno.on('advertisingStart', (error) => {
  if (error) {
    console.error('Failed to start advertising:', error);
    return;
  }

  console.log('Advertising started successfully');
  
  // Set up services once advertising has started
  bleno.setServices([
    new CustomService()
  ], (error) => {
    if (error) {
      console.error('Failed to set services:', error);
    } else {
      console.log('Services set up successfully');
    }
  });
});

// Accept handler
bleno.on('accept', (clientAddress) => {
  console.log('Client connected:', clientAddress);
});

// Disconnect handler
bleno.on('disconnect', (clientAddress) => {
  console.log('Client disconnected:', clientAddress);
});

// Error handler
bleno.on('error', (error) => {
  console.error('BLE error occurred:', error);
});

console.log('BLE peripheral server starting...');
