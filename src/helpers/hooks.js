import { useEffect } from 'react';


export const useMountEffect = fn => useEffect(fn, [])  // eslint-disable-line react-hooks/exhaustive-deps

