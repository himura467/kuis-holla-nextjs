import { NextResponse } from "next/server";
import bleServer from "../../../../ble/main.js";

export const runtime = "nodejs";

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Listen for characteristic writes
      bleServer.bleEvents.on("characteristicWrite", (value: string) => {
        controller.enqueue(encoder.encode(`data: ${value}\n\n`));
      });
    },
    cancel() {
      bleServer.bleEvents.removeAllListeners("characteristicWrite");
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
