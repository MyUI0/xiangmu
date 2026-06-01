<script setup lang="ts">
import { computed } from 'vue';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: boolean;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  rounded: false,
  disabled: false,
  loading: false,
  fullWidth: false,
});

const buttonClasses = computed(() => {
  const baseClasses = [
    'relative inline-flex items-center justify-center',
    'font-medium transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'select-none',
  ];

  const variantClasses = {
    primary: [
      'bg-gradient-to-r from-blue-600 to-violet-600',
      'text-white',
      'hover:from-blue-700 hover:to-violet-700',
      'hover:shadow-lg hover:shadow-blue-500/30',
      'hover:-translate-y-0.5',
      'active:translate-y-0',
      'focus:ring-blue-500',
    ],
    secondary: [
      'bg-slate-800',
      'text-slate-100',
      'hover:bg-slate-700',
      'hover:shadow-md',
      'focus:ring-slate-500',
    ],
    outline: [
      'border-2 border-slate-200',
      'bg-transparent',
      'text-slate-700',
      'hover:border-blue-500 hover:text-blue-600',
      'hover:bg-blue-50',
      'focus:ring-blue-500',
    ],
    ghost: [
      'bg-transparent',
      'text-slate-600',
      'hover:bg-slate-100 hover:text-slate-900',
      'focus:ring-slate-400',
    ],
    destructive: [
      'bg-red-500',
      'text-white',
      'hover:bg-red-600',
      'hover:shadow-lg hover:shadow-red-500/30',
      'focus:ring-red-500',
    ],
    glow: [
      'bg-gradient-to-r from-cyan-500 to-blue-500',
      'text-white',
      'shadow-lg shadow-cyan-500/40',
      'hover:shadow-cyan-500/60',
      'hover:scale-105',
      'active:scale-95',
      'focus:ring-cyan-400',
    ],
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-5 text-sm',
    lg: 'h-12 px-7 text-base',
    xl: 'h-14 px-9 text-lg',
  };

  const roundedClasses = props.rounded ? 'rounded-full' : 'rounded-xl';
  const widthClasses = props.fullWidth ? 'w-full' : '';

  return cn(
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    roundedClasses,
    widthClasses
  );
});

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="mr-2">
      <svg
        class="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </span>
    <slot></slot>
  </button>
</template>
