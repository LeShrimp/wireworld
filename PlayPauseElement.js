/**
 *
 * Created by maxime on 6/28/14.
 */

/**
 *
 * @param htmlElement
 * @param onPlay
 * @param onPause
 * @constructor
 */
var PlayPauseElement = function (htmlElement, onPlay, onPause) {
    this.htmlElement = htmlElement;
    this.isPlay = 0;

    this.htmlElement.addEventListener('click', function() {
        this.isPlay = !this.isPlay;
        this.isPlay ? onPlay() : onPause();
    });
};


