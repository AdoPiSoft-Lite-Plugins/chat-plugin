"use strict";var{sessions_manager}=require("plugin-core");exports.data={},exports.get=device_id=>{if(exports.data[device_id])return exports.data[device_id].splice(0,1)},exports.add=(device_id,notif)=>{exports.data[device_id]=exports.data[device_id]||[],exports.data[device_id].push(notif)},exports.subscribed_devices=[],exports.subscribe=async device=>{var notified,sessions,interval,device_id=device.db_instance.id;exports.subscribed_devices.includes(device_id)||await sessions_manager.hasRunningSession(device)&&(exports.subscribed_devices.push(device_id),sessions=await sessions_manager.getDeviceSessions(device),interval=setInterval(()=>{var megabytes=sessions.map(i=>i.toJSON());if(!megabytes.find(i=>"running"===i.status))return clearInterval(interval),void(exports.subscribed_devices=exports.subscribed_devices.filter(i=>i!=device_id));var seconds=megabytes.filter(i=>["subscription","time","time_or_data"].includes(i.type)).reduce((t,_s,i)=>t+_s.remaining_time_seconds,0),standalone_time=megabytes.filter(i=>"time"===i.type).reduce((t,_s,i)=>t+_s.remaining_time_seconds,0),megabytes=megabytes.filter(i=>["time_or_data","data"].includes(i.type)).reduce((t,_s,i)=>t+(_s.data_mb-_s.data_consumption_mb),0);(megabytes<=20&&10<=megabytes||megabytes<=5&&0<megabytes||seconds<=300&&290<=seconds||seconds<=60&&0<seconds)&&standalone_time<=300?notified||(exports.add(device_id,{title:"LOW CREDITS",content:"You are running out of credits. Insert coin now to avoid interruption"}),notified=!0):notified=!1},3e3))};