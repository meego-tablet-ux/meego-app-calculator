/*
 * Based on the declarative calculator example in the Qt source tree
 *
 * original copyright:
 * Copyright (C) 2010 Nokia Corporation and/or its subsidiary(-ies)
 *
 * new code copyright:
 * Copyright 2010 Intel Corp.
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms and conditions of the GNU Lesser General Public License,
 * version 2.1, as published by the Free Software Foundation.
 *
 * This program is distributed in the hope it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public
 * License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St - Fifth Floor, Boston, MA 02110-1301 USA.
 *
 */

var curVal = 0
var memory = 0
var lastOp = ""
var timer = 0
var errorFlag = false

function isDigitOrDecimalPoint(str) {
    return (str.toString().length == 1 && ((str >= "0" && str <= "9") || str == localeHelper.decimalPoint()))
}

function indexOfArithmeticOperation(op) {
    var arithmeticOperations = ["+", "-", multiplication, division, "="]
    return arithmeticOperations.indexOf(op)
}

function disabled(op) {
    if (op == localeHelper.decimalPoint() && display.text.toString().search("\\" + localeHelper.decimalPoint()) != -1) {
        // if we're starting a new number, allow it
        if (isDigitOrDecimalPoint(lastOp)) {
            return true
        }
    } else if (errorFlag) {
        if (op != "C" && op != "AC") // The display should stay at "Infinity" unless C or AC is pressed
            return true
    }
    return false
}

function correctText() {
    errorFlag = true
    // correct the output to i18nable string when text
    if ((display.text == "Infinity") || (display.text == "inf")) {
        //: Calculator error reporting positive infinity result (positive overflow)
        //:   See http://www.w3schools.com/jsref/jsref_infinity.asp
        display.text = qsTr("Infinity")
    } else if (display.text == "-Infinity") {
        //: Calculator error reporting negative infinity result (negative overflow)
        display.text = qsTr("-Infinity")
    } else if ((display.text == "NaN") || (display.text == "nan")) {
        //: Calculator error for illegal calculation (e.g. square root of negative number)
        display.text = qsTr("Error")
    } else {
        display.text = display.text.replace(".", localeHelper.decimalPoint())
        errorFlag = false
    }
    if (errorFlag)
        display.currentOperation.text = ""
}

// Perform any input action (number, decimal point, +/- or left arrow)
function doInputOperation(op) {
    var ok = true
    if (isDigitOrDecimalPoint(op)) {
        if (isDigitOrDecimalPoint(lastOp)) {
            // don't append to number if it's too long
            if (display.text.toString().length >= 14)
                return ok;

            display.text = (display.text == "0" && op != localeHelper.decimalPoint() ? op : display.text + op.toString())
        } else {
            display.text = (op == localeHelper.decimalPoint() ? "0":"") + op
        }
        lastOp = op
        correctText()
    } else if (op == plusminus) {
        var index = indexOfArithmeticOperation(lastOp)
        if (index >= 0 && index <= 3) {                             // do not allow to change the sign of the number if the last operation is +, -, * or /
            display.text = "0"
        } else {
            if (display.text.toString().charAt(0) == '-')
                display.text = display.text.toString().substring(1)
            else if (display.text != "0")
                display.text = "-" + display.text
        }
    } else if (op == leftArrow) {
        if (isDigitOrDecimalPoint(lastOp) || lastOp == plusminus) {  // allow to edit the number if the last operation
            var length = display.text.toString().length              // is a digit, +/- or the decimal point only
            if (length == 1 || length == 2 && display.text.toString().charAt(0) == '-' || display.text == ("-0" + localeHelper.decimalPoint())) {
                display.text = "0"
            } else {
                display.text = display.text.toString().slice(0, -1)
            }
        }
    } else {
        ok = false
    }
    return ok
}

// Perform any operation with single operand like abs, sqrt, 1/x and so on
function doSingleOperation(op) {
    var ok = true
    if (op == "1/x") {
        display.text = (1 / display.text.valueOf()).toString()
    } else if (op == "x^2") {
        display.text = (display.text.valueOf() * display.text.valueOf()).toString()
    } else if (op == "Abs") {
        display.text = (Math.abs(display.text.valueOf())).toString()
    } else if (op == "Int") {
        display.text = (Math.floor(display.text.valueOf())).toString()
    } else if (op == squareRoot) {
        display.text = (Math.sqrt(display.text.valueOf())).toString()
    } else {
        ok = false
    }
    if (ok) {
        lastOp = op
        correctText()
    }
    return ok
}

// Perform any operation with two operands like +, -, * or /
function doDoubleOperation(op) {
    var operationIndex = indexOfArithmeticOperation(op)
    if (operationIndex < 0)
        return false

    if (indexOfArithmeticOperation(lastOp) < 0) {                                       // It supports to let users change Calculation symbols
        var curOperationIndex = indexOfArithmeticOperation(display.currentOperation.text)
        switch (curOperationIndex) {
        case 0:                                                                         // +
            display.text = Number(display.text.valueOf()) + Number(curVal.valueOf())
            break
        case 1:                                                                         // -
            display.text = Number(curVal) - Number(display.text.valueOf())
            break
        case 2:                                                                         // multiplication
            display.text = Number(curVal) * Number(display.text.valueOf())
            break
        case 3:                                                                         // division
            display.text = Number(Number(curVal) / Number(display.text.valueOf())).toString()
            break
        }
    }

    if (operationIndex == 4) {                                                      // operation == '='
        curVal = 0
        display.currentOperation.text = ""
    } else {                                                                        // operation == +, -, * or /
        curVal = display.text.valueOf()
        display.currentOperation.text = op
    }
    lastOp = op
    correctText()

    return true
}

function doMemoryOperation(op) {
    var ok = true
    if (op == qsTr("mc")) {
        memory = 0;
    } else if (op == qsTr("m+")) {
        memory += Number(display.text)
    } else if (op == qsTr("mr")) {
        display.text = memory.toString()
    } else if (op == qsTr("m-")) {
        memory -= Number(display.text)
    } else if (op == qsTr("C")) {
        display.text = "0"
    } else if (op == qsTr("AC")) {
        curVal = 0
        memory = 0
        lastOp = ""
        display.text = "0"
        display.currentOperation.text = ""
    } else {
        ok = false
    }
    if (ok) {
        lastOp = op
        correctText()
    }
    return ok
}

function doOperation(op) {
    if (disabled(op)) {
        return
    }

    if (errorFlag)
        errorFlag = false

    if (!doInputOperation(op)) {
        display.text = display.text.replace(localeHelper.decimalPoint(), ".")               // Prepare for calculation
        if (!doSingleOperation(op) && !doMemoryOperation(op) && !doDoubleOperation(op)) {
            if (op == rotateLeft) {
                main.state = 'rotated'
            } else if (op == rotateRight) {
                main.state = ''
            } else {
                console.log("Calculator.js: doOperation - Undefined operation: " + op)
            }
        }
    }
}
