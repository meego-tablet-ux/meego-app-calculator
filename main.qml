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

import Qt 4.7
import MeeGo.Labs.Components 0.1 as Labs
import MeeGo.Components 0.1
import "calculator.js" as CalcEngine

Window {
    id: window

    property string rotateLeft: "\u2939"
    property string rotateRight: "\u2935"
    property string leftArrow: "\u2190"
    property string division : "\u00f7"
    property string multiplication : "\u00d7"
    property string squareRoot : "\u221a"
    property string plusminus : "\u00b1"

    function doOp(operation) { CalcEngine.doOperation(operation) }

    property variant display

    resources: [
        Labs.LocaleHelper {
            id: localeHelper
        }
    ]

    SaveRestoreState {
        id: calcState
        onSaveRequired: {
            setValue("memory", CalcEngine.memory)
            setValue("curVal", CalcEngine.curVal)
            setValue("lastOp", CalcEngine.lastOp)
            setValue("timer", CalcEngine.timer)
            setValue("errorFlag", CalcEngine.errorFlag)
            setValue("displayText", display.text)
            setValue("displayCurrentOperation", display.currentOperation.text)
            sync()
        }
    }

    Component.onCompleted: {
        if (calcState.restoreRequired) {
            CalcEngine.memory = calcState.value("memory", 0)
            CalcEngine.curVal = calcState.value("curVal", 0)
            CalcEngine.lastOp = calcState.value("lastOp", "")
            CalcEngine.timer = calcState.value("timer", 0)
            CalcEngine.errorFlag = calcState.value("errorFlag", false)
        }
        switchBook(page)
    }

    Component {
        id: page
        AppPage {
            id: appPage
            pageTitle: qsTr("Calculator")
            Item {
                id: main
                anchors.fill: parent

                Component.onCompleted: {
                    window.display = display
                    display.text = calcState.value("displayText", "")
                    display.currentOperation.text = calcState.value("displayCurrentOperation", "")
                }

                Column {
                    id: box; spacing: 8
                    anchors {
                        top: parent.top
                        bottom: parent.bottom
                        bottomMargin: 6
                        left: parent.left
                        leftMargin: 6
                        right: parent.right
                        rightMargin: 6
                    }

                    Row {
                        Display { id: display; width: box.width; height: 64 }
                    }

                    Column {
                        id: column; spacing: 6

                        property real h: ((box.height - 72) / 6) - ((spacing * (6 - 1)) / 6)
                        property real w: (box.width / 4) - ((spacing * (4 - 1)) / 4)

                        Row {
                            spacing: 6

                            CalcButton { width: column.w; height: column.h; color: 'purple'; operation: leftArrow }
                            CalcButton { width: column.w; height: column.h; color: 'purple'; operation: qsTr("C") }
                            CalcButton { width: column.w; height: column.h; color: 'purple'; operation: qsTr("AC") }
                        }

                        Row {
                            spacing: 6
                            property real w: (box.width / 4) - ((spacing * (4 - 1)) / 4)

                            CalcButton { width: column.w; height: column.h; color: 'green'; operation: qsTr("mc") }
                            CalcButton { width: column.w; height: column.h; color: 'green'; operation: qsTr("m+") }
                            CalcButton { width: column.w; height: column.h; color: 'green'; operation: qsTr("m-") }
                            CalcButton { width: column.w; height: column.h; color: 'green'; operation: qsTr("mr") }
                        }

                        Grid {
                            id: grid; rows: 4; columns: 5; spacing: 6

                            property real w: (box.width / columns) - ((spacing * (columns - 1)) / columns)

                            CalcButton { width: grid.w; height: column.h; operation: "7"; color: 'blue' }
                            CalcButton { width: grid.w; height: column.h; operation: "8"; color: 'blue' }
                            CalcButton { width: grid.w; height: column.h; operation: "9"; color: 'blue' }
                            CalcButton { width: grid.w; height: column.h; operation: division }
                            CalcButton { width: grid.w; height: column.h; operation: squareRoot }
                            CalcButton { width: grid.w; height: column.h; operation: "4"; color: 'blue' }
                            CalcButton { width: grid.w; height: column.h; operation: "5"; color: 'blue' }
                            CalcButton { width: grid.w; height: column.h; operation: "6"; color: 'blue' }
                            CalcButton { width: grid.w; height: column.h; operation: multiplication }
                            CalcButton { width: grid.w; height: column.h; operation: "x^2" }
                            CalcButton { width: grid.w; height: column.h; operation: "1"; color: 'blue' }
                            CalcButton { width: grid.w; height: column.h; operation: "2"; color: 'blue' }
                            CalcButton { width: grid.w; height: column.h; operation: "3"; color: 'blue' }
                            CalcButton { width: grid.w; height: column.h; operation: "-" }
                            CalcButton { width: grid.w; height: column.h; operation: "1/x" }
                            CalcButton { width: grid.w; height: column.h; operation: "0"; color: 'blue' }
                            CalcButton { width: grid.w; height: column.h; operation: localeHelper.decimalPoint() }
                            CalcButton { width: grid.w; height: column.h; operation: plusminus }
                            CalcButton { width: grid.w; height: column.h; operation: "+" }
                            CalcButton { width: grid.w; height: column.h; operation: "="; color: 'red' }
                        }
                    }
                }
            }
        }
    }
}
