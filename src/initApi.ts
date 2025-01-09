import get from "./knex.js";
import EcosystemDatabase from "./modules/EcosystemDatabase.js";
import linkApiModules from "./modules/factory.js";
import defaultSettings from "./modules/default.config.js";
import { ModulesConfig } from "./modules/ModulesConfig.js";

export default async (settings: ModulesConfig = defaultSettings) => {
  const db = new EcosystemDatabase(get());
  return await linkApiModules(db, settings);
};
