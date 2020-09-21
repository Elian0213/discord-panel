import * as fs from 'fs';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
export default class ConfigService<T> {
  /**
   * Load config from a filepath.
   * @param path to file where config json file is specified.
   */
  loadConfigFromPath = (path: string): T => JSON.parse(fs.readFileSync(path).toString()) as T
}
