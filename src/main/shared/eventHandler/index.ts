import { mainEventHandler } from './main';
import { pluginEventHandler } from './plugin';
import { detachEventHandler } from './detach';
import { developerEventHandler } from './developer';


export default function initEventHandler(){
  mainEventHandler();
  pluginEventHandler();
  detachEventHandler()
  developerEventHandler()
}