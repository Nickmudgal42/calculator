class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.shouldResetScreen) return;
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.shouldResetScreen || this.currentOperand === '0') {
            this.currentOperand = number.toString();
            this.shouldResetScreen = false;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
            case '*':
                computation = prev * current;
                break;
            case '÷':
            case '/':
                if (current === 0) {
                    alert("Error: Division by zero");
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Limit decimal places to avoid overflow issues
        this.currentOperand = parseFloat(computation.toFixed(10)).toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// UI Selectors
let calculator;

if (typeof document !== 'undefined') {
    const numberButtons = document.querySelectorAll('[data-number]');
    const operationButtons = document.querySelectorAll('[data-operation]');
    const equalsButton = document.querySelector('[data-equals]');
    const deleteButton = document.querySelector('[data-delete]');
    const clearButton = document.querySelector('[data-clear]');
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');

    if (previousOperandElement && currentOperandElement) {
        calculator = new Calculator(previousOperandElement, currentOperandElement);

        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                calculator.appendNumber(button.innerText);
                calculator.updateDisplay();
            });
        });

        operationButtons.forEach(button => {
            button.addEventListener('click', () => {
                calculator.chooseOperation(button.innerText);
                calculator.updateDisplay();
            });
        });

        if (equalsButton) {
            equalsButton.addEventListener('click', button => {
                calculator.compute();
                calculator.updateDisplay();
            });
        }

        if (clearButton) {
            clearButton.addEventListener('click', button => {
                calculator.clear();
                calculator.updateDisplay();
            });
        }

        if (deleteButton) {
            deleteButton.addEventListener('click', button => {
                calculator.delete();
                calculator.updateDisplay();
            });
        }
    }
}

// Keyboard Support
if (typeof window !== 'undefined') {
    window.addEventListener('keydown', e => {
        if (!calculator) return;
        if (e.key >= 0 && e.key <= 9) calculator.appendNumber(e.key);
        if (e.key === '.') calculator.appendNumber('.');
        if (e.key === '=' || e.key === 'Enter') calculator.compute();
        if (e.key === 'Backspace') calculator.delete();
        if (e.key === 'Escape') calculator.clear();
        if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            let op = e.key;
            if (op === '*') op = '×';
            if (op === '/') op = '÷';
            calculator.chooseOperation(op);
        }
        calculator.updateDisplay();
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculator;
}
