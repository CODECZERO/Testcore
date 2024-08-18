import { Router } from "express";
import { metric } from "../services/logging and monitoring/Grafana/grafana.service.js";
const router = Router();

router.route("/metric").get(metric);


export default router;
