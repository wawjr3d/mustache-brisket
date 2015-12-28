"use strict";

var gulp = require("gulp");
var mocha = require("gulp-mocha");
var babel = require("gulp-babel");
var babelCompiler = require("babel/register");

var DIST = "./dist";
var LIB = "./lib/**/*.js";
var UNIT_TESTS = "./spec/**/*.js";

gulp.task("build", function() {
    return gulp.src(LIB)
        .pipe(babel())
        .pipe(gulp.dest(DIST));
});

gulp.task("unit-test", function() {
    return gulp.src(UNIT_TESTS, {
            read: false
        })
        .pipe(mocha({
            reporter: "nyan",
            compilers: {
                js: babelCompiler
            }
        }));
});

gulp.task("default", [
    "build",
    "unit-test"
]);
