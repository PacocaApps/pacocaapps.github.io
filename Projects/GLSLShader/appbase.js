const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Fullscreen quad geometry
const geometry = new THREE.PlaneGeometry(2, 2);

// Raymarching fragment shader
const material = new THREE.ShaderMaterial({
  uniforms: {
    iResolution: { value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1) },
    iTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uTime: { value: 0 }
  },
  fragmentShader: `
  uniform float uTime;
uniform vec2 uResolution;

    #define MAX_STEPS 500
    #define MAX_DIST 500.0
    #define SURFACE_DIST 0.0001
    
    float sdSphere(vec3 p, vec3 c, float r){
      return length(p - c) - r;
    }
    float sdSine(vec3 p){
    return sin(p.y*p.x*0.01) * 0.5 + 0.5;
    }
    float sdPlane(vec3 p,vec3 n,float h){
      return dot(p, n) + h;
    }
    float sdBox(vec3 p, vec3 c,vec3 b){
     vec3 q = abs(p - c) - b;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
    }
    float sdBoxFrame( vec3 p,vec3 c, vec3 b, float e )
      {

      //Note that c is the center of the box, b is the size and e is the thickness
       p = abs(p - c )-b;
  vec3 q = abs(p+e)-e;
  return min(min(
      length(max(vec3(p.x,q.y,q.z),0.0))+min(max(p.x,max(q.y,q.z)),0.0),
      length(max(vec3(q.x,p.y,q.z),0.0))+min(max(q.x,max(p.y,q.z)),0.0)),
      length(max(vec3(q.x,q.y,p.z),0.0))+min(max(q.x,max(q.y,p.z)),0.0));
    }
    
  float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float world(vec3 p){
          vec3 s = vec3(4.0);
          return sdBox(p, vec3(0.0,-4.0, -1.9), vec3(2.0,3.0,2.0));

          // return  sdSphere(p - s*round(p/s), vec3(0.0,0.0,-1.9), 1.0);
}














    
    vec3 computeNormals(vec3 p){
  float eps = 0.001;
  float dx = world(p + vec3(eps,0,0)) - world(p - vec3(eps,0,0));
  float dy = world(p + vec3(0,eps,0)) - world(p - vec3(0,eps,0));
  float dz = world(p + vec3(0,0,eps)) - world(p - vec3(0,0,eps));
  return normalize(vec3(dx, dy, dz));
}


 
   float raymarch(vec3 ro, vec3 rd){
    float dperc = 0.0;
    vec3 color = vec3(0.0);
    for(int i = 0; i < MAX_STEPS; i++){
      vec3 p = ro + rd*dperc;
      float dS = world(p);
      dperc += dS;
      if(dperc > MAX_DIST || dS < SURFACE_DIST) {
      break;
      }

    }
            return dperc;

   }


 vec3 lighting(vec3 p, vec3 n){
    vec3 lightPos = vec3(5.0, 5.0, 5.0);
    vec3 lightDir = normalize(lightPos - p);
    float diff = max(dot(n, lightDir), 0.0);
    vec3 color = vec3(diff,0,0);
    return color;
}

void main() {
  vec2 uv = gl_FragCoord.xy/uResolution.xy;
  uv -= 0.5;
  uv.x *= uResolution.x / uResolution.y;

  // Ray Origin - camera
  vec3 ro = vec3(0.0, 0.0, 5.0 - uTime);
  // Ray Direction
  vec3 rd = normalize(vec3(uv, -1.0));
  // Raymarching
  float d = raymarch(ro, rd);
  vec3 p = ro + rd * d;

  vec3 color = vec3(0.0);

  if(d<MAX_DIST) {
    color = lighting(p, computeNormals(p));
  }

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