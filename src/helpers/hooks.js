import { useEffect, useState } from 'react';


export const useMountEffect = fn => useEffect(fn, []);  // eslint-disable-line react-hooks/exhaustive-deps

const getStorageValue = (key, defaultValue = {}) => {
  const storageData = localStorage.getItem('ccx_pool');
  const localData = JSON.parse(storageData);
  return localData || defaultValue;
}

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export const useFormInput = init => {
  const [value, setValue] = useState(init);
  const onChange = e => setValue(e.target.value);
  const reset = () => setValue('');
  return { bind: { value, onChange }, reset, setValue, value };
}
