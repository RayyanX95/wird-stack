<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui';
import type { ModalVariant } from '@/types';

const VARIANT_ICONS: Record<ModalVariant, string> = {
  success: 'lucide:check',
  info: 'lucide:info',
  error: 'lucide:alert-triangle',
};

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    title?: string;
    message?: string;
    successBtnLabel?: string;
    closeBtnLabel?: string;
    variant?: ModalVariant;
  }>(),
  { variant: 'success' },
);

const icon = computed(() => VARIANT_ICONS[props.variant]);

// Resolved here rather than as a withDefaults value: a default is evaluated
// once at prop-resolution time, so a literal 'Close' would survive a language
// switch while every other string on the dialog changed.
const closeLabel = computed(() => props.closeBtnLabel ?? t('common.close'));

const emit = defineEmits<{ success: [] }>();

// Controlled open state — the parent drives this with v-model:open (e.g. flips
// it to true after a successful form submit) instead of relying on an
// internal DialogTrigger, which this modal doesn't always have one of.
const open = defineModel<boolean>('open', { default: false });

function handleSuccess() {
  emit('success');
  open.value = false;
}
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent class="dialog-content">
        <div class="icon-row">
          <div class="dialog-icon" :class="`dialog-icon--${props.variant}`">
            <Icon :icon="icon" />
          </div>
        </div>

        <DialogTitle class="dialog-title">{{ title }}</DialogTitle>
        <DialogDescription class="dialog-description">
          {{ message }}
        </DialogDescription>

        <div class="dialog-actions">
          <DialogClose class="btn ghost">{{ closeLabel }}</DialogClose>
          <button
            v-if="successBtnLabel"
            type="button"
            class="btn"
            :class="variant === 'error' ? 'danger' : 'primary'"
            @click="handleSuccess"
          >
            {{ successBtnLabel }}
          </button>
        </div>

        <DialogClose class="dialog-close" :aria-label="t('common.close')">
          <Icon icon="lucide:x" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(var(--text-rgb), 0.35);
  animation: overlay-show 150ms var(--ease);
}

.dialog-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 420px;
  max-height: 85vh;
  padding: 24px;
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  animation: content-show 150ms var(--ease);
}
.dialog-content:focus {
  outline: none;
}

.icon-row {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  color: #fff;
  font-size: 20px;
}

.dialog-icon--success {
  background: linear-gradient(155deg, var(--accent), var(--accent-hover));
  box-shadow: 0 0 0 6px var(--accent-soft);
}

.dialog-icon--info {
  background: linear-gradient(155deg, var(--info), var(--info));
  box-shadow: 0 0 0 6px var(--info-soft);
}

.dialog-icon--error {
  background: linear-gradient(155deg, var(--warn), var(--warn));
  box-shadow: 0 0 0 6px var(--warn-soft);
}

.dialog-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 18px;
  color: var(--text);
  margin: 0;
}

.dialog-description {
  margin: 8px 0 20px;
  color: var(--text-muted);
  font-size: 13.5px;
  line-height: 1.5;
}

.field + .field {
  margin-top: 12px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 22px;
  gap: 12px;
}

.dialog-close {
  position: absolute;
  top: 14px;
  inset-inline-end: 14px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--text-faint);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast);
}
.dialog-close:hover {
  background: var(--surface-alt);
  color: var(--text);
}

@keyframes overlay-show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes content-show {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
