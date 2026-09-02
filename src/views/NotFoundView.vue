<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <div class="view">
    <div class="empty-state">
      <div class="empty-icon"><Icon icon="lucide:compass" /></div>
      <h1 class="text-title margin-bottom">{{ t('notFound.title') }}</h1>
      <p class="text-subtitle">{{ t('notFound.body') }}</p>
      <RouterLink to="/today" class="btn primary">{{ t('notFound.goToToday') }}</RouterLink>
    </div>
  </div>
</template>
