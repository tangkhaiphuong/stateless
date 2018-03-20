
const gulpFile = require('gulp-file');
import { Gulp, Task, SetGulpOptions } from 'ts-gulp-tasks';
import * as fs from 'fs';
import * as gulp from 'gulp';
import * as gulpFilter from 'gulp-filter';
import * as gulpSourcemaps from 'gulp-sourcemaps';
import * as gulpTypescript from 'gulp-typescript';
import * as rimraf from 'rimraf';
import * as gulpUlti from 'gulp-util';
import gulpTslint from 'gulp-tslint';
import * as path from 'path';
import * as child_process from 'child_process';

SetGulpOptions({
    allowSpacesInTaskNames: true,
    outputGulpSetup: true,
});

@Gulp(gulp)
export class GulpFile {

    public static readonly buildDestination: string = './lib';
    public static readonly sourceRoot: string = '../src';
    public static readonly source: string = './src';

    @Task(GulpFile.build.name)
    public static default(done: () => void): void { done(); }

    @Task(GulpFile.compileSource.name, )
    public static build(done: () => void): void { done(); }

    @Task()
    public static compileSource(): NodeJS.ReadableStream {
        return this.compileSourceBasePattern(['**/*.ts', '!gulpfile.ts']);
    }

    private static compileSourceBasePattern(pattern: string | string[] | gulpFilter.FileFunction): NodeJS.ReadableStream {
        const project = gulpTypescript.createProject('tsconfig.json', {
            rootDir: this.source,
            declaration: true,
        });

        const result = project.src()
            .pipe(gulpFilter(pattern))
            .pipe(gulpSourcemaps.init())
            .pipe(project());

        return result.js.pipe(gulpSourcemaps.write('.', {
            includeContent: false,
            sourceRoot: this.sourceRoot,
        })).pipe(gulp.dest(this.buildDestination));
    }
}
