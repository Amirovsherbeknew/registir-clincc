<template>
  <div
    class="w-full min-w-[174px] max-w-[174px] py-1 flex justify-center gap-1 rounded-lg items-center font-semibold text-sm"
    :class="(statusTypes as any)[classType || type]?.class || ''"
  >
    {{ label || (statusTypes as any)[type]?.label }}
  </div>
</template>

<script setup lang="ts">
interface IProp {
  type?:
    | "registered"
    | "pending"
    | "review"
    | "unpaid"
    | "paid"
    | "deadline"
    | "new"
    | "in_process"
    | "cancel_payment"
    | "rejected"
    | "approved"
    | "empty"
    | "View"
    | "Search"
    | "Download"
    | string;
  icon?: string;
  label?: string;
  classType?: string;
  iconShow?: boolean;
}
withDefaults(defineProps<IProp>(), {
  type: "empty",
  iconShow: true,
  icon: "",
  label: "",
  classType: ""
});

const statusTypes = {
  registered: {
    icon: "check-circle",
    label: "Ro’yxatga olingan",
    class: "bg-teal-50 text-teal-600"
  },
  pending: {
    icon: "card",
    label: "To’lov kutilmoqda",
    class: "bg-blue-50 text-blue-600"
  },
  review: {
    icon: "reload",
    label: "Ko’rib chiqilmoqda",
    class: "bg-orange-50 text-amber-600"
  },
  unpaid: {
    icon: "card-remote",
    label: "To’lanmagan",
    class: "bg-rose-50 text-rose-500"
  },
  paid: {
    icon: "check-circle",
    label: "To’langan",
    class: "bg-teal-50 text-teal-600"
  },
  deadline: {
    icon: "calendar-minus",
    label: "Muddati o’zgargan",
    class: "bg-stone-100 text-stone-600"
  },
  new: {
    icon: "notification-rectangle",
    label: "Yangi",
    class: "bg-blue-50 text-blue-600"
  },
  in_process: {
    icon: "reload",
    label: "Jarayonda",
    class: "bg-orange-50 text-amber-600"
  },
  rejected: {
    icon: "remove-circle",
    label: "Rad etilgan",
    class: "bg-rose-50 text-rose-500"
  },
  cancel_payment: {
    icon: "remove-circle",
    label: "To'lov qaytarilgan",
    class: "bg-rose-50 text-rose-500"
  },
  approved: {
    icon: "check-circle",
    label: "To'langan",
    class: "bg-teal-50 text-teal-600"
  },
  empty: {
    icon: "",
    label: "Bo'sh",
    class: "bg-stone-100 text-stone-600"
  },
  View: {
    icon: "card",
    label: "Ko’rib chiqdi",
    class: "bg-blue-50 text-blue-600"
  },
  Search: {
    icon: "card",
    label: "Qidirish",
    class: "bg-blue-50 text-blue-600"
  },
  Download: {
    icon: "card",
    label: "Yuklash",
    class: "bg-blue-50 text-blue-600"
  }
};
</script>
