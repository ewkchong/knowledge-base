"use strict";const e=require("electron"),t=require("path");require("electron-squirrel-startup")&&e.app.quit();const n=()=>{const o=new e.BrowserWindow({title:"Knowledge Base",width:800,height:600,webPreferences:{preload:t.join(__dirname,"preload.js")}});o.loadURL("http://localhost:5173"),o.webContents.openDevTools()};e.app.on("ready",n);e.app.on("window-all-closed",()=>{process.platform!=="darwin"&&e.app.quit()});e.app.on("activate",()=>{e.BrowserWindow.getAllWindows().length===0&&n()});
