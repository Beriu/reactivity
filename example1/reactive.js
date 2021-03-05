/**
 * @class Subject
 * @property {Array} observers
 */
class Observable {

    constructor() {
        this.observers = [];
    }

    addSubscriber(observer) {
        this.observers.push(observer);
    }

    removeSubscriber(observer) {
        const removeIndex = this.observers.findIndex(obs => observer === obs);

        if (removeIndex !== -1) {
            this.observers = this.observers.slice(removeIndex, 1);
        }
    }

    notify(data) {
        if (this.observers.length > 0) {
            this.observers.forEach(observer => observer.update(data));
        }
    }
}

/** @class Observer */
class Subscriber {
    update() {}
}

/**
 * @class State
 * @property {Object} state
 */
class State extends Observable {

    state = {};

    constructor(data = {}) {
        super();
        this.update(data);
    }

    update(data) {
        this.state = Object.assign(this.state, data);
        this.notify(this.state);
    }

    get(prop = null) {
        if(!prop) return this.state;
        if(this.state?.[prop]) return this.state[prop];
        throw new Error(`${prop} doesn't exist on state object.`)
    }
}

class ListElement extends Subscriber {

    constructor(selector, stateProp) {
        super();
        this.selector = selector;
        this.stateProp = stateProp;
    }

    createMarkup(state) {
        return `
            <ul style="${this.style}">
                ${state[this.stateProp].map(f => `<li>${f}</li>`).join("\n")}
            </ul>
        `;
    }

    get style() {
        return `
            list-style: none;
            font-size: 24px;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            text-align: center;
        `;
    }

    render(state) {
        const markup = this.createMarkup(state);
        const parent = document.getElementById(this.selector);
        parent.innerHTML = markup;
    }

    update(state) {
        this.render(state);
    }
}

const store = new State({ fruits: ['apples', 'pares', 'tomatoes', 'kiwis'] });

const fruitList = new ListElement('list-container', 'fruits');

store.addSubscriber(fruitList);

//TODO: render on subscribe
fruitList.render(store.get());


/** Some generic listener to be able to add to our variable */
const fruitInput = document.getElementById('fruit-input');

fruitInput.onkeypress = (e) => {
    if(e.key === 'Enter') {
        store.update({ fruits: [...store.get('fruits'), fruitInput.value] });
        fruitInput.value = null;
    }
}

