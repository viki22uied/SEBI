import "dotenv/config";
import http from "http";
import app from "./app";

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

const server = http.createServer(app);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`SEBI Guardian API running on http://localhost:${port}`);
});

