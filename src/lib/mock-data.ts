export const owner = {
  business: "Bontle-Entle",
  name: "Mmaki Malepe",
  phone: "+27 62 476 0899",
  channel: "MarineFlow · WhatsApp",
};

type MetricAccent = "warn" | "danger" | false;
export type Metric = {
  key: string;
  label: string;
  value: number | string;
  delta?: string;
  deltaUp?: boolean;
  accent?: MetricAccent;
  badge?: number;
};
export const metrics: Metric[] = [
  { key: "appointments", label: "Bookings today", value: 3, delta: "+3 vs yesterday", deltaUp: true, accent: false },
  { key: "revenue_today", label: "Revenue today", value: "R 170", deltaUp: true, delta: "+13% week", accent: false },
  { key: "revenue_mtd", label: "Revenue this month", value: "R 690", delta: "On pace", deltaUp: true, accent: false },
  { key: "bot_chats", label: "Bot chats today", value: 0, delta: "Quiet morning", deltaUp: false, accent: false },
  { key: "pending_pay", label: "Awaiting payment", value: 11, delta: "Follow up soon", deltaUp: false, accent: "warn" as const, badge: 11 },
  { key: "tickets", label: "Help requests", value: 19, delta: "Needs attention", deltaUp: false, accent: "danger" as const, badge: 19 },
];

export const revenueWeek = [
  { day: "Thu", value: 150 },
  { day: "Fri", value: 0 },
  { day: "Sat", value: 170 },
  { day: "Sun", value: 170 },
  { day: "Mon", value: 0 },
  { day: "Tue", value: 0 },
  { day: "Wed", value: 170 },
];

export const bookings = [
  { id: 1, time: "08:00 – 08:41", service: "High Fade", client: "Mmaki", note: "Holiday", status: "confirmed paid" as const },
  { id: 2, time: "08:48 – 09:04", service: "Trim / Line-Up / Edge-Up Only", client: "Desiree", note: "Holiday", status: "pending payment" as const },
  { id: 3, time: "15:00 – 15:36", service: "Skin / Bald Fade", client: "Joe", note: "Holiday", status: "pending payment" as const },
];

export const conversations = [
  { id: 1, name: "27605841326", initials: "27", last: "Hi — still there? No rush — just tap below…", tag: "booking · popia consent", waited: 9303, time: "Jun 18, 10:51 AM" },
  { id: 2, name: "Mmaki", initials: "MM", last: "Hey *Mmaki*, still there? No rush — just tap…", tag: "", waited: 7272, time: "Jun 19, 08:42 PM" },
  { id: 3, name: "27817821444", initials: "27", last: "Hi — still there? No rush — just tap below…", tag: "marketing consent", waited: 7266, time: "Jun 19, 08:48 PM" },
  { id: 4, name: "Joe", initials: "JO", last: "Hey *Joe*, still there? No rush — just tap…", tag: "", waited: 3392, time: "Jun 22, 01:23 PM" },
  { id: 5, name: "Holiday", initials: "HO", last: "Hey *Holiday*, still there? No rush — just tap…", tag: "choose payment method", waited: 1746, time: "Jun 23, 04:48 PM" },
];

export const thread = [
  { from: "customer" as const, text: "Hi", time: "12:13 PM" },
  { from: "bot" as const, text: "Welcome to MarineFlow! Reply with a number:\n1 — Book an appointment\n2 — My bookings\n3 — My rewards / loyalty\n4 — FAQs\n5 — File a complaint\n6 — Hours & address\n0 — Talk to a human (we will reply soon)", time: "12:13 PM" },
  { from: "customer" as const, text: "0", time: "12:21 PM" },
  { from: "bot" as const, text: "Thanks — a team member will read this chat and respond as soon as possible.", time: "12:21 PM" },
];

export const clients = [
  { id: 1, name: "Joe", initials: "JO", color: "from-pink-500 to-rose-500", email: "joecapels@gmail.com", phone: "+27 79 273 0442", spent: 170, lastVisit: "25 Jun 26", visits: 1, badge: "New" as const, status: "active" },
  { id: 2, name: "+27 81 782 1444", initials: "+1", color: "from-cyan-500 to-blue-500", email: "", phone: "+27 81 782 1444", spent: 0, lastVisit: "No visits yet", visits: 0, badge: null, status: "pending" },
  { id: 3, name: "Mmaki", initials: "MM", color: "from-violet-500 to-purple-500", email: "mmakimalepe@icloud.com", phone: "+27 83 568 5686", spent: 170, lastVisit: "21 Jun 26", visits: 1, badge: "New" as const, status: "muted" },
  { id: 4, name: "+27 60 584 1326", initials: "+1", color: "from-emerald-500 to-teal-500", email: "", phone: "+27 60 584 1326", spent: 0, lastVisit: "No visits yet", visits: 0, badge: null, status: "active" },
  { id: 5, name: "Desiree", initials: "DE", color: "from-amber-500 to-orange-500", email: "desiree@example.com", phone: "+27 82 145 9923", spent: 70, lastVisit: "23 Jun 26", visits: 1, badge: "New" as const, status: "active" },
  { id: 6, name: "Holiday", initials: "HO", color: "from-fuchsia-500 to-pink-500", email: "", phone: "+27 71 932 0011", spent: 0, lastVisit: "Pending", visits: 0, badge: null, status: "pending" },
];

export const services = [
  { name: "Chiskop / Clean Shave", duration: "31 min", booked: 2, rate: "R 329/hr", price: "R 170.00", status: "Active" as const },
  { name: "Trim / Line-Up / Edge-Up Only", duration: "16 min", booked: 2, rate: "R 263/hr", price: "R 70.00", status: "Active" as const },
  { name: "Cornrows (Design / Pattern)", duration: "91 min", booked: 1, rate: "R 165/hr", price: "R 250.00", status: "Active" as const },
  { name: "Mid Fade", duration: "31 + 10 min buffer", booked: 1, rate: "R 387/hr", price: "R 200.00", status: "Active" as const },
  { name: "Teen Fade (13–17)", duration: "31 min", booked: 1, rate: "R 290/hr", price: "R 150.00", status: "Active" as const },
  { name: "Haircut", duration: "45 + 15 min buffer", booked: 1, rate: "R 60/hr", price: "R 45.00", status: "Active" as const },
  { name: "Color", duration: "90 + 30 min buffer", booked: 1, rate: "R 80/hr", price: "R 120.00", status: "Active" as const },
  { name: "Afro Trim & Shape", duration: "31 min", booked: 0, rate: "R 329/hr", price: "R 170.00", status: "Hidden" as const },
  { name: "Beard Colour / Tint", duration: "31 min", booked: 0, rate: "R 194/hr", price: "R 100.00", status: "Inactive" as const },
  { name: "Beard Shape & Trim Only", duration: "21 min", booked: 0, rate: "R 229/hr", price: "R 80.00", status: "Active" as const },
];