import utils from './Core/utils.js';
import Core from './Core/Core.js';

function init() {
  const core = new Core({
    element: utils.htmlElements.gameContainer(),
  });

  core.init();
}
init();
