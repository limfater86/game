import './css/app.css'
import './src/resources'

import {welcomeScene} from "./src/welcome";


resources.load([
    'assets/Background.png',
    'assets/field.png',
    'assets/button.png',
    'assets/button2.png',
    'assets/background_progress.png',
    'assets/progress.png',
    'assets/scorepanel.png',
    'assets/bonus.png',
    'assets/money.png',
    'assets/money2.png',
    'assets/pause.png',
    'assets/button_plus.png',
    'assets/blocks.png',
    'assets/button.png',
    'assets/button_plus.png',

]);
resources.onReady(init);

function init() {
    welcomeScene.init();
}


