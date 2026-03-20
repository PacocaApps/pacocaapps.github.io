const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Fullscreen quad geometry
const geometry = new THREE.PlaneGeometry(2, 2);
const uSpaceTexture = new THREE.TextureLoader().load('background.jpg');
// Raymarching fragment shader
const material = new THREE.ShaderMaterial({
  uniforms: {
    uSpaceTexture: { value: uSpaceTexture },
    iResolution: { value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1) },
    iTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uTime: { value: 0 }
  },
  fragmentShader: `
  uniform float uTime;
  uniform sampler2D uSpaceTexture;
uniform vec2 uResolution;
#define NUMBER_OF_STEPS 1000
#define MAX_DIST 100.0
#define SURFACE_DIST 0.001
 float sdSphere(vec3 p, vec3 c,float r){
  return length(p -c) - r;
}
 vec3 cameraPos = vec3(0.0, 0.0, -30.0);


vec2 dirToEquirect(vec3 d){
  float u = atan(d.x, d.z) / (2.0*3.14159265) + 0.5;
  float v = 0.5 - asin(clamp(d.y,-1.0,1.0)) / 3.14159265;
  return vec2(u, v);
}





 vec3 raymarch(vec3 ro, vec3 rd){
    vec3 color = vec3(0.0);
    float distance_traveled = 0.0;
    vec3 currentPoint_position = ro;
    rd = normalize(rd);
    vec2 rdvs = gl_FragCoord.xy / uResolution.xy;
    vec3 blackholePos = vec3(0, 0, 3);
    float schwartzchild = 1.6;
    for(int i = 0; i < NUMBER_OF_STEPS; i++){
        float distance_to_closest = sdSphere(currentPoint_position, vec3(-25.0 + uTime, 1.0, 10.0), 1.0);
        float dist = length(currentPoint_position - blackholePos);

        float h2 = pow(length(cross(currentPoint_position, rd)), 2.0);
        color = texture2D(uSpaceTexture, dirToEquirect(rd)).rgb;

        if( dist > schwartzchild){
        if(distance_to_closest < SURFACE_DIST){

        // If ray hits object
            color = vec3(1.0, 0.0, 0.0); // Hit: red
            break;
        }
        if(distance_traveled > MAX_DIST){
         



             color = texture2D(uSpaceTexture, dirToEquirect(rd)).rgb;

            break;
        }
        
        float step_size = 0.1;
        currentPoint_position += rd * step_size;
        // Simulate gravitational lensing effect
        rd +=  -1.5 * schwartzchild * h2 * currentPoint_position / pow(pow(dist, 2.0), 2.5) * step_size;
        rd = normalize(rd);
        distance_traveled += step_size;
    }else{
color = vec3(0.0, 0.0, 0.0);
}
        }
    return color;
}

void main() {
 cameraPos += vec3(0.0, 0.0, 1.0);
  vec2 uv = gl_FragCoord.xy/uResolution.xy;
  uv -= 0.5;
  uv.x *= uResolution.x / uResolution.y;
  vec3 ro = cameraPos;
  vec3 rd = normalize(vec3(uv, 1.0));
  vec3 color = raymarch(ro, rd);


  gl_FragColor = vec4(color, 1.0);
}

  `
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function animate(time) {
  material.uniforms.iTime.value = time * 0.001;
    material.uniforms.uTime.value = time * 0.001;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();