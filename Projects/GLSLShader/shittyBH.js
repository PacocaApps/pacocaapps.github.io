const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const loader = new THREE.TextureLoader();
const bgTexture = loader.load('background.jpg'); 
const geometry = new THREE.PlaneGeometry(2, 2);

// Raymarching fragment shader
const material = new THREE.ShaderMaterial({
  uniforms: {
        bgTexture: { value: bgTexture },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uTime: { value: 0 }
  },
  fragmentShader: `
  uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D bgTexture;

    #define MAX_STEPS 200
    #define MAX_DIST 200.0
    #define SURFACE_DIST 0.0001
       vec3 BhCenter = vec3(0.0, 0.0, -70.9);
  vec3 finalRayDir;
    float Rs = 2.0;
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
          vec3 s = vec3(8.0);
      float bh =  sdSphere(p, BhCenter,Rs);
      float gridsphere = sdSphere(p-s*round(p/s), vec3(0.0,1.0,0.0), 0.5);
      return min(bh, gridsphere);
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
    float Rs = 2.0;
    float h2 = pow(length(cross(ro, rd)), 2.0);
    for(int i = 0; i < MAX_STEPS; i++){
      vec3 p = ro + rd*dperc;
      float dS = world(p);
      float dist = length(p - BhCenter);
      if(dist > Rs) {
      vec3 toBh = normalize(BhCenter - p);
      float deflect = (1.5*Rs)/(dist*dist);
      rd = normalize(mix(rd,toBh,deflect)); 
      }
      

      dperc += dS;
      if(dperc > MAX_DIST || dS < SURFACE_DIST) {
      break;
      }

    }       finalRayDir = rd;
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
BhCenter += vec3(0.0, 0.0+ sin(uTime), 0.0);

  vec2 uv = gl_FragCoord.xy/uResolution.xy;
  uv -= 0.5;
  uv.x *= uResolution.x / uResolution.y;

  // Ray Origin - camera
  vec3 ro = vec3(0.0, 0.0, 0.0);
  // Ray Direction
  vec3 rd = normalize(vec3(uv, -1.0));
  // Raymarching
  float d = raymarch(ro, rd);

  vec3 p = ro + rd * d;
  vec3 color = vec3(0.0);

  if(d<MAX_DIST) {
    float distToBH = length(p - BhCenter);
    if(distToBH < Rs + 2.0) { // Event horizon fudge
      color = vec3(0.0);
    } else {
      color = lighting(p, computeNormals(p));
    }
  } 
    else {
      vec3 dir = normalize(finalRayDir);
    float u = 0.5 + atan(dir.x, dir.z) / (2.0 * 3.14159265);
    float v = 0.5 - asin(dir.y) / 3.14159265;
    color = texture2D(bgTexture, vec2(u, v)).rgb;
  }

  gl_FragColor = vec4(color, 1.0);
}

  `
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function animate(time) {
    material.uniforms.uTime.value = time * 0.001;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();