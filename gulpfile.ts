
const gulpFile = require('gulp-file');
import { Gulp, Task, SetGulpOptions } from 'ts-gulp-tasks';
import * as fs from 'fs';
import * as gulp from 'gulp';
import * as gulpFilter from 'gulp-filter';
import * as gulpTypescript from 'gulp-typescript';
import gulpTslint from 'gulp-tslint';
import * as merge2 from 'merge2';

SetGulpOptions({
  allowSpacesInTaskNames: true,
  outputGulpSetup: true,
});

@Gulp(gulp)
export class GulpFile {

  public static readonly buildDestination: string = './dist';
  public static readonly sourceRoot: string = '../src';
  public static readonly source: string = './src';

  @Task()
  public static default() {
    const result1 = this.compileSourceBasePattern(['**/**/*.ts', '!gulpfile.ts']);
    const result2 = this.copyPackageJson();
    const result3 = this.copyAssets();
    return merge2(result1, result2, result3);
  }

  @Task()
  public static tslint(): Promise<any> {
    return new Promise((resolve, reject) => {
      gulp.src([`${this.source}/**/*.ts`])
        .pipe(gulpTslint({
          formatter: 'verbose',
        })).pipe(gulpTslint.report()).pipe(gulp.dest(this.buildDestination))
        .once('end', resolve).once('error', reject);
    });
  }

  private static copyPackageJson(): NodeJS.ReadableStream {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8').toString());
    delete packageJson.devDependencies;
    const packageStr = JSON.stringify(packageJson, null, '    ');
    return gulpFile('package.json', packageStr, { src: true }).pipe(gulp.dest(this.buildDestination));
  }

  private static copyAssets(): NodeJS.ReadableStream {
    return gulp.src(['README.md', 'LICENSE']).pipe(gulp.dest(this.buildDestination));
  }

  private static compileSourceBasePattern(pattern: string | string[] | gulpFilter.FileFunction): NodeJS.ReadableStream {

    const project = gulpTypescript.createProject('tsconfig.json', {
      rootDir: this.source,
      declaration: true,
      declarationFiles: true,
    });

    const result = project.src()
      .pipe(gulpFilter(pattern))
      .pipe(project());

    return merge2(
      result.js.pipe(gulp.dest(this.buildDestination)),
      result.dts.pipe(gulp.dest(this.buildDestination))
    );
  }
}
