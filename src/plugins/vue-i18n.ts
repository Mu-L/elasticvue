import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import cn from '../locales/cn.json'
import fr from '../locales/fr.json'
import it from '../locales/it.json'
import ru from '../locales/ru.json'
import jp from '../locales/jp.json'
import { useI18nStore } from '../store/i18n'

export const vueI18n = () => {
  const store = useI18nStore()
  const language = store.language || 'en'

  document.querySelector('html')?.setAttribute('lang', language)

  return createI18n({
    lazy: true,
    legacy: false,
    locale: language,
    fallbackLocale: 'en',
    messages: { en, cn, fr, it, ru, jp },
    warnHtmlMessage: false
  })
}
