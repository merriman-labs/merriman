/**
 * Exit with an optional exit code. Default is 0
 * @param code Optional exit code
 */
export const eject = (code: number = 0) => {
  console.log('Au revoir!');
  process.exit(code);
};
