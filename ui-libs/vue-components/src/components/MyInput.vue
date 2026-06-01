<script setup lang="ts">
import { computed, ref } from 'vue';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
  placeholder?: string;
  modelValue?: string | number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  leftIcon?: string;
  rightIcon?: string;
  label?: string;
  helperText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  modelValue: '',
  size: 'md',
  disabled: false,
  readonly: false,
  required: false,
  error: false,
  errorMessage: '',
  label: '',
  helperText: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'input', event: Event): void;
}>();

const isFocused = ref(false);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
  emit('input', event);
};

const inputClasses = computed(() => {
  const baseClasses = [
    'w-full border-2 bg-white text-slate-900',
    'transition-all duration-300 outline-none',
    'placeholder:text-slate-400',
    'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
  ];

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs rounded-lg',
    md: 'h-10 px-4 text-sm rounded-xl',
    lg: 'h-12 px-5 text-base rounded-2xl',
  };

  const stateClasses = props.error
    ? [
        'border-red-300',
        'focus:border-red-500 focus:ring-2 focus:ring-red-200',
        isFocused.value ? 'shadow-lg shadow-red-100' : '',
      ]
    : [
        'border-slate-200',
        'hover:border-slate-300',
        'focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
        isFocused.value ? 'shadow-lg shadow-blue-50' : '',
      ];

  const paddingClasses = [];
  if (props.leftIcon) paddingClasses.push(props.size === 'sm' ? 'pl-9' : props.size === 'lg' ? 'pl-12' : 'pl-10');
  if (props.rightIcon) paddingClasses.push(props.size === 'sm' ? 'pr-9' : props.size === 'lg' ? 'pr-12' : 'pr-10');

  return cn(baseClasses, sizeClasses[props.size], stateClasses, paddingClasses);
});

const iconSizeClasses = computed(() => {
  return {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[props.size];
});

const iconPositionClasses = computed(() => {
  return {
    sm: 'left-3 right-3',
    md: 'left-3.5 right-3.5',
    lg: 'left-4 right-4',
  }[props.size];
});
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="block mb-2 text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <div class="relative">
      <div
        v-if="leftIcon"
        :class="[
          'absolute top-1/2 -translate-y-1/2 text-slate-400',
          iconPositionClasses.split(' ')[0],
        ]"
      >
        <svg
          :class="iconSizeClasses"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            :d="leftIcon"
          />
        </svg>
      </div>

      <input
        :type="type"
        :class="inputClasses"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        @input="handleInput"
        @focus="(e) => { isFocused = true; emit('focus', e); }"
        @blur="(e) => { isFocused = false; emit('blur', e); }"
      />

      <div
        v-if="rightIcon"
        :class="[
          'absolute top-1/2 -translate-y-1/2 text-slate-400',
          iconPositionClasses.split(' ')[1],
        ]"
      >
        <svg
          :class="iconSizeClasses"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            :d="rightIcon"
          />
        </svg>
      </div>
    </div>

    <p
      v-if="error && errorMessage"
      class="mt-1.5 text-xs text-red-500"
    >
      {{ errorMessage }}
    </p>
    <p
      v-else-if="helperText"
      class="mt-1.5 text-xs text-slate-500"
    >
      {{ helperText }}
    </p>
  </div>
</template>
