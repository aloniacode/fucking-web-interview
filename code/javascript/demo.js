function setLocalStorageData(key, data, expiration) {
  localStorage.setItem(
    key,
    JSON.stringify({
      data,
      expiration,
    })
  );
}

function getLocalStorageData(key) {
  let item = localStorage.getItem(key);
  if (item) {
    item = JSON.parse(item);
    if (item.expiration && new Date().getTime() > item.expiration) {
      localStorage.removeItem(key);
      return null;
    }
    return item.data;
  }
  return null;
}
