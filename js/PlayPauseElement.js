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
var PlayStop = function (htmlElement, onPlay, onStop) {
    this.htmlElement = htmlElement;
    //TODO: Think about replacing by some fancy graphic or stuff.
    this._pEl = document.createElement('p');
    this.htmlElement.appendChild(this._pEl);

    onStpo(this);
    this.isPlay = 0;

    var that = this;
    this.htmlElement.addEventListener('click', function() {
        this.isPlay = !this.isPlay;
        this.isPlay ? onPlay(that) : onStop(that);
    });
};

PlayStopElement.prototype.setText = function (text) {
    this._pEl.innerHTML = text;
}


