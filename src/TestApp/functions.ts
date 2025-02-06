export const getQueryParams = () => {
  const query = window.location.search.substring(1);
  const params = query.split('&').filter((t) => t.trim() !== '');
  return params.reduce((p: any, v) => {
    const pv = v.split('=');
    return pv.length < 2 ? { ...p, [pv[0]]: true } : { ...p, [pv[0]]: pv[1] };
  }, {});
};
