"use strict";

import { Model } from "./model.js";
import { View } from "./view.js";

const Controller = {

    init: function() {
        this.createInputs();
        this.addInputListeners();
        this.addModelListener();
        this.updateView();
    },

    createInputs: function() {
        let exerciseArea = document.getElementById("exercise-inputs");

        for (let i = 0; i < Model.numberOfExercises; i++) {
            let maxPoints = Model.getMaxPointsForExercise(i);
            let inputBox = View.createPointsInput("exercise-" + i, "Exercise " + (i + 1), maxPoints);
            exerciseArea.appendChild(inputBox);
        }
        let examArea = document.getElementById("exam-input");
        let examInput = View.createPointsInput("exam", "Exam in %", 100);
        examArea.appendChild(examInput);

        let attendanceArea = document.getElementById("attendance-input");
        let attendanceInput = View.createAttendanceInput();
        attendanceArea.appendChild(attendanceInput);
    },

    limitValue: function(value, min, max) {
        if (value < min) {
            return min;
        }

        if (value > max) {
            return max;
        }

        return value;
    },

    addInputListeners: function() {
        for (let i = 0; i < Model.numberOfExercises; i++) {
            let input = document.getElementById("exercise-" + i);

            input.addEventListener("change", function() {
                let maxPoints = Model.getMaxPointsForExercise(i);
                let points = Controller.limitValue(Number(input.value), 0, maxPoints);
                input.value = points;
                Model.setExercisePoints(i, points);
            });
        }

        let examInput = document.getElementById("exam");
        examInput.addEventListener("change", function() {
            let percent = Controller.limitValue(Number(examInput.value), 0, 100);

            examInput.value = percent;
            Model.setExamPoints(percent);
        });

        let attendanceInput = document.getElementById("attendance");
        attendanceInput.addEventListener("change", function() {
            let percent = Controller.limitValue(Number(attendanceInput.value), 0, 100);

            attendanceInput.value = percent;
            Model.setAttendance(percent);
        });
    },

    addModelListener: function() {
        document.addEventListener("gradeChanged", function() {
            Controller.updateView();
        });
    },

    updateView: function() {
        let exerciseGrade = Model.getExerciseGradePercent();
        let totalGrade = Model.getTotalPercent();
        let exercisesAreNegative = exerciseGrade <= 50 || Model.getPositiveExerciseCount() < Model.minPositiveExerciseCount;

        View.showText("exercise-result", "Exercise grade: " + exerciseGrade.toFixed(1) + "%");
        View.showText("exam-result", "Exam: " + Model.examPoints + "%");
        View.showText("attendance-result", "Attendance: " + Model.attendance + "%");
        View.showText("total-result", "Total: " + totalGrade.toFixed(1) + "%");
        View.showText("grade-result", "Grade: " + Model.getGradeName());
        View.markWorstExercise(Model.getWorstExerciseIndex());
        View.markNegative("exam-result", !Model.isPositive(Model.examPoints));
        View.markNegative("exercise-result", exercisesAreNegative);
        View.markNegative("attendance-result", Model.attendance < Model.minAttendance);
        View.markNegative("grade-result", !Model.isFinalPositive());

        let messages = [];

        if (!Model.isPositive(Model.examPoints)) {
            messages.push("exam is below 51%");
        }

        if (exerciseGrade <= 50) {
            messages.push("exercise grade is not above 50%");
        }

        if (Model.getPositiveExerciseCount() < Model.minPositiveExerciseCount) {
            messages.push("fewer than 6 exercises are positive");
        }

        if (Model.attendance < Model.minAttendance) {
            messages.push("attendance is below 80%");
        }

        if (messages.length === 0) {
            View.showText("message-result", "Message: Positive.");
        } else {
            View.showText("message-result", "Message: Negative because " + messages.join(", ") + ".");
        }
        View.markNegative("message-result", !Model.isFinalPositive());
    }

};

Controller.init();