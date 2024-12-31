export const isPlug = (): boolean => {
  const priList = JSON.parse(localStorage.getItem('priList')) || {};
  const principal = localStorage.getItem('principal');
  const type = priList[principal];
  return type === 'Plug' || type === 'SignerPlug';
};
