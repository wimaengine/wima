export const basicMaterial3DVertex =
  `#version 300 es
#pragma vscode_glsllint_stage: vert
precision mediump float;

in vec3 position3d;

uniform Camera {
  mat4 view;
  mat4 projection;
} camera;
uniform mat3x4 model;

void main(){
  gl_Position = camera.projection * camera.view * transpose(mat4(model)) * vec4(position3d,1.0);
}
`
export const basicMaterial3DFragment =
  `#version 300 es
#pragma vscode_glsllint_stage: frag
precision mediump float;

uniform BasicMaterial {
  vec4 color;
} material;

out vec4 output_color;

void main(){
  vec4 base_color = material.color;
  
  output_color = vec4(base_color.rgb,1.0);
}
`