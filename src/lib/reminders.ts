import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import type { Prescription } from "../data/types";
export async function enableReminders(
  prescriptions: Prescription[],
  lang: string,
) {
  if (Platform.OS === "web")
    throw new Error(
      "Medicine notifications are available in the Android or iOS app.",
    );
  if (Platform.OS === "android")
    await Notifications.setNotificationChannelAsync("medicine", {
      name: "Medicine reminders",
      // Expo reexports this enum through a platform barrel that import/namespace cannot resolve.
      // eslint-disable-next-line import/namespace
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  const permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted)
    throw new Error(
      "Notifications are disabled. Enable them in your device settings.",
    );
  const existing = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of existing)
    if (n.identifier.startsWith("tapza-dose-"))
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
  const hours = { morning: 8, afternoon: 13, night: 21 };
  const title =
    lang === "hi"
      ? "दवा लेने का समय"
      : lang === "te"
        ? "మందులు తీసుకునే సమయం"
        : "Time for your medicine";
  const upcoming:{date:Date;identifier:string;name:string;dose:string;prescriptionId:string}[]=[];
  for(const rx of prescriptions)for(const med of rx.medicines)for(const period of med.timing)for(let day=0;day<med.days;day++){
   const [year,month,dateOfMonth]=rx.issuedAt.split('-').map(Number);
   const date=new Date(year,month-1,dateOfMonth+day,hours[period],0,0);
   if(date.getTime()>Date.now())upcoming.push({date,identifier:`tapza-dose-${rx.id}-${med.id}-${period}-${day}`,name:med.name,dose:med.dose,prescriptionId:rx.id});
  }
  // iOS limits pending notifications. Schedule the next 60, within the prescription duration.
  const next=upcoming.sort((a,b)=>a.date.getTime()-b.date.getTime()).slice(0,60);
  for(const dose of next)await Notifications.scheduleNotificationAsync({identifier:dose.identifier,content:{title,body:`${dose.name} · ${dose.dose}`,data:{prescriptionId:dose.prescriptionId}},trigger:{type:Notifications.SchedulableTriggerInputTypes.DATE,date:dose.date,channelId:'medicine'}});
  return next.length;
}
export async function cancelReminders(){if(Platform.OS==='web')return;for(const n of await Notifications.getAllScheduledNotificationsAsync())if(n.identifier.startsWith('tapza-dose-'))await Notifications.cancelScheduledNotificationAsync(n.identifier);}
