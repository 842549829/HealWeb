<script lang="tsx">
import { defineComponent } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export default defineComponent({
  name: 'EnumShow',
  props: {
    // 表单数据对象
    value: propTypes.string.def('')
  },
  setup(props) {
    const getEnumShow = () => {
      if (props.value && props.value !== '') {
        return t(props.value)
      } else {
        return ''
      }
    }
    return () => <>{getEnumShow()}</>
  }
})
</script>
