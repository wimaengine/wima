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