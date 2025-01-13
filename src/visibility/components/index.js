export class Visibility {
  computed_visibility
  visible
  constructor(visible){
    this.visible = visible
    this.computed_visibility = computed_visibility
  }
  enable(){
    this.visible = true
    return this
  }
  disable(){
    this.visible = false
    return this
  }
  enabled(){
    return this.visible
  }
}