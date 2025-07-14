export * from './database';
//when an error comes when exporting certain folders like database,
//and everything seems current, just backspace that export and retype it

//index.ts in the database folder exports from there to the src folder level
//this index.ts meanwhile takes that export and exports it to the common level which
//is accessible in the tsconfig.json
export * from './logger'
export * from './auth'
export * from './constants'
export * from './decorators'
export * from './dto'
export * from './models'
export * from './health'