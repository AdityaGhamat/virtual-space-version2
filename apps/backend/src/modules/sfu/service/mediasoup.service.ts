import * as mediasoup from "mediasoup";
import { types } from "mediasoup";

const mediaCodecs: types.RtpCodecCapability[] = [
  {
    kind: "audio",
    mimeType: "audio/opus",
    clockRate: 48000,
    channels: 2,
    preferredPayloadType: 111,
  },
  {
    kind: "video",
    mimeType: "video/VP8",
    clockRate: 90000,
    parameters: {
      "x-google-start-bitrate": 1000,
    },
    preferredPayloadType: 96,
  },
];

class MediasoupService {
  workers: types.Worker[] = [];
  nextWorkerIndex = 0;
  routers: Map<string, types.Router> = new Map();

  async init() {
    // SCALABILITY: Use number of CPUs for production
    const numWorkers =
      process.env.NODE_ENV === "production" ? require("os").cpus().length : 1;

    for (let i = 0; i < numWorkers; i++) {
      const worker = await mediasoup.createWorker({
        logLevel: "warn",
        logTags: [
          "info",
          "ice",
          "dtls",
          "rtp",
          "srtp",
          "rtcp",
        ] as types.WorkerLogTag[],
        rtcMinPort: 10000,
        rtcMaxPort: 10200, // IMPORTANT: Open these UDP ports in Docker/Firewall
      });

      worker.on("died", () => {
        console.error(`Worker ${worker.pid} died. Exiting...`);
        process.exit(1);
      });

      this.workers.push(worker);
    }
    console.log(`✅ Mediasoup initialized with ${this.workers.length} workers`);
  }

  // Round-robin strategy for load balancing routers across workers
  getWorker(): types.Worker {
    const worker = this.workers[this.nextWorkerIndex];
    this.nextWorkerIndex = (this.nextWorkerIndex + 1) % this.workers.length;
    return worker;
  }

  async getOrCreateRouter(roomId: string): Promise<types.Router> {
    if (this.routers.has(roomId)) {
      return this.routers.get(roomId)!;
    }

    const worker = this.getWorker();
    const router = await worker.createRouter({ mediaCodecs });

    this.routers.set(roomId, router);
    return router;
  }
}

export const mediasoupService = new MediasoupService();
