const stateBase = {};
const subscribers = [];

const notify = (state) => {
    if (subscribers.length > 0) {
        subscribers.forEach(subscriber => subscriber.render(state));
    }
    console.info('Updated state', state);
};


class ListElement {
    constructor(selector) {
        this.container = document.getElementById(selector);
    }
    render(state) {
        this.container.innerHTML = `<ul>${state.list.map(f => `<li>${f}</li>`).join("\n")}</ul>`;
    }
}

const state = new Proxy(stateBase, {
    set(target, p, value, receiver) {
        target[p] = value;
        notify(target);
    },
    get(target, p, receiver) {
        return target[p];
    }
});

subscribers.push(new ListElement('list-container'));

state.list = ['pepeni', 'schnepeini'];


/** Some generic listener to be able to add to our variable */
const fruitInput = document.getElementById('fruit-input');

fruitInput.onkeypress = (e) => {
    if (e.key === 'Enter') {
        const existing = state.list;
        //state.list.push(fruitInput.value);
        state.list = [...existing, fruitInput.value];
        fruitInput.value = null;
    }
}
