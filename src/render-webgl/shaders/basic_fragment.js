export const basicFragment =
  `#version 300 es
// When i figure out how to make bitflags work in webgl.
// const uint VERTEX_COLOR_FLAG = uint(1);
// const uint TRANSPARENT_FLAG = uint(2);

precision mediump float;

in vec2 v_uv;
in vec4 v_color;

uniform WebglBasicMaterial {
  bool enable_vertex_color;
  float opacity;
  vec4 color;
} material;
uniform sampler2D main_texture;

out vec4 output_color;

void main(){
  vec4 sampled_color = texture(main_texture,v_uv);
  vec4 base_color = material.color;
   
  if(material.enable_vertex_color){
    base_color *= v_color;
  }
  
  output_color = base_color;
}
`