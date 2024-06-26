import {
  API,
  DynamicPlatformPlugin,
  Logger,
  PlatformAccessory,
  PlatformConfig,
  Service,
  Characteristic,
} from "homebridge";

import { PLATFORM_NAME, PLUGIN_NAME } from "./settings";
import { LedCatAccessory } from "./platformAccessory";

/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
export class LedCatPlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic =
    this.api.hap.Characteristic;

  // this is used to track restored cached accessories
  public readonly accessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API
  ) {
    this.log.debug("Finished initializing platform:", this.config.name);
    this.log.debug("I got here asdasdasdasd");

    this.api.on("didFinishLaunching", () => {
      log.debug("Executed didFinishLaunching callback");
      // run the method to discover / register your devices as accessories
      this.discoverDevices(this.config);
    });
  }

  configureAccessory(accessory: PlatformAccessory) {
    this.log.info("Loading accessory from cache:", accessory.displayName);

    // add the restored accessory to the accessories cache, so we can track if it has already been registered
    this.accessories.push(accessory);
  }

  discoverDevices(config: PlatformConfig) {
    // each device has a lockID, name, key and token
    const uuid = this.api.hap.uuid.generate(config.name || "initial");

    const existingAccessory = this.accessories.find(
      (accessory) => accessory.UUID === uuid
    );

    if (existingAccessory) {
      // the accessory already exists
      this.log.info("Restoring existing accessory from cache:", config.name);

      new LedCatAccessory(this, existingAccessory);
    } else {
      // the accessory does not yet exist, so we need to create it
      this.log.info("Adding new accessory:", config.name);

      // create a new accessory
      const accessory = new this.api.platformAccessory(
        config.name || "initial",
        uuid
      );

      // store a copy of the device object in the `accessory.context`
      // the `context` property can be used to store any data about the accessory you may need
      accessory.context.device = config;

      new LedCatAccessory(this, accessory);

      // link the accessory to your platform
      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [
        accessory,
      ]);
    }
  }
}
