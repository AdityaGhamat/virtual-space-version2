import httpServer from "./app";
import env from "./modules/core/utility/env";
import { mediasoupService } from "./modules/sfu/service/mediasoup.service";
async function start() {
  try {
    await mediasoupService.init();
    console.log("✅ Mediasoup Workers Initialized");
    httpServer.listen(Number(env.PORT), () => {
      console.log(`🚀 Server running on http://localhost:${Number(env.PORT)}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
}

start().then(() => {
  console.log("all done");
});
