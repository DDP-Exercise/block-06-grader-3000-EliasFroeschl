"use strict";

export const View = {
    createPointsInput: function(id, labelText, maxValue) {
        let box = document.createElement("div");
        box.className = "input-box";

        let label = document.createElement("label");
        label.setAttribute("for", id);
        label.textContent = labelText;

        let input = document.createElement("input");
        input.id = id;
        input.type = "number";
        input.min = 0;
        input.max = maxValue;
        input.value = 0;

        box.appendChild(label);
        box.appendChild(input);

        return box;
    },

    createAttendanceInput: function() {
        return this.createPointsInput("attendance", "Attendance in %", 100);
    },

    showText: function(elementId, text) {
        let element = document.getElementById(elementId);
        element.textContent = text;
    },

    markNegative: function(elementId, isNegative) {
        let element = document.getElementById(elementId);

        if (isNegative) {
            element.classList.add("negative");
        } else {
            element.classList.remove("negative");
        }
    },

    markWorstExercise: function(worstIndex) {
        for (let i = 0; i < 8; i++) {
            let input = document.getElementById("exercise-" + i);

            input.classList.remove("worst-exercise");

            if (i === worstIndex) {
                input.classList.add("worst-exercise");
            }
        }
    }

};