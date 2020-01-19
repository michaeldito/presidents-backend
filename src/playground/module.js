const moduleName = process.argv[process.argv.length - 1];
const cwd = process.cwd();
const path = `${cwd}/src/${moduleName}`;

// Copy src/config/module/* to path
// In path/controller, rename 'Model' to moduleName
// In path/controller, rename 'modelService' to moduleName -- 1st char lowercase
// In path/model/index.js, rename 'ModelSchema' to {moduleName}Schema
// In path/model/index.js, rename 'ModelKind' to {moduleName}
// In path/service/index.js, rename '/model' to /{moduleName} -- 1st char lowercase
// In path/model/index.js, rename 'modelRouter' to {moduleName}Router -- 1st char lowercase

// NOTE
// will still need to import/export module in module/index.js
// will still need to import and add service in api
