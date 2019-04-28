/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */
// import manage from './manage'

const files = (require as any).context('.', false, /\.js$/)
const modules: any = {
  // manage
}
files.keys().forEach((key: any) => {
  if (key === './index.js') return;
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default modules
