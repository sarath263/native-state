import {useCallback,useSyncExternalStore}from"react";const i={};let s=i,t=function(){},f=!0;const l=new Set();export function RootState({children,initial=i}){if(f){s=initial;l.forEach(l=>l());f=!1;t=useCallback((ns={})=>{s=Object.assign({},s,ns);l.forEach(e=>e())},[])}return<>{children}</>}export const useSelector=sl=>{sl=useCallback(sl,[]);const subscribe=useCallback(callback=>{l.add(callback);return()=>l.delete(callback)},[]);const c=useSyncExternalStore(subscribe,()=>{try{return sl(s)||null}catch(error){return undefined}},()=>{try{return sl(s)||null}catch(error){return undefined}});return[c,t]};
