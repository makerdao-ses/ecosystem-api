export interface ModulesConfig {
  [key: string]: ModulesConfigEntry;
}

interface ModulesConfigEntry {
  enabled: boolean;
  require?: string[];
}
