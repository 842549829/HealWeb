import { FormSchema, ComponentNameEnum, CheckboxGroupComponentProps } from '../types'
import { ElCheckbox, ElCheckboxButton } from 'element-plus'
import { defineComponent } from 'vue'

export const useRenderCheckbox = () => {
  const renderCheckboxOptions = (item: FormSchema) => {
    // 如果有别名，就取别名
    const componentProps = item?.componentProps as CheckboxGroupComponentProps
    const valueAlias = componentProps?.props?.value || 'value'
    const labelAlias = componentProps?.props?.label || 'label'
    const disabledAlias = componentProps?.props?.disabled || 'disabled'
    const Com = (
      item.component === ComponentNameEnum.CHECKBOX_GROUP ? ElCheckbox : ElCheckboxButton
    ) as ReturnType<typeof defineComponent>
    return componentProps?.options?.map((option, index) => {
      const { ...other } = option
      return (
        <Com
          key={option.id || `renderCheckboxOptions${index}`} // 添加唯一的 key 属性
          {...other}
          disabled={option[disabledAlias || 'disabled']}
          label={option[labelAlias || 'label']}
          value={option[valueAlias || 'value']}
        ></Com>
      )
    })
  }

  return {
    renderCheckboxOptions
  }
}
