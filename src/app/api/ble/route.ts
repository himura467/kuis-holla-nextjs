import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
import bleServer from '../../../ble/main.js';

export async function POST(request: Request) {
  const { action } = await request.json();

  if (action === 'start') {
    const status = bleServer.getServerStatus();
    if (status.isRunning) {
      return NextResponse.json({ status: 'already_running' });
    }

    try {
      const started = bleServer.startBleServer();
      if (started) {
        return NextResponse.json({ status: 'started' });
      } else {
        return NextResponse.json({ status: 'error', message: 'Server already running' }, { status: 500 });
      }
    } catch (error) {
      console.error('Failed to start BLE server:', error);
      return NextResponse.json({ status: 'error', message: (error as Error).message }, { status: 500 });
    }
  }

  if (action === 'stop') {
    const stopped = bleServer.stopBleServer();
    if (stopped) {
      return NextResponse.json({ status: 'stopped' });
    }
    return NextResponse.json({ status: 'not_running' });
  }

  if (action === 'status') {
    const status = bleServer.getServerStatus();
    return NextResponse.json({ 
      status: status.isRunning ? 'running' : 'stopped',
      isAdvertising: status.isAdvertising
    });
  }

  return NextResponse.json({ status: 'invalid_action' }, { status: 400 });
}
