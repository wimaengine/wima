export const basicVertex =
  `#version 300 es
#pragma vscode_glsllint_stage: vert
precision mediump float;

in vec3 position3d;
in vec3 normal3d;
in vec2 uv;
in vec4 color;

uniform Camera {
  mat4 view;
  mat4 projection;
} camera;
uniform mat3x4 model;

out vec2 v_uv;
out vec4 v_color;

void main(){
  gl_Position = camera.projection * camera.view * transpose(mat4(model)) * vec4(position3d,1.0);
  v_uv = uv;
  v_color = color;
}
`