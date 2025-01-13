export function computeHierachyVisibility(world) {
  const query = new Query(world, ['visibility', 'computedvisibility'])

  query.each((visibility, computed) => {
    switch (visibility.mode) {
      case VisibilityMode.Visible:
        computed.value = true
        break;
      case VisibilityMode.Hidden:
        computed.value = false
        break;
      case VisibilityMode.Inherit:
        //TODO: Actualy implement hierarchy visibility.
        computed.value = true
        break;

      default:
        throws("Invalid visibility mode!")
    }
  })
}