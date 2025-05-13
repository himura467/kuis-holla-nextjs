// Extend the global JSX namespace
declare global {
  interface Navigator {
    bluetooth: BluetoothAPI;
  }

  interface BluetoothAPI {
    requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
    getAvailability(): Promise<boolean>;
  }

  type BluetoothServiceUUID = number | string;

  interface RequestDeviceOptions {
    acceptAllDevices?: boolean;
    filters?: Array<{
      services?: BluetoothServiceUUID[];
      name?: string;
      namePrefix?: string;
      manufacturerId?: number;
    }>;
    optionalServices?: BluetoothServiceUUID[];
  }

  interface BluetoothDevice {
    id: string;
    name: string | null;
    gatt?: {
      connect(): Promise<BluetoothRemoteGATTServer>;
    };
  }

  interface BluetoothRemoteGATTServer {
    connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
  }
}

// Export an empty object to make this file a module
export {};
