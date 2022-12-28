import { createRollupConfigs } from "../../scripts/rollup/config.js";

import pkg from "./package.json" assert { type: "json" };

export default createRollupConfigs({ pkg });
