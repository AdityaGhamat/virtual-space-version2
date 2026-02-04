import httpServer from "./app";
import env from "./modules/core/utility/env";
import ValidEnv from "./modules/core/validation/env";
import { mediasoupService } from "./modules/sfu/service/mediasoup.service";

async function start() {
  try {
    console.log(`Starting in mode: ${process.env.NODE_ENV}`);

    await mediasoupService.init();
    console.log("✅ Mediasoup Workers Initialized");

    httpServer.listen(Number(env.PORT), "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${Number(env.PORT)}`);
      console.log("---------------------------------------");
    });
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
}

start();
