export default defineBackground(() => {
  console.log('Xiaoxin extension background loaded');

  browser.runtime.onInstalled.addListener(() => {
    console.log('Xiaoxin extension installed');
  });
});
