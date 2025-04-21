import { FormSchema, ComponentNameEnum, RadioGroupComponentProps } from '../types'
import { ElRadio, ElRadioButton } from 'element-plus'
import { defineComponent } from 'vue'

export const useRenderRadio = () => {
  const renderRadioOptions = (item: FormSchema) => {
    // 如果有别名，就取别名
    const componentProps = item?.componentProps as RadioGroupComponentProps
    const valueAlias = componentProps?.props?.value || 'value'
    const labelAlias = componentProps?.props?.label || 'label'
    const disabledAlias = componentProps?.props?.disabled || 'disabled'
    const Com = (
      item.component === ComponentNameEnum.RADIO_GROUP ? ElRadio : ElRadioButton
    ) as ReturnType<typeof defineComponent>
    return componentProps?.options?.map((option, index) => {
      const { ...other } = option
      return (
        <Com
          key={option.id || `renderRadioOptions${index}`} // 添加唯一的 key 属性
          {...other}
          disabled={option[disabledAlias || 'disabled']}
          label={option[labelAlias || 'label']}
          value={option[valueAlias || 'value']}
        ></Com>
      )
    })
  }

  return {
    renderRadioOptions
  }
}
