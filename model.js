"use strict";

export const Model = {
    numberOfExercises: 8,
    maxPointsPerExercise: 100,
    minPositivePoints: 51,
    minPositiveExerciseCount: 6,
    minAttendance: 80,
    exercisePoints: [0, 0, 0, 0, 0, 0, 0, 0],
    examPoints: 0,
    attendance: 100,
    examWeight: 0.4,
    exerciseWeight: 0.6,


    getMaxPointsForExercise: function(index) {
        if (index === 2) {
            return 105;
        }
        return this.maxPointsPerExercise;
    },

    setExercisePoints: function(index, points) {
        this.exercisePoints[index] = points;
        this.sendGradeChangedEvent();
    },

    setExamPoints: function(points) {
        this.examPoints = points;
        this.sendGradeChangedEvent();
    },

    setAttendance: function(value) {
        this.attendance = value;
        this.sendGradeChangedEvent();
    },

    isPositive: function(points) {
        return points >= this.minPositivePoints;
    },

    getWorstExerciseIndex: function() {
        let worstIndex = 0;

        for (let i = 1; i < this.exercisePoints.length; i++) {
            if (this.exercisePoints[i] < this.exercisePoints[worstIndex]) {
                worstIndex = i;
            }
        }
        return worstIndex;
    },

    getPositiveExerciseCount: function() {
        let count = 0;

        for (let points of this.exercisePoints) {
            if (this.isPositive(points)) {
                count++;
            }
        }
        return count;
    },

    getExerciseGradePercent: function() {
        let worstIndex = this.getWorstExerciseIndex();
        let sum = 0;

        for (let i = 0; i < this.exercisePoints.length; i++) {
            if (i !== worstIndex) {
                sum += this.exercisePoints[i];
            }
        }
        let maxPoints = (this.numberOfExercises - 1) * this.maxPointsPerExercise;
        return sum / maxPoints * 100;
    },

    getTotalPercent: function() {
        let exerciseGrade = this.getExerciseGradePercent();
        return exerciseGrade * this.exerciseWeight + this.examPoints * this.examWeight;
    },

    isFinalPositive: function() {
        let exerciseGrade = this.getExerciseGradePercent();
        let examIsPositive = this.isPositive(this.examPoints);
        let exerciseGradeIsPositive = exerciseGrade > 50;
        let enoughExercisesArePositive = this.getPositiveExerciseCount() >= this.minPositiveExerciseCount;
        let attendanceIsEnough = this.attendance >= this.minAttendance;

        return examIsPositive && exerciseGradeIsPositive && enoughExercisesArePositive && attendanceIsEnough;
    },

    getGradeName: function() {
        let total = this.getTotalPercent();
        if (!this.isFinalPositive()) {
            return "Nicht Genügend";
        }
        if (total <= 61) {
            return "Genügend";
        }
        if (total <= 74) {
            return "Befriedigend";
        }
        if (total <= 86) {
            return "Gut";
        }
        return "Sehr Gut";
    },

    sendGradeChangedEvent: function() {
        let gradeChangedEvent = new CustomEvent("gradeChanged");

        document.dispatchEvent(gradeChangedEvent);
    }
};