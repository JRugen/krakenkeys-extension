import { config, library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowTrendDown,
  faArrowUpRightFromSquare,
  faBell,
  faCheck,
  faChevronDown,
  faCircleCheck,
  faCircleInfo,
  faCopy,
} from '@fortawesome/free-solid-svg-icons';

config.autoAddCss = false;

library.add(
  faArrowTrendDown,
  faArrowUpRightFromSquare,
  faBell,
  faCheck,
  faChevronDown,
  faCircleCheck,
  faCircleInfo,
  faCopy,
);

export { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
