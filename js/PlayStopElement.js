/**
 *
 * Created by maxime on 6/28/14.
 */

/**
 *
 * @param htmlElement
 * @param onPlay
 * @param onStop
 * @constructor
 */
var PlayStopElement = function (htmlElement, onPlay, onStop) {
    this.htmlElement = htmlElement;
    //TODO: Think about replacing by some fancy graphic or stuff.
    this._pEl = document.createElement('p');
    this.htmlElement.appendChild(this._pEl);
    this.onPlay = onPlay;
    this.onStop = onStop;

    this.onStop();
    this.isPlay = 0;

    var that = this;
    this.htmlElement.addEventListener('click', function() {
        that.isPlay = !that.isPlay;
        that.isPlay ? that.onPlay() : that.onStop();
    });
};

PlayStopElement.prototype.setText = function (text) {
    this._pEl.innerHTML = text;
}


