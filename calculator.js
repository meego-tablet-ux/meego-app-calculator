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

function disabled(op) {
    if (op == localeHelper.decimalPoint() && display.text.toString().search("\\" + localeHelper.decimalPoint()) != -1) {
        // if we're starting a new number, allow it
        if (lastOp.toString().length == 1 && ((lastOp >= "0" && lastOp <= "9") || lastOp == localeHelper.decimalPoint())) {
            return true
        }
        else {
            return false
        }
    } else if (op == squareRoot &&  display.text.toString().search(/-/) != -1) {
        return true
    } else {
        return false
    }
}

function correctText() {
    // correct the output to i18nable string when text
    if ((display.text == "Infinity") || (display.text == "inf")) {
        display.text = qsTr("Infinity")
    } else if (display.text == "-Infinity") {
        display.text = qsTr("-Infinity")
    } else if ((display.text == "NaN") || (display.text == "nan")) {
        display.text = qsTr("Error")
    }
    display.text = display.text.replace(".", localeHelper.decimalPoint())
}

// Perform any input action (number, decimal point, +/- or left arrow)
function doInputOperation(op) {
    var ok = true
    if (op.toString().length==1 && ((op >= "0" && op <= "9") || op == localeHelper.decimalPoint()) ) {
        if (lastOp.toString().length == 1 && ((lastOp >= "0" && lastOp <= "9") || lastOp == localeHelper.decimalPoint()) ) {
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
        display.text = (Number(display.text) * -1).toString()
    } else if (op == leftArrow) {
        display.text = display.text.toString().slice(0, -1)
    } else {
        display.text = display.text.replace(localeHelper.decimalPoint(), ".") // Prepare for calculation
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
    var arithmeticOperations = ["+", "-", multiplication, division, "="]

    var operationIndex = arithmeticOperations.indexOf(op)
    if (operationIndex < 0)
        return false

    var curOperationIndex = arithmeticOperations.indexOf(display.currentOperation.text)
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

    if (operationIndex != arithmeticOperations.indexOf("=")) { // op != "="
        curVal = display.text.valueOf()
        display.currentOperation.text = op
    } else {                                                  // op == "="
        curVal = 0
        display.currentOperation.text = ""
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
        memory = Number(display.text)
    } else if (op == qsTr("C")) {
        display.text = "0"
        display.currentOperation.text = ""
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

    if (!doInputOperation(op) && !doSingleOperation(op) && !doMemoryOperation(op) && !doDoubleOperation(op)) {
        if (op == rotateLeft) {
            main.state = 'rotated'
        } else if (op == rotateRight) {
            main.state = ''
        } else {
            console.log("Calculator.js: doOperation - Undefined operation: " + op)
        }
    }
}
