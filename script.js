const display = document.querySelector('input[name="display"]');
const ERROR = 'Error';

// Evaluates expressions with + - * / and decimals, without using eval().
function calculate(expression) {
    const tokens = expression.match(/\d+\.?\d*|\.\d+|[+\-*/]/g);
    if (!tokens || tokens.join('') !== expression) {
        throw new Error('Invalid expression');
    }

    let pos = 0;

    function number() {
        const token = tokens[pos++];
        if (token === '-') return -number();
        if (token === '+') return number();
        if (token === undefined || '*/'.includes(token)) {
            throw new Error('Invalid expression');
        }
        return parseFloat(token);
    }

    function term() {
        let value = number();
        while (tokens[pos] === '*' || tokens[pos] === '/') {
            const op = tokens[pos++];
            value = op === '*' ? value * number() : value / number();
        }
        return value;
    }

    function sum() {
        let value = term();
        while (tokens[pos] === '+' || tokens[pos] === '-') {
            const op = tokens[pos++];
            value = op === '+' ? value + term() : value - term();
        }
        return value;
    }

    const result = sum();
    if (pos !== tokens.length || !Number.isFinite(result)) {
        throw new Error('Invalid expression');
    }

    // Avoids results like 0.1 + 0.2 = 0.30000000000000004
    return parseFloat(result.toPrecision(12));
}

function press(value, action) {
    if (display.value === ERROR) display.value = '';

    if (action === 'clear') {
        display.value = '';
    } else if (action === 'delete') {
        display.value = display.value.slice(0, -1);
    } else if (action === 'equals') {
        if (display.value === '') return;
        try {
            display.value = calculate(display.value);
        } catch {
            display.value = ERROR;
        }
    } else {
        display.value += value;
    }
}

document.querySelectorAll('form input[type="button"]').forEach(button => {
    button.addEventListener('click', () => press(button.value, button.dataset.action));
});

document.addEventListener('keydown', event => {
    if (/^[0-9.+\-*/]$/.test(event.key)) press(event.key);
    else if (event.key === 'Enter' || event.key === '=') press('', 'equals');
    else if (event.key === 'Backspace') press('', 'delete');
    else if (event.key === 'Escape') press('', 'clear');
    else return;
    event.preventDefault();
});
