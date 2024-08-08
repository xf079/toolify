import { mainEventHandler } from './main';
import { developerEventHandler } from './developer';


export default function initEventHandler(){
  mainEventHandler();
  developerEventHandler()
}