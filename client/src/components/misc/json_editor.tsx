import React from 'react'

type Props<T> = {
  label: string
  defaultValue: T
  onChange: (newValue: T) => any
  jsonSchema: any
}

// No typings
// Lib loaded in old-school way globaly and binded to `window`

class MyJSONEditor<T> extends React.Component<Props<T>> {
  private elRef = React.createRef<HTMLDivElement>()
  private jsonEditor: any

  constructor(props: Props<T>) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    this.jsonEditor = new (window as any).JSONEditor(this.elRef.current, {
      theme: 'bootstrap4',
      schema: this.props.jsonSchema,
      disable_array_reorder: true,
      // disable_edit_json: true,
      array_controls_top: true,
      form_name_root: this.props.label,
      no_additional_properties: true,
      show_errors: 'always',
      object_layout: 'table',
      remove_empty_properties: false,
    });

    this.jsonEditor.setValue(this.props.defaultValue)
    this.jsonEditor.on('change', this.onChange);
  }

  render() {
    return (
      <div ref={this.elRef}/>)
  }

  onChange() {
    const value = this.jsonEditor.getValue()
    this.props.onChange(value)
  }
}

export default MyJSONEditor