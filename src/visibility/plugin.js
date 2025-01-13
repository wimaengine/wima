export class VisibilityPlugin {
  build(app){
    app
    .registerType(Visibility)
    .registerType(ComputedVisibility)
    .registerSystem(AppSchedule.Update ,computeHierachyVisibility)
  }
}