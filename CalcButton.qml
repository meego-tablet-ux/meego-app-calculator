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

BorderImage {
    id: button

    property alias operation: buttonText.text
    property string color: ""

    signal clicked

    source: "images/button-" + color + ".png"; clip: true
    border { left: 10; top: 10; right: 10; bottom: 10 }

    Rectangle {
        id: shade
        anchors.fill: button; radius: 10; color: "black"; opacity: 0
    }

    Text {
        id: buttonText
        anchors.centerIn: parent; anchors.verticalCenterOffset: -1
        font.pixelSize: parent.width > parent.height ? parent.height * .5 : parent.width * .5
        style: Text.Sunken;
        color: theme_buttonFontColor; styleColor: "black";
    }

    MouseArea {
        id: mouseArea
        anchors.fill: parent
        onClicked: {
            doOp(operation)
            button.clicked()
        }
    }

    states: State {
        name: "pressed"; when: mouseArea.pressed == true
        PropertyChanges { target: shade; opacity: .4 }
    }
}
