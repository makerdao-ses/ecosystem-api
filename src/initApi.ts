import initKnex from './initKnex.js';
import EcosystemDatabase from './modules/EcosystemDatabase.js';
import linkApiModules from "./modules/factory.js";
import defaultSettings from "./modules/default.config.js";
import { ModulesConfig } from "./modules/ModulesConfig.js";

export default async (settings:ModulesConfig = defaultSettings) => {
    const db = new EcosystemDatabase(initKnex());
    return await linkApiModules(db, settings);
};