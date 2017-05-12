const gulp = require("gulp");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");

const project = ts.createProject("tsconfig.json");

gulp.task("watch", () => {
  gulp.watch(["./src/**/*.ts"], ["build"]);
});

gulp.task("build", ["lint", "build:ts"]);

gulp.task("lint", ["lint:ts"]);

gulp.task("build:ts", () => {
  project.src()
    .pipe(project())
    .pipe(gulp.dest("./dest"));
});

gulp.task("lint:ts", () => {
  project.src()
    .pipe(tslint())
    .pipe(tslint.report());
});