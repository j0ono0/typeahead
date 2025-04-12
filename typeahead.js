
class Typeahead {
    constructor(selector) {
        var instance = this;
        this.timer;
        this.delay = 1000;
        this.target = document.querySelector(selector);
        this.target.addEventListener('input', this.inputListener.bind(this));
    }
    inputListener(evt) {
        // console.log(evt)
        var instance = this;
        clearTimeout(instance.timer);
        this.timer = setTimeout(this.action.bind(this), this.delay);
    }
    action() {
        alert("typing paused, input: " + this.target.value)
    }
}

move_title_typeahead = new Typeahead("#movie_title");

