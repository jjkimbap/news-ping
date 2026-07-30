import { app } from "./app.js";
import { config } from "./common/config.js";

app.listen(config.port, () => {
  console.log(`API server listening on http://localhost:${config.port}`);
});
