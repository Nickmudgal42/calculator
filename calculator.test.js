
const Calculator = require('./script.js');

describe('Calculator', () => {
    let calculator;
    let previousOperandElement;
    let currentOperandElement;

    beforeEach(() => {
        // Mock DOM elements
        previousOperandElement = { innerText: '' };
        currentOperandElement = { innerText: '' };
        calculator = new Calculator(previousOperandElement, currentOperandElement);
    });

    test('should initialize with clear state', () => {
        expect(calculator.currentOperand).toBe('0');
        expect(calculator.previousOperand).toBe('');
        expect(calculator.operation).toBeUndefined();
    });

    test('appendNumber should append numbers to current operand', () => {
        calculator.appendNumber(1);
        expect(calculator.currentOperand).toBe('1');
        calculator.appendNumber(2);
        expect(calculator.currentOperand).toBe('12');
    });

    test('appendNumber should handle decimal points', () => {
        calculator.appendNumber(1);
        calculator.appendNumber('.');
        calculator.appendNumber(2);
        expect(calculator.currentOperand).toBe('1.2');
    });

    test('appendNumber should prevent multiple decimal points', () => {
        calculator.appendNumber(1);
        calculator.appendNumber('.');
        calculator.appendNumber(2);
        calculator.appendNumber('.');
        expect(calculator.currentOperand).toBe('1.2');
    });

    test('appendNumber should replace 0 with number', () => {
        calculator.appendNumber(0);
        expect(calculator.currentOperand).toBe('0');
        calculator.appendNumber(5);
        expect(calculator.currentOperand).toBe('5');
    });

    test('chooseOperation should set operation and move current to previous', () => {
        calculator.appendNumber(1);
        calculator.chooseOperation('+');
        expect(calculator.operation).toBe('+');
        expect(calculator.previousOperand).toBe('1');
        expect(calculator.currentOperand).toBe('');
    });

    test('chooseOperation should compute if previous operand exists', () => {
        calculator.appendNumber(1);
        calculator.chooseOperation('+');
        calculator.appendNumber(2);
        calculator.chooseOperation('-');
        expect(calculator.previousOperand).toBe('3');
        expect(calculator.operation).toBe('-');
        expect(calculator.currentOperand).toBe('');
    });

    test('compute should perform addition', () => {
        calculator.appendNumber(1);
        calculator.chooseOperation('+');
        calculator.appendNumber(2);
        calculator.compute();
        expect(calculator.currentOperand).toBe('3');
        expect(calculator.operation).toBeUndefined();
        expect(calculator.previousOperand).toBe('');
    });

    test('compute should perform subtraction', () => {
        calculator.appendNumber(5);
        calculator.chooseOperation('-');
        calculator.appendNumber(2);
        calculator.compute();
        expect(calculator.currentOperand).toBe('3');
    });

    test('compute should perform multiplication', () => {
        calculator.appendNumber(3);
        calculator.chooseOperation('*');
        calculator.appendNumber(4);
        calculator.compute();
        expect(calculator.currentOperand).toBe('12');
    });

    test('compute should perform division', () => {
        calculator.appendNumber(10);
        calculator.chooseOperation('/');
        calculator.appendNumber(2);
        calculator.compute();
        expect(calculator.currentOperand).toBe('5');
    });

    test('compute should handle division by zero', () => {
        // Mock alert since it's called in division by zero
        global.alert = jest.fn();

        calculator.appendNumber(10);
        calculator.chooseOperation('/');
        calculator.appendNumber(0);
        calculator.compute();

        expect(global.alert).toHaveBeenCalledWith("Error: Division by zero");
        expect(calculator.currentOperand).toBe('0'); // Cleared state
    });

    test('delete should remove last digit', () => {
        calculator.appendNumber(123);
        calculator.delete();
        expect(calculator.currentOperand).toBe('12');
    });

    test('delete should reset to 0 if one digit left', () => {
        calculator.appendNumber(5);
        calculator.delete();
        expect(calculator.currentOperand).toBe('0');
    });

    test('delete should do nothing if current operand is 0', () => {
        calculator.delete();
        expect(calculator.currentOperand).toBe('0');
    });

    test('clear should reset everything', () => {
        calculator.appendNumber(1);
        calculator.chooseOperation('+');
        calculator.appendNumber(2);
        calculator.clear();
        expect(calculator.currentOperand).toBe('0');
        expect(calculator.previousOperand).toBe('');
        expect(calculator.operation).toBeUndefined();
    });

    test('updateDisplay should update DOM elements', () => {
        calculator.appendNumber(1234);
        calculator.updateDisplay();
        expect(currentOperandElement.innerText).toBe('1,234'); // 1,234 formatted

        calculator.chooseOperation('+');
        calculator.updateDisplay();
        expect(previousOperandElement.innerText).toBe('1,234 +');
    });
});
